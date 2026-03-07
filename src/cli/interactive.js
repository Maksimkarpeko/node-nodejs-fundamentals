import { stdin, stdout } from "process";
import readline from "readline/promises";
const interactive = async () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands

  const startTime = performance.now();
  const rl = readline.createInterface({ input: stdin, output: stdout });
  console.log(`What will you choose:
uptime — prints process uptime in seconds (e.g. Uptime: 12.34s)
cwd — prints the current working directory
date — prints the current date and time in ISO format
exit — prints Goodbye! and terminates the process`);

  rl.on("SIGINT", () => {
    console.log("\nGoodbye!");
    rl.close();
    process.exit(0);
  });
  while (true) {
    try {
      const name = (await rl.question(`> `)).trim().toLowerCase();
      switch (name) {
        case "uptime": {
          const endTime = performance.now();
          console.log(`Uptime:${(endTime - startTime).toFixed(2)}`);
          break;
        }
        case "exit": {
          console.log("Goodbye!");
          rl.close();
          return;
        }
        case "date": {
          console.log(`Your data:${new Date().toISOString()}`);
          break;
        }
        case "cwd": {
          console.log(`Your current working directory: ${process.cwd()}`);
          break;
        }
        default: {
          console.log("Unknown command");
        }
      }
    } catch (err) {
      if (err.code === "ABORT_ERR") return;
      console.error("An unexpected error occurred:", err);
    }
  }
};

await interactive();
