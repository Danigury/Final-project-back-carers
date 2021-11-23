require("dotenv").config();
const { connectDB } = require("./database");
const { initializeServer } = require("./server");

(async () => {
  try {
    await connectDB(process.env.MONGODB_STRING);
    initializeServer(process.env.SERVER_PORT);
  } catch {
    process.exit(1);
  }
})();
