import { createHash } from "crypto";
import fsPromise from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const verify = async () => {
  // Write your code here
  // Read checksums.json
  // Calculate SHA256 hash using Streams API
  // Print result: filename — OK/FAIL

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let checksums;
  try {
    const rootPath = path.join(__dirname, "checksums.json");
    console.log(rootPath);
    checksums = JSON.parse(await fsPromise.readFile(rootPath));
    console.log(checksums);
  } catch {
    console.log("FS operation failed");
  }
  for (let [file, hash] of Object.entries(checksums)) {
    const newHash = createHash("sha256");
    newHash.update(file);
    const actualHash = newHash.digest("hex");

    if (actualHash === hash) {
      console.log(`${file} — OK`);
    } else {
      console.log(`${file} — FAIL`);
    }
  }
};

await verify();
