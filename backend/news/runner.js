const cron = require("node-cron");
const { spawn } = require("child_process");

function runNewsJob() {
  console.log("🕒 Starting cron job to run fetch_news.py every 1 minute...");

  // ✅ Use exact Python path (not just "python")
  const pythonPath =
    "C:\\Users\\prcha\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";
  const scriptPath =
    "C:\\Users\\prcha\\OneDrive\\Desktop\\Final Year Project\\smart Crime\\backend\\ml\\fetch_news.py";

  cron.schedule("* * * * *", () => {
    console.log("🔁 Running fetch_news.py via cron...");

    const process = spawn(pythonPath, [scriptPath]);

    process.stdout.on("data", (data) => {
      console.log(`✅ fetch_news.py output: ${data}`);
    });

    process.stderr.on("data", (data) => {
      console.error(`❌ fetch_news.py error: ${data}`);
    });

    process.on("close", (code) => {
      console.log(`🔚 fetch_news.py exited with code ${code}`);
    });
  });
}

module.exports = { runNewsJob };
