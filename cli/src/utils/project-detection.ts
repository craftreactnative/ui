import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";

/**
 * Finds the CLI package root by traversing up from the current module location
 * This is used to locate the CLI's own assets (themes, components) regardless of
 * where the CLI is executed from
 */
export function findCliPackageRoot(): string {
  let currentDir = __dirname;

  // Keep going up until we find a package.json with @craftreactnative/ui
  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = fs.readJsonSync(packageJsonPath);
        if (packageJson.name === "@craftreactnative/ui") {
          return currentDir;
        }
      } catch (error) {
        // Continue searching if we can't read the package.json
      }
    }
    currentDir = path.dirname(currentDir);
  }

  // Fallback: try to resolve the package through require.resolve
  try {
    const packagePath = require.resolve("@craftreactnative/ui/package.json");
    return path.dirname(packagePath);
  } catch (error) {
    // Final fallback: assume we're in dist/utils and go up two levels
    return path.join(__dirname, "..", "..");
  }
}

/**
 * Ensures we're running from a valid React Native project root
 * Validates package.json exists and checks for React Native/TypeScript setup
 */
export async function ensureProjectRoot(): Promise<void> {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, "package.json");

  if (!(await fs.pathExists(packageJsonPath))) {
    console.error(
      chalk.red("Error: No package.json found in current directory.")
    );
    console.error(
      chalk.yellow(
        "Please run this command from your React Native project root."
      )
    );
    process.exit(1);
  }

  try {
    const packageJson = await fs.readJson(packageJsonPath);
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check if it's a React Native project
    const hasReactNative =
      deps["react-native"] || deps["@react-native/cli"] || deps["expo"];

    if (!hasReactNative) {
      console.warn(
        chalk.yellow(
          "Warning: This doesn't appear to be a React Native project."
        )
      );
      console.warn(
        chalk.gray(
          "@craftreactnative/ui components are designed for React Native apps."
        )
      );
    }

    // Check if TypeScript is configured
    const hasTypeScript =
      deps["typescript"] || deps["@types/react"] || deps["@types/react-native"];

    const hasTsConfig = await fs.pathExists(path.join(cwd, "tsconfig.json"));

    if (!hasTypeScript && !hasTsConfig) {
      console.error(chalk.red("Error: TypeScript support not detected."));
      console.error(
        chalk.yellow(
          "@craftreactnative/ui components are written in TypeScript and require TypeScript support."
        )
      );
      console.error(chalk.gray("Please set up TypeScript in your project:"));
      console.error(
        chalk.gray(
          "  npm install --save-dev typescript @types/react @types/react-native"
        )
      );
      console.error(chalk.gray("  npx tsc --init"));
      process.exit(1);
    }

    if (!hasTsConfig) {
      console.warn(chalk.yellow("Warning: No tsconfig.json found."));
      console.warn(chalk.gray("You may need to create one: npx tsc --init"));
    }
  } catch (error) {
    console.error(chalk.red("Error: Could not read package.json"));
    process.exit(1);
  }
}

/**
 * Detects if the project is an Expo project
 * Checks for expo dependency and expo configuration files
 */
export async function isExpo(targetPath?: string): Promise<boolean> {
  const projectPath = targetPath || process.cwd();
  const packageJsonPath = path.join(projectPath, "package.json");

  try {
    const packageJson = await fs.readJson(packageJsonPath);

    // Check if expo is in dependencies
    const hasExpoDep =
      packageJson.dependencies?.expo || packageJson.devDependencies?.expo;

    // Check for expo configuration files
    const hasAppJson = await fs.pathExists(path.join(projectPath, "app.json"));
    const hasAppConfig = await fs.pathExists(
      path.join(projectPath, "app.config.js")
    );

    return !!(hasExpoDep || hasAppJson || hasAppConfig);
  } catch (error) {
    return false;
  }
}

/**
 * Detects if the project uses Expo Router
 * Checks for expo-router dependency in package.json
 */
export async function hasExpoRouter(targetPath?: string): Promise<boolean> {
  const projectPath = targetPath || process.cwd();
  const packageJsonPath = path.join(projectPath, "package.json");

  try {
    const packageJson = await fs.readJson(packageJsonPath);

    // Check if expo-router is in dependencies
    const hasExpoRouterDep =
      packageJson.dependencies?.["expo-router"] ||
      packageJson.devDependencies?.["expo-router"];

    return !!hasExpoRouterDep;
  } catch (error) {
    return false;
  }
}

/**
 * Creates an index.ts file for Expo Router projects with craftrn-ui theme import
 */
export async function createExpoRouterEntryFile(
  targetPath: string
): Promise<void> {
  const indexPath = path.join(targetPath, "index.ts");

  // Check if index.ts already exists
  if (await fs.pathExists(indexPath)) {
    const content = await fs.readFile(indexPath, "utf8");

    // If it already has our import, don't modify it
    if (content.includes("@/craftrn-ui/themes/unistyles")) {
      return;
    }

    // If it has expo-router/entry but not our import, add our import
    if (content.includes("expo-router/entry")) {
      const newContent = content + '\nimport "@/craftrn-ui/themes/unistyles";';
      await fs.writeFile(indexPath, newContent, "utf8");
      return;
    }
  }

  // Create new index.ts file
  const content = `import 'expo-router/entry'
import "@/craftrn-ui/themes/unistyles";
`;

  await fs.writeFile(indexPath, content, "utf8");
}

/**
 * Updates package.json to use index.ts as the main entry point instead of expo-router/entry
 */
export async function updatePackageJsonMainEntry(
  targetPath: string
): Promise<void> {
  const packageJsonPath = path.join(targetPath, "package.json");

  try {
    const packageJson = await fs.readJson(packageJsonPath);

    // Only update if main is currently set to expo-router/entry
    if (packageJson.main === "expo-router/entry") {
      packageJson.main = "index.ts";
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  } catch (error) {
    throw new Error(
      `Failed to update package.json: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Detects the main app/source folder for the project
 * For Expo projects, it's usually 'app'
 * For React Native CLI, it could be 'src' or the root
 */
export async function detectRootFolder(targetPath: string): Promise<string> {
  // Check for common folders in order of preference
  const possibleRoots = ["app", "src"];

  for (const root of possibleRoots) {
    const rootPath = path.join(targetPath, root);
    if (await fs.pathExists(rootPath)) {
      const stats = await fs.stat(rootPath);
      if (stats.isDirectory()) {
        return root;
      }
    }
  }

  // Default fallback to 'app' for Expo projects or '.' for others
  const isExpoProject = await isExpo(targetPath);
  return isExpoProject ? "app" : ".";
}
