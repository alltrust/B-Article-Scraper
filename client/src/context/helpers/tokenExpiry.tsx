import axios, { AxiosError } from "axios"

const isTokenExpired = (errorMsg: Error | AxiosError)=>{
    if(axios.isAxiosError(errorMsg) && errorMsg.response?.data.message === "jwt expired"){
        console.log("THIS IS EXPIRED FROM THE TOKEN EXPIRY TING")
        //if this is expired, delete localstorage
        //and logout (which navigates to login page)
    }

}//this should ACTUALLY be an error helper with all them tings

export default isTokenExpired