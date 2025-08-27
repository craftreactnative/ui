import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export async function ensureProjectRoot(): Promise<void> {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');
  
  if (!await fs.pathExists(packageJsonPath)) {
    console.error(chalk.red('Error: No package.json found in current directory.'));
    console.error(chalk.yellow('Please run this command from your React Native project root.'));
    process.exit(1);
  }
  
  try {
    const packageJson = await fs.readJson(packageJsonPath);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Check if it's a React Native project
    const hasReactNative = deps['react-native'] || 
                          deps['@react-native/cli'] || 
                          deps['expo'];
    
    if (!hasReactNative) {
      console.warn(chalk.yellow('Warning: This doesn\'t appear to be a React Native project.'));
      console.warn(chalk.gray('@craftreactnative/ui components are designed for React Native apps.'));
    }
    
    // Check if TypeScript is configured
    const hasTypeScript = deps['typescript'] || 
                         deps['@types/react'] || 
                         deps['@types/react-native'];
    
    const hasTsConfig = await fs.pathExists(path.join(cwd, 'tsconfig.json'));
    
    if (!hasTypeScript && !hasTsConfig) {
      console.error(chalk.red('Error: TypeScript support not detected.'));
      console.error(chalk.yellow('@craftreactnative/ui components are written in TypeScript and require TypeScript support.'));
      console.error(chalk.gray('Please set up TypeScript in your project:'));
      console.error(chalk.gray('  npm install --save-dev typescript @types/react @types/react-native'));
      console.error(chalk.gray('  npx tsc --init'));
      process.exit(1);
    }
    
    if (!hasTsConfig) {
      console.warn(chalk.yellow('Warning: No tsconfig.json found.'));
      console.warn(chalk.gray('You may need to create one: npx tsc --init'));
    }
    
  } catch (error) {
    console.error(chalk.red('Error: Could not read package.json'));
    process.exit(1);
  }
}