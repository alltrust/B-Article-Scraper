import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect";
import cors from 'cors'

import userRoutes from './routes/userAuthRoutes'
import articleRoutes from './routes/articleRoutes'

import errorHandlerMiddleware from "./middleware/error-handler";
import notFoundMiddlware from "./middleware/not-found";

const app = express();
const port: number | string = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("hello world");
});

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/articles', articleRoutes)

//to be transferred to error-handling middleware
app.use(errorHandlerMiddleware)
//if there a completely non-existent path not-found
app.use(notFoundMiddlware)

const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.copgrn2.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;


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
