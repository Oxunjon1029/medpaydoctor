import { getCookie } from "../../../functions/useCookies";
import { axiosInstance } from "../../host";

export const getTempObj = (page = 1, size = 10) => {
	const config = {
		method: "GET",
		url: `/template-object/moderator/?page=${page - 1}&size=${size}`,
	};	
	return axiosInstance(config);
};

export const getTempObjSave = (page = 1, size = 10) => {
	let id = getCookie("doctorId");
	const config = {
		method: "GET",
		url: `/template-object/doctor/${id}/?page=${page - 1}&size=${size}`,
	};
	return axiosInstance(config);
};

export const getTOeditData = (id) => {
	const config = {
		method: "GET",
		url: `/template-object/${id}`,
	};
	return axiosInstance(config);
};

export const sendTempObj = (data) => {
	const config = {
		method: "POST",
		url: `/template-object/`,
		data,
	};
	return axiosInstance(config);
};

export const editTempObj = (data) => {
	const config = {
		method: "POST",
		url: `/template-object/edit`,
		data,
	};
	return axiosInstance(config);
};

export const deleteTO = (id) => {
	const config = {
		method: "DELETE",
		url: `/template-object/delete/${id}`,
	};
	return axiosInstance(config);
};

export const filterTempObj = (id, page = 1, size = 10) => {
	const config = {
		method: "GET",
		url: `/template-object/med-card-sub-category/${id}/?page=${page - 1}&size=${size}`,
	};
	return axiosInstance(config);
};
