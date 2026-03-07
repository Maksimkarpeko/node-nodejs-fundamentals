import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const workspacePath = path.join(__dirname, "workspace");
  const rootPath = path.join(__dirname, "workspace/parts");

  const args = process.argv.slice(2);
  const index = args.indexOf("--files");
  const extensions = [];

  if (!(await isExist(rootPath))) {
    throw new Error("FS operation failed");
  }

  if (index !== -1) {
    for (let i = index + 1; i < args.length; i++) {
      if (args[i].startsWith("--")) break;
      const splitFile = args[i].split(",");
      extensions.push(...splitFile);
    }
  }

  if (extensions.length === 0) {
    const files = (await fs.readdir(rootPath, { recursive: true }))
      .map((i) => i.toLowerCase())
      .filter((item) => path.extname(item) === ".txt")
      .sort();
    let saveText = "";
    if (files.length === 0) {
      throw new Error("FS operation failed");
    }
    for (let file of files) {
      const readText = await fs.readFile(path.join(rootPath, file));
      saveText += readText.toString();
    }
    await fs.writeFile(path.join(workspacePath, "merged.txt"), saveText);
  } else {
    try {
      let saveText = "";
      for (let file of extensions) {
        const readText = await fs.readFile(path.join(rootPath, file));
        saveText += readText.toString();
      }
      await fs.writeFile(path.join(workspacePath, "merged.txt"), saveText);
    } catch {
      throw new Error("FS operation failed");
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

await merge();
