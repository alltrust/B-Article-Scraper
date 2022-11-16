import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";



const errorHandlerMiddleware = (err:ErrorRequestHandler, req:Request, res:Response, next:NextFunction)=>{
    const defaultError = {
        statusCode: 0,
        message: err
    }
    console.log(err)
    res.json({msg: "FROM ERROR HANDLING MIDDLEWARE"})
}

export default errorHandlerMiddleware