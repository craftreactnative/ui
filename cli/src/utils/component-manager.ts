import * as fs from "fs-extra";
import * as path from "path";
import { ComponentInfo } from "../types";
import { ensureComponentsDownloaded } from "./github-downloader";

interface SourcePaths {
  componentsPath: string;
  themesPath: string;
}

let cachedPaths: SourcePaths | null = null;
let refreshFlag = false;

/**
 * Sets the latest flag for component downloads
 */
export function setLatestFlag(latest: boolean): void {
  refreshFlag = latest;
  if (latest) {
    cachedPaths = null; // Clear in-memory cache
  }
}

/**
 * Ensures components are downloaded and returns the source paths
 */
async function ensureSourcePaths(): Promise<SourcePaths> {
  if (!cachedPaths || refreshFlag) {
    const sourcePath = await ensureComponentsDownloaded({ forceLatest: refreshFlag });
    cachedPaths = {
      componentsPath: path.join(sourcePath, "components"),
      themesPath: path.join(sourcePath, "themes"),
    };
    refreshFlag = false; // Reset after use
  }
  return cachedPaths;
}

/**
 * Retrieves component information from info.json file
 */
export async function getComponentInfo(
  componentName: string
): Promise<ComponentInfo | null> {
  const { componentsPath } = await ensureSourcePaths();
  const infoPath = path.join(componentsPath, componentName, "info.json");

  if (!(await fs.pathExists(infoPath))) {
    return null;
  }

  const info = await fs.readJson(infoPath);
  return info as ComponentInfo;
}

/**
 * Gets list of all available components by scanning for directories with info.json
 */
export async function getAvailableComponents(): Promise<string[]> {
  const { componentsPath } = await ensureSourcePaths();
  if (!(await fs.pathExists(componentsPath))) {
    return [];
  }

  const dirs = await fs.readdir(componentsPath);
  const components: string[] = [];

  for (const dir of dirs) {
    const componentPath = path.join(componentsPath, dir);
    const stat = await fs.stat(componentPath);

    if (stat.isDirectory()) {
      const infoPath = path.join(componentPath, "info.json");
      if (await fs.pathExists(infoPath)) {
        components.push(dir);
      }
    }
  }

  return components;
}

/**
 * Resolves all dependencies for a component including nested dependencies
 */
export async function resolveDependencies(
  componentName: string,
  visited = new Set<string>()
): Promise<string[]> {
  if (visited.has(componentName)) {
    return [];
  }

  visited.add(componentName);
  const info = await getComponentInfo(componentName);

  if (!info) {
    throw new Error(`Component ${componentName} not found`);
  }

  const dependencies = [componentName];

  // Resolve craftrn-ui component dependencies
  for (const dep of info.craftrnUiComponents) {
    const depDependencies = await resolveDependencies(dep, visited);
    dependencies.unshift(
      ...depDependencies.filter((d) => !dependencies.includes(d))
    );
  }

  return dependencies;
}

/**
 * Copies a component from source to target location
 */
export async function copyComponent(
  componentName: string,
  targetPath: string
): Promise<void> {
  const { componentsPath } = await ensureSourcePaths();
  const sourcePath = path.join(componentsPath, componentName);
  const destPath = path.join(
    targetPath,
    "craftrn-ui",
    "components",
    componentName
  );

  if (!(await fs.pathExists(sourcePath))) {
    throw new Error(
      `Component ${componentName} source not found at: ${sourcePath}`
    );
  }

  await fs.ensureDir(path.dirname(destPath));
  await fs.copy(sourcePath, destPath);
}

/**
 * Copies all theme files to target location
 */
export async function copyThemes(targetPath: string): Promise<void> {
  const { themesPath } = await ensureSourcePaths();
  const destPath = path.join(targetPath, "craftrn-ui", "themes");

  if (!(await fs.pathExists(themesPath))) {
    throw new Error(
      `Themes source not found at: ${themesPath}\n` +
        `Current working directory: ${process.cwd()}`
    );
  }

  await fs.ensureDir(path.dirname(destPath));
  await fs.copy(themesPath, destPath);
}

/**
 * Returns installation and setup instructions for the user
 */
export function getImportInstructions(): string {
  return `
Unistyles Configuration Required:

1. Import the unistyles configuration in your app's entry point:

   For React Native CLI projects: Add to App.tsx or index.ts:
   import "@/craftrn-ui/themes/unistyles";

   For Expo projects with Expo Router:
   ✅ This has been automatically configured for you!

2. Make sure you have all required dependencies installed:

   npm install react-native-unistyles@^3 react-native-edge-to-edge react-native-nitro-modules@0.29.4 react-native-gesture-handler@^2 react-native-reanimated@^3 react-native-svg@^14

3. Follow the setup instructions for each dependency:
   - react-native-unistyles: No additional setup required
   - react-native-gesture-handler: Follow platform-specific setup
   - react-native-reanimated: Follow platform-specific setup
   - react-native-svg: Follow platform-specific setup

That's it! Your components are ready to use.
`;
}
