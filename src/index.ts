import express from "express";
import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Hii this is from server...Please go to /uncached or /cached endpoints to test"
  );
});

app.get("/uncached", async (req, res) => {
  const data = await expensiveOperation();
  res.json(data);
});

app.get("/cached", async (req, res) => {
    const cachedData = await redisClient.get("data");
    if (cachedData) {
      console.log(`It's not cached ${cachedData}`);
      return res.json(JSON.parse(cachedData));
    }
    
    const data = await expensiveOperation();
    console.log(`It's not cached ${data}`);
    await redisClient.set("data", JSON.stringify(data));
  
    res.json(data);
});

const expensiveOperation = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000) );

  return {
    username: 'Haseeb',
    email: 'Haseebshaikh@gmail.com'
  }
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});