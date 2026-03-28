import * as fs from "fs-extra";
import * as path from "path";
import { BarrelFileMode } from "../types";

function toPosixPath(value: string): string {
	return value.replace(/\\+/g, "/").replace(/\/+$/, "");
}

async function getComponentEntryExportPath(
	componentsRoot: string,
	componentName: string
): Promise<string | null> {
	const componentDir = path.join(componentsRoot, componentName);
	const tsxFile = path.join(componentDir, `${componentName}.tsx`);
	const tsFile = path.join(componentDir, `${componentName}.ts`);

	if (await fs.pathExists(tsxFile)) {
		return `./${toPosixPath(componentName)}/${componentName}`;
	}

	if (await fs.pathExists(tsFile)) {
		return `./${toPosixPath(componentName)}/${componentName}`;
	}

	return null;
}

async function listComponentNames(componentsRoot: string): Promise<string[]> {
	if (!(await fs.pathExists(componentsRoot))) {
		return [];
	}

	const entries = await fs.readdir(componentsRoot);
	const names: string[] = [];

	for (const entry of entries) {
		const fullPath = path.join(componentsRoot, entry);
		const stat = await fs.stat(fullPath);

		if (!stat.isDirectory()) {
			continue;
		}

		const exportPath = await getComponentEntryExportPath(componentsRoot, entry);
		if (exportPath) {
			names.push(entry);
		}
	}

	names.sort((a, b) => a.localeCompare(b));
	return names;
}

async function removeComponentIndexes(componentsRoot: string): Promise<void> {
	const componentNames = await listComponentNames(componentsRoot);

	for (const componentName of componentNames) {
		const indexPath = path.join(componentsRoot, componentName, "index.ts");
		if (await fs.pathExists(indexPath)) {
			await fs.remove(indexPath);
		}
	}
}

async function ensureComponentIndexes(componentsRoot: string): Promise<void> {
	const componentNames = await listComponentNames(componentsRoot);

	for (const componentName of componentNames) {
		const hasTsx = await fs.pathExists(
			path.join(componentsRoot, componentName, `${componentName}.tsx`)
		);
		const hasTs = await fs.pathExists(
			path.join(componentsRoot, componentName, `${componentName}.ts`)
		);

		if (!hasTsx && !hasTs) {
			continue;
		}

		const indexPath = path.join(componentsRoot, componentName, "index.ts");
		const expected = `export * from './${componentName}';\n`;
		await fs.writeFile(indexPath, expected, "utf8");
	}
}

async function writeFolderIndex(componentsRoot: string): Promise<void> {
	const componentNames = await listComponentNames(componentsRoot);
	const lines: string[] = [];

	for (const componentName of componentNames) {
		const exportPath = await getComponentEntryExportPath(componentsRoot, componentName);
		if (!exportPath) {
			continue;
		}

		lines.push(`export * from '${exportPath}';`);
	}

	const content = lines.length > 0 ? `${lines.join("\n")}\n` : "";
	await fs.writeFile(path.join(componentsRoot, "index.ts"), content, "utf8");
}

async function removeFolderIndex(componentsRoot: string): Promise<void> {
	const folderIndexPath = path.join(componentsRoot, "index.ts");
	if (await fs.pathExists(folderIndexPath)) {
		await fs.remove(folderIndexPath);
	}
}

/**
 * Applies the selected barrel/index strategy across the installed components root.
 */
export async function applyBarrelFileMode(
	targetPath: string,
	componentsBasePath: string,
	barrelFileMode: BarrelFileMode
): Promise<void> {
	const componentsRoot = path.join(targetPath, componentsBasePath);

	if (!(await fs.pathExists(componentsRoot))) {
		return;
	}

	if (barrelFileMode === "component") {
		await removeFolderIndex(componentsRoot);
		await ensureComponentIndexes(componentsRoot);
		return;
	}

	if (barrelFileMode === "folder") {
		await removeComponentIndexes(componentsRoot);
		await writeFolderIndex(componentsRoot);
		return;
	}

	await removeFolderIndex(componentsRoot);
	await removeComponentIndexes(componentsRoot);
}
