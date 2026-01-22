#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";
import { getAvailableComponents, setLatestFlag } from "./utils/component-manager";
import { ensureProjectRoot } from "./utils/project-detection";

// Function to get version from package.json
function getPackageVersion(): string {
  try {
    // Use require to read package.json from the parent directory
    const packageJson = require("../package.json");
    return packageJson.version || "1.0.0";
  } catch (error) {
    console.warn(
      "Warning: Could not read package.json version, using fallback"
    );
    return "1.0.0";
  }
}

const program = new Command();

program
  .name("craftrn-ui")
  .description("CLI for installing @craftreactnative/ui components")
  .version(getPackageVersion());

program
  .command("init")
  .description(
    "Initialize @craftreactnative/ui in your project (install dependencies and themes)"
  )
  .option("--skip-deps", "Skip installing dependencies")
  .action(async (options) => {
    try {
      await ensureProjectRoot();
      await initCommand({
        skipDeps: options.skipDeps,
      });
      process.exit(0);
    } catch (error) {
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

program
  .command("add [components...]")
  .description("Add one or more components to your project")
  .option("--force", "Overwrite existing components")
  .option("--all", "Install all available components")
  .option("--latest", "Force download latest components from GitHub (bypass cache)")
  .action(async (componentNames: string[], options) => {
    try {
      await ensureProjectRoot();
      
      // Pass latest flag to component manager
      if (options.latest) {
        setLatestFlag(true);
      }

      if (options.all) {
        // Get all available components when --all flag is used
        const availableComponents = await getAvailableComponents();
        if (availableComponents.length === 0) {
          console.log(chalk.yellow("No components available to install"));
          return;
        }

        console.log(
          chalk.blue(
            `\n📦 Installing all ${
              availableComponents.length
            } available component(s): ${availableComponents.join(", ")}\n`
          )
        );

        let successCount = 0;
        for (const componentName of availableComponents) {
          console.log(chalk.yellow(`\n⏳ Installing ${componentName}...`));
          const success = await addCommand(componentName, {
            componentName,
            force: options.force,
            all: options.all,
          });
          if (success) {
            successCount++;
          }
        }

        if (successCount > 0) {
          console.log(
            chalk.green(
              `\n✅ Successfully installed ${successCount} component(s)!`
            )
          );
        } else {
          console.log(chalk.yellow("\n⚠️  No components were installed"));
        }
        process.exit(0);
      } else {
        if (componentNames.length === 0) {
          console.error(
            chalk.red(
              "Error: Please specify component names or use --all to install all components"
            )
          );
          console.log(
            chalk.gray(
              "Usage: npx @craftreactnative/ui add [components...] or npx @craftreactnative/ui add --all"
            )
          );
          process.exit(1);
        }

        console.log(
          chalk.blue(
            `\n📦 Installing ${
              componentNames.length
            } component(s): ${componentNames.join(", ")}\n`
          )
        );

        let successCount = 0;
        for (const componentName of componentNames) {
          console.log(chalk.yellow(`\n⏳ Installing ${componentName}...`));
          const success = await addCommand(componentName, {
            componentName,
            force: options.force,
          });
          if (success) {
            successCount++;
          }
        }

        if (successCount > 0) {
          console.log(
            chalk.green(
              `\n✅ Successfully installed ${successCount} component(s)!`
            )
          );
          process.exit(0);
        } else {
          console.log(chalk.red("\n❌ No components were installed"));
          process.exit(1);
        }
      }
    } catch (error) {
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

program
  .command("list")
  .alias("ls")
  .description("List available components")
  .action(async () => {
    try {
      const components = await getAvailableComponents();

      if (components.length === 0) {
        console.log(chalk.yellow("No components available"));
        return;
      }

      console.log(chalk.blue("Available components:"));
      components.forEach((comp) => {
        console.log(`  - ${chalk.green(comp)}`);
      });

      console.log(
        chalk.gray(
          `\nUse ${chalk.white(
            "npx @craftreactnative/ui@latest add [components...]"
          )} to install components or ${chalk.white(
            "npx @craftreactnative/ui@latest add --all"
          )} to install all components`
        )
      );
      process.exit(0);
    } catch (error) {
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

program.parse();
