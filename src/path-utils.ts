import * as fs from 'fs-extra';
import * as path from 'path';

export async function determineImportPath(
  targetPath: string,
  fromFile: string,
  toPath: string
): Promise<string> {
  // Check existing imports in the file to detect alias patterns
  const content = await fs.readFile(fromFile, 'utf8');
  const pathAlias = detectAliasFromImports(content);

  if (pathAlias) {
    return `${pathAlias}/${toPath}`;
  }

  // Determine relative path based on file location
  const fromDir = path.dirname(fromFile);
  const relativePath = path.relative(
    fromDir,
    path.join(targetPath, toPath)
  );

  // Ensure path starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    return `./${relativePath}`;
  }

  return relativePath;
}

export function detectAliasFromImports(content: string): string | null {
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('import ')) {
      // Look for common alias patterns in existing imports
      if (trimmed.includes('from "@/') || trimmed.includes('from \'@/')) {
        return '@';
      }
      if (trimmed.includes('from "~/') || trimmed.includes('from \'~/')) {
        return '~';
      }
      if (trimmed.includes('from "src/') || trimmed.includes('from \'src/')) {
        return 'src';
      }
    }
  }
  
  return null;
}