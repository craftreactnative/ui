import * as fs from "fs-extra";
import * as path from "path";
import { detectRootFolder } from "./project-detection";

const UNISTYLES_PLUGIN = "react-native-unistyles/plugin";

/**
 * Checks if babel.config.js exists in the target path
 */
export async function babelConfigExists(targetPath: string): Promise<boolean> {
  const babelConfigPath = path.join(targetPath, "babel.config.js");
  return fs.pathExists(babelConfigPath);
}

/**
 * Creates a new babel.config.js file with the unistyles plugin
 */
export async function createBabelConfig(
  targetPath: string,
  rootFolder: string
): Promise<void> {
  const babelConfigPath = path.join(targetPath, "babel.config.js");

  const babelConfig = `module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '${UNISTYLES_PLUGIN}',
        {
          // pass root folder of your application
          // all files under this folder will be processed by the Babel plugin
          root: '${rootFolder}',
        },
      ],
    ],
  };
};
`;

  await fs.writeFile(babelConfigPath, babelConfig, "utf8");
}

/**
 * Modifies an existing babel.config.js file to add the unistyles plugin
 */
export async function addUnistylesToBabelConfig(
  targetPath: string,
  rootFolder: string
): Promise<boolean> {
  const babelConfigPath = path.join(targetPath, "babel.config.js");

  try {
    const content = await fs.readFile(babelConfigPath, "utf8");

    // Check if unistyles plugin is already configured
    if (content.includes(UNISTYLES_PLUGIN)) {
      return false; // Already configured
    }

    // Parse the babel config to understand its structure
    // This is a simplified approach - we'll try to add the plugin to the plugins array

    // Look for plugins array - handle both single and multi-line formats
    const pluginsRegex = /plugins\s*:\s*\[([^\]]*)\]/s;
    const pluginsMatch = content.match(pluginsRegex);

    const unistylesPluginConfig = `[
        '${UNISTYLES_PLUGIN}',
        {
          // pass root folder of your application
          // all files under this folder will be processed by the Babel plugin
          root: '${rootFolder}',
        },
      ]`;

    if (pluginsMatch) {
      // Plugins array exists, add our plugin to it
      const existingPlugins = pluginsMatch[1].trim();

      let newPluginsContent: string;
      if (existingPlugins === "") {
        // Empty plugins array
        newPluginsContent = `\n      ${unistylesPluginConfig}\n    `;
      } else {
        // Has existing plugins, add ours with a comma
        newPluginsContent = `${existingPlugins},\n      ${unistylesPluginConfig}`;
      }

      const newContent = content.replace(
        pluginsRegex,
        `plugins: [${newPluginsContent}]`
      );

      await fs.writeFile(babelConfigPath, newContent, "utf8");
      return true;
    } else {
      // No plugins array found, add one
      // Look for the return statement and its closing brace
      const returnObjectRegex = /(return\s*\{)([\s\S]*?)(\n\s*})/;
      const returnMatch = content.match(returnObjectRegex);

      if (returnMatch) {
        const returnStart = returnMatch[1]; // "return {"
        const returnBody = returnMatch[2]; // content inside return object
        const returnEnd = returnMatch[3]; // closing "}"

        // Check if there's existing content that needs a comma
        const needsComma =
          returnBody.trim().length > 0 && !returnBody.trim().endsWith(",");
        const comma = needsComma ? "," : "";

        const pluginsSection = `${comma}
    plugins: [
      ${unistylesPluginConfig}
    ]`;

        const newContent = content.replace(
          returnObjectRegex,
          `${returnStart}${returnBody}${pluginsSection}${returnEnd}`
        );

        await fs.writeFile(babelConfigPath, newContent, "utf8");
        return true;
      }
    }

    throw new Error("Could not parse babel.config.js structure");
  } catch (error) {
    throw new Error(
      `Failed to modify babel.config.js: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Main function to setup babel configuration with unistyles plugin
 */
export async function setupBabelConfig(targetPath: string): Promise<void> {
  const rootFolder = await detectRootFolder(targetPath);
  const configExists = await babelConfigExists(targetPath);

  if (!configExists) {
    // Create new babel.config.js assuming Expo
    await createBabelConfig(targetPath, rootFolder);
  } else {
    // Modify existing babel.config.js
    const wasModified = await addUnistylesToBabelConfig(targetPath, rootFolder);
    if (!wasModified) {
      // Plugin was already configured, nothing to do
      return;
    }
  }
}
