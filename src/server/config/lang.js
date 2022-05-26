import { axiosInstance } from "../host"

export const GetLanguageConfig  = () =>{
    const config = {
        method:"get",
        url:"language/"
    }
    return axiosInstance(config)
}