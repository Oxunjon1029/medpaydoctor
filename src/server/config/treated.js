import { axiosInstance } from "../host";
export const TreatedGet = (p = 1 ,s = 10) => {
	const config = {
		method: "get",
		url: `med-card/treated?page=${p -1}&size=${s}`,
	};
	return axiosInstance(config);
};

export const GetMedCardById = (medCardId) => {
	const config = {
		method: "get",
		url: `med-card/${medCardId}`,
	};
	return axiosInstance(config);
};
export const GetAllUserMedCardEnabled = (userId, p = 1, s = 10) => {
	const config = {
		method: "get",
		url: `med-card/user/${userId}?page=${p - 1}&size=${s}`,
	};
	return axiosInstance(config);
};

export const UserUnfinishedMedCardsGet = (p = 1 , s = 10) => {
	const config = {
		method: "get",
		url: `med-card/unfinished?page=${p -1}&size=${s}`,
	};
	return axiosInstance(config);
};

export const UserUnfinishedMedCardsEdit = (data) => {
	const config = {
		method: "post",
		url: `med-card/edit`,
		data,
	};
	return axiosInstance(config);
};

export const UnFinishedDeleteGet = (orderId) => {
	const config = {
		method: "get",
		url: `med-card/unfinished/change?orderId=${orderId}`,
	};
	return axiosInstance(config);
};
