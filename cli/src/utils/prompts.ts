import { cancel, intro, isCancel, outro, select, text } from "@clack/prompts";
import {
	BarrelFileMode,
	DEFAULT_COMPONENTS_PATH,
	FileSplitMode,
	UserPreferences,
} from "../types";

/**
 * Runs the interactive prompts and returns the collected user preferences.
 * Returns null if the user cancels at any point.
 *
 * Designed to be extended with additional prompts in future iterations —
 * just add more prompt calls and fields to UserPreferences.
 */
export async function collectUserPreferences(): Promise<UserPreferences | null> {
	intro("craftrn-ui — component options");

	// ── Prompt 1: file structure ────────────────────────────────────────────
	const fileSplitMode = await select({
		message: "How would you like to structure each component?",
		options: [
			{
				value: "none" as FileSplitMode,
				label: "Single file",
				hint: "Keep the original file structure as-is",
			},
			{
				value: "three" as FileSplitMode,
				label: "Three files",
				hint: "types · styles · component",
			},
			{
				value: "four" as FileSplitMode,
				label: "Four files",
				hint: "types · styles · component · utils & hooks",
			},
		],
	});

	if (isCancel(fileSplitMode)) {
		cancel("Operation cancelled.");
		return null;
	}

	// ── Prompt 2: component destination folder ─────────────────────────────
	const destinationMode = await select({
		message: `Where should component files be stored? (current default: ${DEFAULT_COMPONENTS_PATH})`,
		options: [
			{
				value: "default",
				label: `Use default (${DEFAULT_COMPONENTS_PATH})`,
				hint: "Recommended for standard setup",
			},
			{
				value: "custom",
				label: "Use custom path",
				hint: "Example: src/components/ui",
			},
		],
	});

	if (isCancel(destinationMode)) {
		cancel("Operation cancelled.");
		return null;
	}

	let componentsPath = DEFAULT_COMPONENTS_PATH;

	if (destinationMode === "custom") {
		const customPath = await text({
			message: `Enter component destination path (default is ${DEFAULT_COMPONENTS_PATH})`,
			placeholder: "src/components/ui",
			validate(value) {
				const trimmed = (value ?? "").trim();
				if (!trimmed) {
					return "Path is required.";
				}

				// Keep the path project-relative for predictable imports and copies.
				if (/^([a-zA-Z]:)?[\\/]/.test(trimmed)) {
					return "Use a project-relative path (for example: src/components/ui).";
				}

				return undefined;
			},
		});

		if (isCancel(customPath)) {
			cancel("Operation cancelled.");
			return null;
		}

		componentsPath = customPath.trim().replace(/\\+/g, "/");
	}

	// ── Future prompts go here ──────────────────────────────────────────────
	const barrelFileMode = await select({
		message: "How should index barrel files be handled?",
		options: [
			{
				value: "component" as BarrelFileMode,
				label: "Per component",
				hint: "Keep or create index.ts inside each component folder",
			},
			{
				value: "folder" as BarrelFileMode,
				label: "Whole components folder",
				hint: "Create one index.ts in the components root",
			},
			{
				value: "none" as BarrelFileMode,
				label: "No index files",
				hint: "Do not create index.ts barrels",
			},
		],
	});

	if (isCancel(barrelFileMode)) {
		cancel("Operation cancelled.");
		return null;
	}

	outro("Got it — installing component(s)…");

	return {
		fileSplitMode: fileSplitMode as FileSplitMode,
		componentsPath,
		barrelFileMode: barrelFileMode as BarrelFileMode,
	};
}
