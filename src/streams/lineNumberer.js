import { Transform } from "stream";
import { pipeline } from "stream";
const lineNumberer = () => {
  let count = 1;
  const lineNumber = new Transform({
    transform(chunk, encoding, callback) {
      const content = chunk.toString(); 
      const res = content.split(/\r?\n/);
      
      const lines = res.map((line, index) => {
        if (index === res.length - 1 && line === "") return "";
        return `${count++} ${line}`;
      });

      callback(null, lines.join("\n"));
    },
  });

  pipeline(process.stdin, lineNumber, process.stdout, (err) => {
    if (err) {
      console.error("Ошибка в потоке:", err);
    }
  });
};

lineNumberer();
