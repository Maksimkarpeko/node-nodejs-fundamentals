import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const snapshot = async () => {
  const data = {
    rootPath: "",
    entries: [],
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootPath = path.join(__dirname, "workspace");

  data.rootPath = rootPath;

  if (!(await isExist(rootPath))) {
    throw new Error("FS operation failed");
  }

  const workspace = await fs.readdir(rootPath, { recursive: true });
  for (let file of workspace) {
    const pathFile = path.join(rootPath, file);
    const info = await fs.stat(pathFile);
    
    if (info.isDirectory()) {
      data.entries.push({
        path: file,
        type: "directory",
      });
    } else if (info.isFile()) {
      const readFile = await fs.readFile(pathFile);
      data.entries.push({
        path: file,
        type: "file",
        size: info.size,
        content: readFile.toString("base64"),
      });
    }
  }
  await fs.writeFile(
    path.join(__dirname, "snapshot.json"),
    JSON.stringify(data, null, 2),
  );
};

const isExist = async (file) => {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};

await snapshot();
