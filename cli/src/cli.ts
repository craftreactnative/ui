#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";
import { getAvailableComponents } from "./utils/component-manager";
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
  .action(async (componentNames: string[], options) => {
    try {
      await ensureProjectRoot();

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

        for (const componentName of availableComponents) {
          console.log(chalk.yellow(`\n⏳ Installing ${componentName}...`));
          await addCommand(componentName, {
            componentName,
            force: options.force,
            all: options.all,
          });
        }

        console.log(
          chalk.green(
            `\n✅ Successfully installed all ${availableComponents.length} component(s)!`
          )
        );
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

        for (const componentName of componentNames) {
          console.log(chalk.yellow(`\n⏳ Installing ${componentName}...`));
          await addCommand(componentName, {
            componentName,
            force: options.force,
          });
        }

        console.log(
          chalk.green(
            `\n✅ Successfully installed all ${componentNames.length} component(s)!`
          )
        );
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
    } catch (error) {
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

program.parse();
