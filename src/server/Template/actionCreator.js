import { getCookie } from "../../functions/useCookies";
import { setPageData } from "../../redux/actions";
import { deleteT, editTemp, getTemp, getTempSave, sendTemp } from "./config/template";
import { deleteTO, editTempObj, getTempObj, getTempObjSave, sendTempObj } from "./config/tempObj";

// template
export const createTemp = (dispatch, values, arr = []) => {
	let templateHelpers = [];
	arr.forEach((item, index) => {
		templateHelpers.push({
			sequence: index,
			templateObjectId: item.id,
		});
	});
	let doctorId = getCookie("doctorId");
	let data = { ...values, doctorId, templateHelpers };
	sendTemp(data).then(() => {
		getTempSave().then(({ data }) => {
			if (data) {
				dispatch(setPageData({ content: data.content, total: data.totalElements }));
			}
		});
	});
};

export const readTemp = (dispatch, page, size) => {
	getTemp(page, size).then(({ data }) => {
		if (data) {
			dispatch(setPageData({ content: data.content, total: data.totalElements }));
		}
	});
};

export const readTempSave = (dispatch, page, size) => {
	getTempSave(page, size).then(({ data }) => {
		if (data) {
			dispatch(setPageData({ content: data.content, total: data.totalElements }));
		}
	});
};

export const updateTemp = (dispatch, values, arr) => {
	let doctorId = getCookie("doctorId");
	let templateHelpers = [];
	arr.forEach((item, index) => {
		templateHelpers.push({
			sequence: index,
			templateObjectId: item.id,
		});
	});
	let data = { ...values, doctorId, templateHelpers };
	console.log("update", data);

	editTemp(data).then(() => {
		getTempSave().then(({ data }) => {
			if (data) {
				dispatch(setPageData({ content: data.content, total: data.totalElements }));
			}
		});
	});
};

export const deleteTemp = (dispatch, id) => {
	deleteT(id).then(() => {
		getTempSave().then(({ data }) => {
			if (data) {
				dispatch(setPageData({ content: data.content, total: data.totalElements }));
			}
		});
	});
};

// template

// template object
export const createObj = (dispatch, values, isrender = true) => {
	let doctorId = getCookie("doctorId");
	let data = { ...values, doctorId };
	return sendTempObj(data).then(res => {
		if (isrender)
			getTempObjSave().then(({ data }) => {
				if (data) dispatch(setPageData({ content: data.content, total: data.totalElements }));
			});
		return res.data;
	});
};

export const readTempObj = (dispatch, page, size) => {
	getTempObj(page, size).then(({ data }) => {
		if (data) {
			dispatch(setPageData({ content: data.content, total: data.totalElements }));
		}
	});
};

export const readTempObjSave = (dispatch, page, size) => {
	getTempObjSave(page, size).then(({ data }) => {
		if (data) {
			dispatch(setPageData({ content: data.content, total: data.totalElements }));
		}
	});
};

export const updateTempObj = (dispatch, values) => {
	let doctorId = getCookie("doctorId");
	let data = { ...values, doctorId };
	editTempObj(data).then(() => {
		getTempObjSave().then(({ data }) => {
			if (data) {
				dispatch(setPageData({ content: data.content, total: data.totalElements }));
			}
		});
	});
};

export const deleteTempObj = (dispatch, id) => {
	deleteTO(id).then(() => {
		getTempObjSave().then(({ data }) => {
			if (data) {
				dispatch(setPageData({ content: data.content, total: data.totalElements }));
			}
		});
	});
};
// template object
