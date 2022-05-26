import { axiosInstance } from "../host";

export const sendDataAuth = (data) => {
	const config = {
		method: "POST",
		url: "user-profile/med-info/doctor/edit/",
		data,
	};
	return axiosInstance(config);
};

export const getDataAuth = (url) => {
	const config = {
		method: "GET",
		url,
	};
	return axiosInstance(config);
};

export const getAuthFormData = (id) => {
	const config = {
		method: "GET",
		url: `user-profile/med-info/user/${id}`,
	};
	return axiosInstance(config);
};
