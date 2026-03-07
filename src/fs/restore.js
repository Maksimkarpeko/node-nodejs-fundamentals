import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootPath = path.join(__dirname, "snapshot.json");
  const workspacePath = path.join(__dirname, "workspace_restored");

  if (!(await isExist(rootPath))) {
    throw new Error("FS operation failed");
  }

  const readFile = JSON.parse(await fs.readFile(rootPath, "utf-8"));
  if (await isExist(workspacePath)) {
    throw new Error("FS operation failed");
  }
  await fs.mkdir(workspacePath, { recursive: true });
  for (let entry of readFile.entries) {
    if (entry.type === "directory") {
      await fs.mkdir(path.join(workspacePath, entry.path), {
        recursive: true,
      });
    }
    if (entry.type === "file") {
      const buffer = Buffer.from(entry.content, "base64");
      await fs.writeFile(path.join(workspacePath, entry.path), buffer);
    }
  }
};

const isExist = async (file) => {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};

await restore();
