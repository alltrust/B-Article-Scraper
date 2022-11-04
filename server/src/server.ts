import express from "express";
import dotenv from 'dotenv'
dotenv.config()

import connect from "./db/connect";

const app = express()
const port: number | string = process.env.PORT || 3000


app.get('/', (req,res,next)=>{
    res.send("hello world")
})

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.copgrn2.mongodb.net/${process.env.MONGO_DATABASE}`;

app.listen(port, ()=>{
    console.log(`ALIVE FROM port: ${port}`)
})

