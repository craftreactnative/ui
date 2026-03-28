import * as fs from "fs-extra";
import * as path from "path";
import { FileSplitMode } from "../types";

// ─── Segment types ───────────────────────────────────────────────────────────

type SegmentKind = "import" | "type" | "style" | "util" | "component";

interface Segment {
	content: string;
	kind: SegmentKind;
}

// ─── Parser ──────────────────────────────────────────────────────────────────

/**
 * Split TypeScript source into top-level declaration segments.
 *
 * Strategy: track bracket depth and string/comment state character by
 * character; emit a segment each time a semicolon is encountered at depth 0.
 * This handles the vast majority of TypeScript top-level declarations (imports,
 * type aliases, interfaces, const/function declarations, StyleSheet.create).
 */
function parseTopLevelSegments(source: string): string[] {
	const segments: string[] = [];
	let depth = 0;
	let inString: '"' | "'" | "`" | null = null;
	let inLineComment = false;
	let inBlockComment = false;
	let i = 0;
	const n = source.length;

	// segStart tracks the beginning of the current segment (in source indices).
	// Skip leading whitespace so segments don't begin with blank lines.
	while (i < n && /\s/.test(source[i])) i++;
	let segStart = i;

	while (i < n) {
		const ch = source[i];
		const next = source[i + 1] ?? "";

		// ── Line comment ────────────────────────────────────────────────────────
		if (!inString && !inBlockComment && ch === "/" && next === "/") {
			inLineComment = true;
			i += 2;
			continue;
		}
		if (inLineComment) {
			if (ch === "\n") inLineComment = false;
			i++;
			continue;
		}

		// ── Block comment ───────────────────────────────────────────────────────
		if (!inString && ch === "/" && next === "*") {
			inBlockComment = true;
			i += 2;
			continue;
		}
		if (inBlockComment) {
			if (ch === "*" && next === "/") {
				inBlockComment = false;
				i += 2;
			} else {
				i++;
			}
			continue;
		}

		// ── Template literals ───────────────────────────────────────────────────
		if (inString === "`") {
			if (ch === "\\") {
				i += 2;
				continue;
			}
			if (ch === "`") inString = null;
			i++;
			continue;
		}

		// ── Regular strings ─────────────────────────────────────────────────────
		if (inString) {
			if (ch === "\\") {
				i += 2;
				continue;
			}
			if (ch === inString) inString = null;
			i++;
			continue;
		}

		// ── String open ─────────────────────────────────────────────────────────
		if (ch === '"' || ch === "'" || ch === "`") {
			inString = ch;
			i++;
			continue;
		}

		// ── Bracket depth ───────────────────────────────────────────────────────
		if (ch === "{" || ch === "(" || ch === "[") depth++;
		if (ch === "}" || ch === ")" || ch === "]") depth--;

		// ── Segment boundary ────────────────────────────────────────────────────
		if (ch === ";" && depth === 0) {
			const seg = source.slice(segStart, i + 1).trim();
			if (seg && seg !== ";") segments.push(seg);
			i++;
			// Skip whitespace between segments
			while (i < n && /\s/.test(source[i])) i++;
			segStart = i;
			continue;
		}

		i++;
	}

	// Catch any trailing content (shouldn't normally exist in valid TS)
	const remaining = source.slice(segStart).trim();
	if (remaining && remaining !== ";") segments.push(remaining);

	return segments;
}

// ─── Classifier ──────────────────────────────────────────────────────────────

/**
 * Return the first meaningful (non-comment) line of a segment so classification
 * regexes don't accidentally match JSDoc text.
 */
function firstCodeLine(segment: string): string {
	const stripped = segment
		.replace(/\/\*[\s\S]*?\*\//g, "") // block comments
		.replace(/\/\/.*/g, ""); // line comments
	return stripped.trimStart().split("\n")[0].trim();
}

function classifySegment(segment: string, componentName: string): SegmentKind {
	const first = firstCodeLine(segment);

	if (first.startsWith("import ")) return "import";

	if (/^(?:export\s+)?(?:type|interface)\s+/.test(first)) return "type";

	if (/^(?:export\s+)?const\s+styles\s*=\s*StyleSheet\.create/.test(first))
		return "style";

	// Primary component: export const/function ComponentName…
	if (
		new RegExp(
			`^export\\s+(?:default\\s+)?(?:const|function)\\s+${componentName}[\\s<(]`
		).test(first)
	) {
		return "component";
	}

	return "util";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Return the declared identifier name from a segment (exported or not). */
function getDeclaredName(segment: string): string | null {
	const first = firstCodeLine(segment);
	const match = first.match(
		/^(?:export\s+(?:default\s+)?)?(?:const|function|type|interface|class|enum|let|var)\s+(\w+)/
	);
	return match ? match[1] : null;
}

/**
 * Add `export` to a declaration if it doesn't already have it.
 * Works after JSDoc comment prefixes.
 */
function makeExported(segment: string): string {
	if (/^export\s/.test(firstCodeLine(segment))) return segment;
	// Insert 'export ' before the first declaration keyword
	return segment.replace(
		/\b(const|function|class|let|var|type|interface)(\s+\w)/,
		"export $1$2"
	);
}

/**
 * Remove all named/default imports from a single-module import that are NOT
 * mentioned in `keepNames`. Returns null if the result would be an empty
 * import (side-effect imports are always kept).
 */
function filterImportStatement(
	importStmt: string,
	keepNames: Set<string>
): string | null {
	// Side-effect import: import 'module'  — always keep
	if (/^import\s+['"]/.test(importStmt)) return importStmt;

	// Collect what's kept
	let result = importStmt;

	// Remove named imports that aren't needed: { A, B, C }
	result = result.replace(/\{([^}]*)\}/, (_match, inner: string) => {
		const kept = inner
			.split(",")
			.map((s) => s.trim())
			.filter((s) => {
				if (!s) return false;
				// Handle "X as Y" and "type X"
				const name = s.split(/\s+/).pop()!;
				return keepNames.has(name);
			});
		return kept.length ? `{ ${kept.join(", ")} }` : "";
	});

	// Remove default import if not needed
	result = result.replace(
		/^(import\s+)(\w+)(,?\s*)/,
		(_m, prefix: string, name: string, comma: string) => {
			if (keepNames.has(name)) return _m;
			// Strip default import; keep the rest
			return prefix + (comma.includes(",") ? "" : "");
		}
	);

	// Remove namespace import if not needed
	result = result.replace(/\*\s+as\s+(\w+)/, (_m, name: string) => {
		return keepNames.has(name) ? _m : "";
	});

	// Clean up empty braces and stray commas
	result = result
		.replace(/,\s*\{\s*\}/, "")
		.replace(/\{\s*\},?\s*/, "")
		.replace(/,\s*from/, " from")
		.replace(/import\s+from/, "import from"); // shouldn't happen, guard

	// If nothing left between `import` and `from`, it's an empty import
	if (/^import\s+from\s+['"]/.test(result.trim())) return null;
	if (/^import\s*;/.test(result.trim())) return null;

	return result.trim();
}

/** Extract every identifier name referenced in a code string. */
function identifiersIn(code: string): Set<string> {
	const matches = code.match(/\b[A-Za-z_$][\w$]*\b/g) ?? [];
	return new Set(matches);
}

/** Extract all identifiers imported by an import statement. */
function importedNames(importStmt: string): string[] {
	const names: string[] = [];

	// Default import
	const defaultMatch = importStmt.match(/^import\s+(\w+)(?:\s*,|\s+from)/);
	if (defaultMatch) names.push(defaultMatch[1]);

	// Named imports { A, B as C }
	const namedMatch = importStmt.match(/\{([^}]+)\}/);
	if (namedMatch) {
		namedMatch[1].split(",").forEach((s) => {
			const name = s.trim().split(/\s+/).pop();
			if (name) names.push(name);
		});
	}

	// Namespace import * as X
	const nsMatch = importStmt.match(/\*\s+as\s+(\w+)/);
	if (nsMatch) names.push(nsMatch[1]);

	return names;
}

/**
 * From the original import statements, keep only those (or parts thereof)
 * that are actually referenced in `targetCode`.
 */
function relevantImports(imports: string[], targetCode: string): string[] {
	const usedIds = identifiersIn(targetCode);
	const result: string[] = [];

	for (const imp of imports) {
		const names = importedNames(imp);
		const needed = new Set(names.filter((n) => usedIds.has(n)));
		if (needed.size === 0) continue;
		const filtered = filterImportStatement(imp, needed);
		if (filtered) result.push(filtered);
	}

	return result;
}

/** Join non-empty parts with double newlines and ensure trailing newline. */
function buildFile(...parts: (string | string[])[]): string {
	const flat = parts
		.flat()
		.map((s) => s.trim())
		.filter(Boolean);
	return flat.join("\n\n") + "\n";
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Split a component's main `.tsx` file into 3 or 4 files in-place.
 *
 * **Three files** (`mode === 'three'`):
 *   - `ComponentName.types.ts`  — type & interface declarations
 *   - `ComponentName.styles.ts` — StyleSheet.create block
 *   - `ComponentName.tsx`       — component + utility declarations
 *
 * **Four files** (`mode === 'four'`):
 *   - `ComponentName.types.ts`  — type & interface declarations
 *   - `ComponentName.styles.ts` — StyleSheet.create block
 *   - `ComponentName.utils.ts`  — standalone helper functions and hooks
 *   - `ComponentName.tsx`       — component only
 *
 * The function rewrites the main `.tsx` file and creates the new files.
 * The `index.ts` is left untouched — public types that were originally
 * exported are re-exported from the main `.tsx` so existing consumers continue
 * to work.
 */
export async function splitComponentFiles(
	componentDir: string,
	componentName: string,
	mode: Exclude<FileSplitMode, "none">
): Promise<void> {
	const mainFile = path.join(componentDir, `${componentName}.tsx`);
	if (!(await fs.pathExists(mainFile))) return;

	const source = await fs.readFile(mainFile, "utf8");
	const rawSegments = parseTopLevelSegments(source);

	const classified: Segment[] = rawSegments.map((content) => ({
		content,
		kind: classifySegment(content, componentName),
	}));

	const imports = classified
		.filter((s) => s.kind === "import")
		.map((s) => s.content);
	const typeSegs = classified
		.filter((s) => s.kind === "type")
		.map((s) => s.content);
	const styleSegs = classified
		.filter((s) => s.kind === "style")
		.map((s) => s.content);
	const utilSegs = classified
		.filter((s) => s.kind === "util")
		.map((s) => s.content);
	const componentSegs = classified
		.filter((s) => s.kind === "component")
		.map((s) => s.content);

	// Nothing to split — bail out silently
	if (typeSegs.length === 0 && styleSegs.length === 0) return;

	// ── Types file ─────────────────────────────────────────────────────────────
	const exportedTypes = typeSegs.map(makeExported);
	const typeNames = exportedTypes
		.map(getDeclaredName)
		.filter((n): n is string => n !== null);
	const originallyExportedTypeNames = typeSegs
		.filter((t) => /^export\s/m.test(firstCodeLine(t)))
		.map(getDeclaredName)
		.filter((n): n is string => n !== null);

	const typesCode = exportedTypes.join("\n\n");
	const typesImports = relevantImports(imports, typesCode);

	await fs.writeFile(
		path.join(componentDir, `${componentName}.types.ts`),
		buildFile(typesImports, exportedTypes),
		"utf8"
	);

	// ── Styles file ─────────────────────────────────────────────────────────────
	if (styleSegs.length > 0) {
		const stylesCode = styleSegs.join("\n\n");
		const stylesImports = relevantImports(imports, stylesCode);

		// Types referenced inside the styles declaration
		const typeNamesUsedInStyles = typeNames.filter((n) =>
			new RegExp(`\\b${n}\\b`).test(stylesCode)
		);
		const localTypesImport =
			typeNamesUsedInStyles.length > 0
				? `import type { ${typeNamesUsedInStyles.join(", ")} } from './${componentName}.types';`
				: null;

		// Export the styles object so the component can import it
		const exportedStyleSegs = styleSegs.map((seg) =>
			/^export\s/.test(firstCodeLine(seg)) ? seg : `export ${seg}`
		);

		await fs.writeFile(
			path.join(componentDir, `${componentName}.styles.ts`),
			buildFile(stylesImports, localTypesImport ?? [], exportedStyleSegs),
			"utf8"
		);
	}

	// ── Utils file (4-file mode) ───────────────────────────────────────────────
	const exportedUtilNames: string[] = [];

	if (mode === "four" && utilSegs.length > 0) {
		const utilsCode = utilSegs.join("\n\n");
		const utilsImports = relevantImports(imports, utilsCode);

		const typeNamesUsedInUtils = typeNames.filter((n) =>
			new RegExp(`\\b${n}\\b`).test(utilsCode)
		);
		const localTypesImport =
			typeNamesUsedInUtils.length > 0
				? `import type { ${typeNamesUsedInUtils.join(", ")} } from './${componentName}.types';`
				: null;

		const exportedUtils = utilSegs.map(makeExported);
		exportedUtilNames.push(
			...exportedUtils
				.map(getDeclaredName)
				.filter((n): n is string => n !== null)
		);

		await fs.writeFile(
			path.join(componentDir, `${componentName}.utils.ts`),
			buildFile(utilsImports, localTypesImport ?? [], exportedUtils),
			"utf8"
		);
	}

	// ── Component file (rewrite .tsx) ──────────────────────────────────────────
	// In 3-file mode, utils stay in the component file.
	const componentBody =
		mode === "three"
			? [...utilSegs, ...componentSegs]
			: [...componentSegs];

	const componentBodyCode = componentBody.join("\n\n");
	const componentImports = relevantImports(imports, componentBodyCode);

	// Local imports from the files we just created
	const localImports: string[] = [];

	if (typeNames.length > 0) {
		localImports.push(
			`import type { ${typeNames.join(", ")} } from './${componentName}.types';`
		);
	}
	if (styleSegs.length > 0) {
		localImports.push(
			`import { styles } from './${componentName}.styles';`
		);
	}
	if (mode === "four" && exportedUtilNames.length > 0) {
		localImports.push(
			`import { ${exportedUtilNames.join(", ")} } from './${componentName}.utils';`
		);
	}

	// Re-export originally-public types so index.ts keeps working unchanged
	const reExports =
		originallyExportedTypeNames.length > 0
			? `export type { ${originallyExportedTypeNames.join(", ")} } from './${componentName}.types';`
			: null;

	await fs.writeFile(
		mainFile,
		buildFile(
			componentImports,
			localImports,
			componentBody,
			reExports ?? []
		),
		"utf8"
	);
}
