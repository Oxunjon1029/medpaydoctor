import { axiosInstance } from '../host';

export const fileUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
        method: "post",
        data: formData
    };
    return axiosInstance(config);
};

export const deleteFile = (id) => {
    const config = {
        method: "DELETE",
        url: `files/public/${id}`,
    };
    return axiosInstance(config);
}