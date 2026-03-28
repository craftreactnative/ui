import chalk from "chalk";
import * as fs from "fs-extra";
import ora from "ora";
import * as path from "path";
import { DEFAULT_COMPONENTS_PATH, InstallOptions } from "../types";
import { applyBarrelFileMode } from "../utils/barrel-manager";
import {
  copyComponent,
  getAvailableComponents,
  getComponentInfo,
  resolveDependencies,
} from "../utils/component-manager";
import { splitComponentFiles } from "../utils/file-splitter";
import { determineImportPath } from "../utils/file-system";
import { initCommand } from "./init";

function toPosixPath(value: string): string {
  return value.replace(/\\+/g, "/").replace(/\/+$/, "");
}

export async function addCommand(
  componentName: string,
  options: Partial<InstallOptions> = {}
): Promise<boolean> {
  const targetPath = process.cwd();
  const componentsBasePath = toPosixPath(
    options.componentsPath || DEFAULT_COMPONENTS_PATH
  );
  const barrelFileMode = options.barrelFileMode || "component";

  // Check if craftrn-ui folder exists, if not, run init
  const craftrnUiPath = path.join(targetPath, "craftrn-ui");
  if (!(await fs.pathExists(craftrnUiPath))) {
    console.log(
      chalk.blue(
        "😅 @craftreactnative/ui not found. Initializing project first...\n"
      )
    );
    await initCommand();
    console.log(chalk.blue("\nNow adding component...\n"));
  }

  // Validate component exists
  const spinner = ora(`Checking component ${componentName}...`).start();

  const componentInfo = await getComponentInfo(componentName);
  if (!componentInfo) {
    spinner.fail(`Component ${chalk.red(componentName)} not found`);

    // Show available components only if not using --all flag
    if (!options.all) {
      const available = await getAvailableComponents();
      if (available.length > 0) {
        console.log(chalk.blue("\nAvailable components:"));
        available.forEach((comp) => console.log(`  - ${comp}`));
      }
    }
    return false;
  }

  spinner.succeed(`Found component ${chalk.green(componentName)}`);

  // Resolve dependencies
  const loadingSpinner = ora("Resolving dependencies...").start();

  try {
    const dependencies = await resolveDependencies(componentName);
    loadingSpinner.succeed(
      `Resolved ${dependencies.length} component(s): ${chalk.cyan(
        dependencies.join(", ")
      )}`
    );

    // Copy components
    const copySpinner = ora("Copying components...").start();

    for (const dep of dependencies) {
      const componentPath = path.join(
        targetPath,
        componentsBasePath,
        dep
      );

      if ((await fs.pathExists(componentPath)) && !options.force) {
        copySpinner.info(
          `Component ${chalk.yellow(
            dep
          )} already exists (use --force to overwrite)`
        );
        continue;
      }

      await copyComponent(dep, targetPath, componentsBasePath);

      if (options.fileSplitMode && options.fileSplitMode !== "none") {
        const componentDir = path.join(targetPath, componentsBasePath, dep);
        await splitComponentFiles(componentDir, dep, options.fileSplitMode);
      }

      copySpinner.text = `Copied component ${dep}...`;
    }

    await applyBarrelFileMode(targetPath, componentsBasePath, barrelFileMode);

    copySpinner.succeed(
      `Successfully copied ${dependencies.length} component(s)`
    );

    // Show success message and usage
    console.log(chalk.green("\n✅ Installation complete!"));
    console.log(chalk.blue(`Example import for ${componentName}:`));

    // Find main entry file to determine import style
    const possibleEntryFiles = [
      "App.tsx",
      "App.js",
      "app/_layout.tsx",
      "app/_layout.js",
    ];
    let entryFile: string | null = null;

    for (const file of possibleEntryFiles) {
      const filePath = path.join(targetPath, file);
      if (await fs.pathExists(filePath)) {
        entryFile = filePath;
        break;
      }
    }

    if (entryFile) {
      try {
        const importTarget =
          barrelFileMode === "folder"
            ? `${componentsBasePath}`
            : barrelFileMode === "none"
              ? `${componentsBasePath}/${componentName}/${componentName}`
              : `${componentsBasePath}/${componentName}`;

        const componentImportPath = await determineImportPath(
          targetPath,
          entryFile,
          importTarget
        );
        console.log(
          chalk.gray(
            `import { ${componentName} } from '${componentImportPath}';`
          )
        );
      } catch {
        // Fallback to relative import
        const fallbackImportPath =
          barrelFileMode === "folder"
            ? `./${componentsBasePath}`
            : barrelFileMode === "none"
              ? `./${componentsBasePath}/${componentName}/${componentName}`
              : `./${componentsBasePath}/${componentName}`;

        console.log(
          chalk.gray(
            `import { ${componentName} } from '${fallbackImportPath}';`
          )
        );
      }
    } else {
      // Fallback to relative import
      const fallbackImportPath =
        barrelFileMode === "folder"
          ? `./${componentsBasePath}`
          : barrelFileMode === "none"
            ? `./${componentsBasePath}/${componentName}/${componentName}`
            : `./${componentsBasePath}/${componentName}`;

      console.log(
        chalk.gray(
          `import { ${componentName} } from '${fallbackImportPath}';`
        )
      );
    }
    return true;
  } catch (error) {
    loadingSpinner.fail(
      `Failed to install component: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return false;
  }
}
