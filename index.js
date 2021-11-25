require("dotenv").config();
const { connectDB } = require("./database");
const { initializeServer } = require("./server");

const port = process.env.PORT ?? process.env.SERVER_PORT ?? 5000;
(async () => {
  try {
    await connectDB();
    initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
