import { getCookie } from "../../../functions/useCookies";
import { axiosInstance } from "../../host";

export const getTemp = (page = 1, size = 10) => {
	const config = {
		method: "GET",
		url: `/template/doctor/moderator/?page=${page - 1}&size=${size}`,
	};
	return axiosInstance(config);
};

export const getTempSave = (page = 1, size = 10) => {
	let id = getCookie("doctorId");
	const config = {
		method: "GET",
		url: `/template/doctor/${id}/?page=${page - 1}&size=${size}`,
	};
	return axiosInstance(config);
};

export const getTempeditData = (id) => {
	const config = {
		method: "GET",
		url: `/template-object/template/${id}`,
	};
	return axiosInstance(config);
};
export const getTempFormData = (id) => {
	const config = {
		method: "GET",
		url: `/template/${id}`,
	};
	return axiosInstance(config);
};

export const sendTemp = (data) => {
	const config = {
		method: "POST",
		url: `/template/`,
		data,
	};
	return axiosInstance(config);
};

export const editTemp = (data) => {
	const config = {
		method: "POST",
		url: `/template/edit`,
		data,
	};
	return axiosInstance(config);
};

export const deleteT = (id) => {
	const config = {
		method: "DELETE",
		url: `/template/delete/${id}`,
	};
	return axiosInstance(config);
};

export const filterTemp = (id, page = 1, size = 10) => {
	const config = {
		method: "GET",
		url: `/template/med-card-sub-category/${id}/?page=${page - 1}&size=${size}`,
	};
	return axiosInstance(config);
};
