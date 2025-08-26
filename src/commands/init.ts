import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import ora from "ora";
import { exec } from "child_process";
import { promisify } from "util";
import { copyThemes, getImportInstructions } from "../utils";
import { determineImportPath } from "../path-utils";

const execAsync = promisify(exec);

interface InitOptions {
  skipDeps?: boolean;
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  const targetPath = process.cwd();
  const packageJsonPath = path.join(targetPath, "package.json");

  let packageJson;
  try {
    packageJson = await fs.readJson(packageJsonPath);
  } catch (error) {
    console.error(chalk.red("Error: Could not read package.json"));
    return;
  }

  console.log(chalk.blue("🚀 Initializing craftrn-ui in your project...\n"));

  // Install required dependencies
  if (!options.skipDeps) {
    const requiredDeps = [
      "react-native-unistyles@^2",
      "react-native-gesture-handler@^2",
      "react-native-reanimated@^3",
      "react-native-svg@^14",
    ];

    const missingDeps = requiredDeps.filter((dep) => {
      // Extract package name from version specifier (e.g., "react-native-unistyles@^2" -> "react-native-unistyles")
      const packageName = dep.split("@")[0];
      return (
        !packageJson.dependencies?.[packageName] &&
        !packageJson.devDependencies?.[packageName]
      );
    });

    if (missingDeps.length > 0) {
      const depsSpinner = ora(
        `Installing required dependencies: ${missingDeps.join(", ")}...`
      ).start();

      try {
        const packageManager = await detectPackageManager(targetPath);
        const installCommand = getInstallCommand(
          packageManager,
          missingDeps.join(" ")
        );

        await execAsync(installCommand, { cwd: targetPath });
        depsSpinner.succeed(
          `Installed dependencies: ${missingDeps.join(", ")}`
        );
        
        // Check if react-native-reanimated was installed and show setup instructions
        const installedReanimated = missingDeps.some(dep => dep.includes('react-native-reanimated'));
        const installedGestureHandler = missingDeps.some(dep => dep.includes('react-native-gesture-handler'));
        
        if (installedReanimated) {
          console.log(chalk.blue('\n📋 Additional setup required for react-native-reanimated:'));
          console.log(chalk.yellow('Please follow the platform-specific installation steps at:'));
          console.log(chalk.cyan('https://docs.swmansion.com/react-native-reanimated/docs/3.x/fundamentals/getting-started#installation'));
          console.log(chalk.gray('This includes updating your babel.config.js and platform-specific configurations.'));
        }
        
        if (installedGestureHandler) {
          console.log(chalk.blue('\n📋 Additional setup required for react-native-gesture-handler:'));
          console.log(chalk.yellow('Please follow the platform-specific installation steps at:'));
          console.log(chalk.cyan('https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation'));
          console.log(chalk.gray('This includes platform-specific configurations for iOS and Android.'));
        }
      } catch (error) {
        depsSpinner.fail("Failed to install dependencies");
        console.error(chalk.yellow("Please install them manually:"));
        missingDeps.forEach((dep) =>
          console.error(chalk.gray(`  npm install ${dep}`))
        );
      }
    } else {
      console.log(chalk.green("✓ All required dependencies already installed"));
    }
  }

  const themesSpinner = ora(
    "Setting up Unistyles theme configuration..."
  ).start();

  try {
    await copyThemes(targetPath);
    themesSpinner.succeed("Unistyles theme configuration installed");
  } catch (error) {
    themesSpinner.fail("Failed to copy themes");
    console.error(
      chalk.red("Error:"),
      error instanceof Error ? error.message : "Unknown error"
    );
    return;
  }

  const importSpinner = ora(
    "Adding Unistyles theme configuration to main entry file..."
  ).start();

  try {
    await addUnistylesImport(targetPath);
    importSpinner.succeed(
      "Added Unistyles theme configuration to main entry file"
    );
  } catch (error) {
    importSpinner.warn(
      "Could not automatically add theme configuration import"
    );

    console.log(chalk.blue(getImportInstructions()));
  }

  console.log(chalk.green("\n✅ craftrn-ui initialized successfully!"));
  console.log(chalk.blue("Next steps:"));
  console.log(
    chalk.gray(
      `  1. Run ${chalk.white(
        "npx craftrn-ui@latest list"
      )} to see available components`
    )
  );
  console.log(
    chalk.gray(
      `  2. Run ${chalk.white(
        "npx craftrn-ui@latest add <component>"
      )} to add components`
    )
  );
}

async function detectPackageManager(
  targetPath: string
): Promise<"npm" | "yarn" | "pnpm"> {
  if (await fs.pathExists(path.join(targetPath, "yarn.lock"))) {
    return "yarn";
  }
  if (await fs.pathExists(path.join(targetPath, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  return "npm";
}

function getInstallCommand(
  packageManager: "npm" | "yarn" | "pnpm",
  packageName: string
): string {
  switch (packageManager) {
    case "yarn":
      return `yarn add ${packageName}`;
    case "pnpm":
      return `pnpm add ${packageName}`;
    default:
      return `npm install ${packageName}`;
  }
}

async function addUnistylesImport(targetPath: string): Promise<void> {
  const possibleEntryFiles = ["App.tsx", "app/_layout.tsx", "index.tsx"];

  let entryFile: string | null = null;

  // Find the main entry file
  for (const file of possibleEntryFiles) {
    const filePath = path.join(targetPath, file);
    if (await fs.pathExists(filePath)) {
      entryFile = filePath;
      break;
    }
  }

  if (!entryFile) {
    throw new Error(
      "Could not find main entry file (App.tsx, App.ts, index.ts, etc.)"
    );
  }

  const content = await fs.readFile(entryFile, "utf8");

  // Determine the correct import path based on project structure and existing patterns
  const importPath = await determineImportPath(
    targetPath,
    entryFile,
    "craftrn-ui/themes/unistyles"
  );
  const importStatement = `import "${importPath}";`;

  // Check if import already exists (any variant)
  if (
    content.includes(importStatement) ||
    content.includes(`import '${importPath}'`) ||
    content.includes("craftrn-ui/themes/unistyles")
  ) {
    return; // Already imported
  }

  // Add import at the very top of the file
  const lines = content.split("\n");

  // Insert at the very beginning (index 0)
  lines.splice(0, 0, importStatement);
  const newContent = lines.join("\n");

  await fs.writeFile(entryFile, newContent, "utf8");
}
