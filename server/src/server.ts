import express from "express";

const app = express()
const port = 3000


app.get('/', (req,res,next)=>{
    res.send("hello world")
})

app.listen(port, ()=>{
    console.log(`ALIVE FROM port: ${port}`)
})

