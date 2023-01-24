import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect";
import cors from 'cors'

import userRoutes from './routes/userAuthRoutes'
import articleRoutes from './routes/articleRoutes'

import errorHandlerMiddleware from "./middleware/error-handler";
import notFoundMiddlware from "./middleware/not-found";
import  path  from "path";

import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from "express-mongo-sanitize"

const app = express();
const port: number | string = process.env.PORT || 8000;


app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.use(cors());
app.use(express.json());

app.use(helmet());
app.use(xss());
app.use(mongoSanitize())

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/articles', articleRoutes)

app.get("*", function (request:Request, response:Response) {
  response.sendFile(
    path.resolve(__dirname, "../../client/build", "index.html")
  );
});

app.use(notFoundMiddlware)
app.use(errorHandlerMiddleware)

// const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.copgrn2.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;


const startServer = async () => {
  try {
    if(process.env.MONGO_URI)
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`ALIVE FROM port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
