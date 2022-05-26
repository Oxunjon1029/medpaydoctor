import { axiosInstance } from "../host"

export const Logout = () =>{
    const config = {
        method:'post',
        url:`auth/logout`,
    }
    return axiosInstance(config)
}