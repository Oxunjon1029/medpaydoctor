import { axiosInstance } from "../host";

export const OrderGet = (page = 1, size = 10) => {
	const config = {
		method: "get",
		url: `order/doctor?page=${page - 1}&size=${size}`,
	};
	return axiosInstance(config);
};

export const InfoOfOrdered = () => {
	const config = {
		method: "get",
		url: `order/patient/doctor`,
	};
	return axiosInstance(config);
};

export const orderPatientServe = id => {
	const config = {
		method: "GET",
		url: `order/patient/doctor?orderId=${id}`,
	};
	return axiosInstance(config);
};

export const orderMedCardCreate = (oldData = [], newData = {}, userServisId, files = [], { title = "" }) => {
	let cardContext = [];
	for (const [key, value] of Object.entries(newData)) {
		let arr = key.split("/");
		oldData.forEach((element, index) => {
			if (+arr[1] === index) {
				cardContext.push({
					sequence: index,
					title: element.title,
					context: value,
				});
			}
		});
	}
	let fileUrls = files.map(item => item.orderHistoryId);

	let data = {
		title,
		cardContext,
		userId: userServisId.userId,
		serviceItemId: userServisId.serviceItemId,
		fileUrls,
	};
	const config = {
		method: "POST",
		url: `med-card/`,
		data,
	};
	return axiosInstance(config);
};

export const orderFileUpload = (data = {}, onProgress, userId = "") => {
	const config = {
		method: "POST",
		url: `files/doctor/upload?userId=${userId}`,
		data,
		onUploadProgress: ({ total, loaded }) => {
			onProgress({ percent: Math.round((loaded / total) * 100) }, data);
		},
	};
	return axiosInstance(config);
};

export const getUploadFile = (id, name) => {
	const config = {
		url: `files/doctor/download/${id}`,
		method: "GET",
		responseType: "blob",
	};
	axiosInstance(config)
		.then(response => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", name);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		})
		.catch(err => {
			console.log(`can't upload file`, err);
		});
};

export const deleteUploadFile = (id, userId) => {
	const config = {
		url: `files/doctor/${id}?userId=${userId}`,
		method: "delete",
	};
	return axiosInstance(config);
};

export const getOrderFilesInfo = list => {
	const config = {
		url: `files/info`,
		method: "POST",
		data: { idList: list },
	};
	return axiosInstance(config);
};
