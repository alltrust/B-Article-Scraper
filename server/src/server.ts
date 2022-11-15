import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect";

import userRoutes from './routes/userAuthRoutes'
import articleRoutes from './routes/articleRoutes'

const app = express();
const port: number | string = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("hello world");
});

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/articles', articleRoutes)

const mongoUrl = `mongodb+srv://alldough:MbDDejmXduNF6RWU@cluster0.copgrn2.mongodb.net/articles?retryWrites=true&w=majority`;
// const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.copgrn2.mongodb.net/${process.env.MONGO_DATABASE}`;


const startServer = async () => {
  try {
    await connectDB(mongoUrl);
    app.listen(port, () => {
      console.log(`ALIVE FROM port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
