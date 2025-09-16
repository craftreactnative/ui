import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import ora from "ora";
import { InstallOptions } from "../types";
import {
  getComponentInfo,
  resolveDependencies,
  copyComponent,
  getAvailableComponents,
} from "../utils/component-manager";
import { initCommand } from "./init";
import { determineImportPath } from "../utils/file-system";

export async function addCommand(
  componentName: string,
  options: Partial<InstallOptions> = {}
): Promise<void> {
  const targetPath = process.cwd();

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

    // Show available components
    const available = await getAvailableComponents();
    if (available.length > 0) {
      console.log(chalk.blue("\nAvailable components:"));
      available.forEach((comp) => console.log(`  - ${comp}`));
    }
    return;
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
        "craftrn-ui",
        "components",
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

      await copyComponent(dep, targetPath);
      copySpinner.text = `Copied component ${dep}...`;
    }

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
        const componentImportPath = await determineImportPath(
          targetPath,
          entryFile,
          `craftrn-ui/components/${componentName}`
        );
        console.log(
          chalk.gray(
            `import { ${componentName} } from '${componentImportPath}';`
          )
        );
      } catch {
        // Fallback to relative import
        console.log(
          chalk.gray(
            `import { ${componentName} } from './craftrn-ui/components/${componentName}';`
          )
        );
      }
    } else {
      // Fallback to relative import
      console.log(
        chalk.gray(
          `import { ${componentName} } from './craftrn-ui/components/${componentName}';`
        )
      );
    }
  } catch (error) {
    loadingSpinner.fail(
      `Failed to install component: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
