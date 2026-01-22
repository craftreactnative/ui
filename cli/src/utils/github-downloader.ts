import * as fs from "fs-extra";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as tar from "tar";
import ora from "ora";
import { URL } from "url";
import * as os from "os";

const GITHUB_OWNER = "craftreactnative";
const GITHUB_REPO = "ui";
const DEFAULT_BRANCH = "main";
const REDIRECT_CODES = [301, 302, 303, 307, 308];

interface DownloadOptions {
  branch?: string;
  silent?: boolean;
  forceLatest?: boolean;
}

const getCacheDir = () => path.join(os.tmpdir(), "craftrn-ui-cli-cache");
const getCachePath = (branch: string) => path.join(getCacheDir(), branch);
const getCacheMetadataPath = (branch: string) =>
  path.join(getCachePath(branch), ".cache-metadata.json");

const CACHE_STALENESS_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

interface CacheMetadata {
  timestamp: number;
  branch: string;
}

/**
 * Cleans up resources (file, response, request)
 */
function cleanup(
  file: fs.WriteStream | null,
  response: http.IncomingMessage | null,
  request: http.ClientRequest | null,
  tempPath: string
): void {
  if (file) file.close();
  if (response) response.destroy();
  if (request) request.destroy();
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
}

/**
 * Checks if cache is stale based on timestamp (1 day)
 */
async function isCacheStale(
  branch: string,
  forceLatest: boolean
): Promise<boolean> {
  if (forceLatest) return true;

  const metadataPath = getCacheMetadataPath(branch);
  if (!(await fs.pathExists(metadataPath))) {
    return true; // No cache metadata, consider stale
  }

  try {
    const metadata: CacheMetadata = await fs.readJson(metadataPath);
    const age = Date.now() - metadata.timestamp;
    return age > CACHE_STALENESS_MS;
  } catch (error) {
    // If we can't read metadata, consider stale
    return true;
  }
}

/**
 * Saves cache metadata with timestamp
 */
async function saveCacheMetadata(branch: string): Promise<void> {
  const metadataPath = getCacheMetadataPath(branch);
  const metadata: CacheMetadata = {
    timestamp: Date.now(),
    branch,
  };
  await fs.writeJson(metadataPath, metadata, { spaces: 2 });
}

/**
 * Downloads a file from URL with redirect support
 */
function downloadFile(
  urlString: string,
  destPath: string,
  spinner: ora.Ora | null
): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const url = new URL(urlString);
    const client = url.protocol === "https:" ? https : http;

    const request = client.get(url, (response) => {
      const statusCode = response.statusCode || 0;

      // Handle redirects
      if (REDIRECT_CODES.includes(statusCode)) {
        cleanup(file, response, request, destPath);
        const location = response.headers.location;
        if (!location) {
          if (spinner) spinner.fail("Redirect location not found");
          return reject(new Error("Redirect location not found"));
        }
        const redirectUrl = location.startsWith("http")
          ? location
          : new URL(location, url).toString();
        return downloadFile(redirectUrl, destPath, spinner)
          .then(resolve)
          .catch(reject);
      }

      // Handle errors
      if (statusCode === 404) {
        cleanup(file, response, request, destPath);
        if (spinner) spinner.fail("Branch not found");
        return reject(new Error("Branch not found in repository"));
      }

      if (statusCode !== 200) {
        cleanup(file, response, request, destPath);
        if (spinner) spinner.fail("Failed to download from GitHub");
        return reject(
          new Error(
            `Failed to download from GitHub: ${statusCode} ${response.statusMessage}`
          )
        );
      }

      // Success - pipe to file
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        if (spinner) spinner.text = "Extracting components...";
        resolve();
      });
      file.on("error", (err) => {
        cleanup(null, response, request, destPath);
        if (spinner) spinner.fail("Download failed");
        reject(err);
      });
    });

    request.on("error", (err) => {
      cleanup(file, null, request, destPath);
      if (spinner) spinner.fail("Download failed");
      reject(err);
    });
  });
}

/**
 * Downloads and extracts the craftrn-ui directory from GitHub
 */
export async function downloadFromGitHub(
  options: DownloadOptions = {}
): Promise<string> {
  const branch = options.branch || DEFAULT_BRANCH;
  const cachePath = getCachePath(branch);
  const craftrnUiPath = path.join(cachePath, "demo-app", "craftrn-ui");

  const spinner = options.silent
    ? null
    : ora("Checking cache...").start();

  // Check if cache exists and is fresh
  if (await fs.pathExists(craftrnUiPath)) {
    if (spinner) spinner.text = "Checking cache...";
    const stale = await isCacheStale(branch, options.forceLatest || false);
    if (!stale) {
      if (spinner) spinner.succeed("Using cached components");
      return craftrnUiPath;
    }
    // Cache is stale (older than 1 day), remove it
    if (spinner) spinner.text = "Cache is outdated (older than 1 day), downloading latest...";
    await fs.remove(cachePath);
  }

  if (spinner) spinner.text = "Downloading components from GitHub...";

  const tarballUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/archive/refs/heads/${branch}.tar.gz`;
  const tempTarPath = path.join(cachePath, "archive.tar.gz");
  const extractPath = path.join(cachePath, "extracted");

  await fs.ensureDir(cachePath);

  // Download tarball
  await downloadFile(tarballUrl, tempTarPath, spinner);

  // Extract tarball
  await fs.ensureDir(extractPath);
  await tar.extract({ file: tempTarPath, cwd: extractPath });
  await fs.remove(tempTarPath);

  // Move extracted directory to final location
  const extractedRepoPath = path.join(
    extractPath,
    `${GITHUB_REPO}-${branch}`,
    "demo-app",
    "craftrn-ui"
  );

  if (!(await fs.pathExists(extractedRepoPath))) {
    if (spinner) spinner.fail("Failed to extract components");
    throw new Error("Failed to extract craftrn-ui directory from tarball");
  }

  const finalPath = path.join(cachePath, "demo-app", "craftrn-ui");
  await fs.ensureDir(path.dirname(finalPath));
  if (await fs.pathExists(finalPath)) {
    await fs.remove(finalPath);
  }
  await fs.move(extractedRepoPath, finalPath);
  await fs.remove(path.join(extractPath, `${GITHUB_REPO}-${branch}`));

  // Save cache metadata with timestamp
  await saveCacheMetadata(branch);

  if (spinner) spinner.succeed("Components downloaded and cached");
  return finalPath;
}

/**
 * Ensures components are downloaded and returns the path
 */
export async function ensureComponentsDownloaded(
  options: DownloadOptions = {}
): Promise<string> {
  try {
    return await downloadFromGitHub(options);
  } catch (error) {
    throw new Error(
      `Failed to download components from GitHub: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
