import {StatusCodes} from 'http-status-codes'

class CustomError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

class BadErrorRequest extends CustomError{
    readonly status: StatusCodes
    constructor(public message:string){
        super(message);
        this.status = StatusCodes.BAD_REQUEST
    }
}

class UnauthErrorRequest extends CustomError{
    readonly status: StatusCodes
    constructor(public message:string){
        super(message);
        this.status= StatusCodes.UNAUTHORIZED
    }
}

class NotFoundRequest extends CustomError{
    readonly status: StatusCodes
    constructor(public message:string){
        super(message);
        this.status = StatusCodes.NOT_FOUND
    }
}

export {NotFoundRequest, BadErrorRequest, UnauthErrorRequest}