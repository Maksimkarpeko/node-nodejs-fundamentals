import { Transform } from "stream";
import { pipeline } from "stream";
const filter = () => {
  // Write your code here
  // Read from process.stdin
  // Filter lines by --pattern CLI argument
  // Use Transform Stream
  // Write to process.stdout
  const args = process.argv.splice(2);
  const index = args.indexOf("--pattern");
  const pattern = index !== -1 ? args[index + 1] : null;
  const filterLine = new Transform({
    transform(chunk, encoding, callback) {
      const content = chunk.toString();
      const res = content.split(/\r?\n/);

      const filterLine = res
        .filter((line) => line.includes(pattern))
        .join("\n");
      const result = filterLine ? filterLine + "/n" : "";
      callback(null, result);
    },
  });

  pipeline(process.stdin, filterLine, process.stdout, (err) => {
    if (err) {
      console.error("Ошибка в потоке:", err);
    }
  });
};

filter();
