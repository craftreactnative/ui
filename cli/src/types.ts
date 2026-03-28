export interface ComponentInfo {
  name: string;
  description: string;
  externalDependencies: string[];
  craftrnUiComponents: string[];
  tetrislyIcons: string[];
}

/** Default destination for copied component source files. */
export const DEFAULT_COMPONENTS_PATH = "craftrn-ui/components";

/** How the user wants each component's source files structured. */
export type FileSplitMode = 'none' | 'three' | 'four';

/** How index barrel files should be handled for installed components. */
export type BarrelFileMode = 'component' | 'folder' | 'none';

/** Preferences collected from the interactive prompts before installation. */
export interface UserPreferences {
  fileSplitMode: FileSplitMode;
  componentsPath: string;
  barrelFileMode: BarrelFileMode;
}

export interface InstallOptions {
  componentName: string;
  force?: boolean;
  all?: boolean;
  fileSplitMode?: FileSplitMode;
  componentsPath?: string;
  barrelFileMode?: BarrelFileMode;
}
