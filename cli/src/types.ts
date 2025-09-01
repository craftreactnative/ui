export interface ComponentInfo {
  name: string;
  description: string;
  externalDependencies: string[];
  craftrnUiComponents: string[];
  tetrislyIcons: string[];
}

export interface InstallOptions {
  componentName: string;
  force?: boolean;
}