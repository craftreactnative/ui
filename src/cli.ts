#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";
import { getAvailableComponents } from "./utils";
import { ensureProjectRoot } from "./project-utils";

const program = new Command();

program
  .name("craftrn-ui")
  .description("CLI for installing craftrn-ui components")
  .version("1.0.0");

program
  .command("init")
  .description(
    "Initialize craftrn-ui in your project (install dependencies and themes)"
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
  .command("add <component>")
  .description("Add a component to your project")
  .option("--force", "Overwrite existing components")
  .action(async (componentName: string, options) => {
    try {
      await ensureProjectRoot();
      await addCommand(componentName, {
        componentName,
        force: options.force,
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
            "npx craftrn-ui@latest add <component>"
          )} to install a component`
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
