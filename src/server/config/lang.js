import { axiosInstance } from "../host"

export const GetLanguageConfig = () => {
    const config = {
        method: "get",
        url: "doctor/basic-list/languages"
    }
    return axiosInstance(config)
}
export const GetAllLang = () => {
    const config = {
        method: "GET",
        url: "doctor/information-list/languages",
    }
    return axiosInstance(config)
}