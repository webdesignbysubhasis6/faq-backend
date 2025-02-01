const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const redis = require("redis");
const faqRoutes = require("./routes/faqRoutes");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", 
    methods: "GET,POST,PUT,DELETE,PATCH", 
  })
);
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

app.use("/api/faqs", faqRoutes);

app.listen(PORT, async () => {
  console.log("Server is running");
  await connectDB();
});