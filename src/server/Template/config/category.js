import { axiosInstance } from "../../host";

export const getCategory = (page = 1, size = 10) => {
	const config = {
		method: "GET",
		url: `/med-card-category/?page=${page - 1}&size=${size}`,
	};
	return axiosInstance(config);
};

export const getSubCategory = (id, page = 1, size = 10) => {
	const config = {
		method: "GET",
		url: `/med-card-sub-category/category/${id}?page=${page - 1}&size=${size}`,
	};
	return axiosInstance(config);
};
