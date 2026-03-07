import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootPath = path.join(__dirname, "workspace");
  if (!await isExist(rootPath)){
    throw new Error("FS operation failed");
  }
  const args = process.argv;
  const index = args.indexOf("--ext");
  if (index === -1) {
    throw new Error("Fs operation filed");
  }
  const value = args[args.length - 1];
  const dotExt = value.startsWith('.') ? value : `.${value}`;
  const file = await fs.readdir(rootPath, { recursive: true });
  const ext = file.filter((item) => path.extname(item) === dotExt).sort();
  for (let file of ext) {
    let filePath = path.join(__dirname, file);
    console.log(filePath);
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

await findByExt();
