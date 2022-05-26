import {
	CKEDITOR,
	CLOSEDEFMODAL,
	CLOSEINSIDEMODAL,
	DEFMODAL,
	DRAGDROP,
	INSIDEMODAL,
	PAGEDATA,
} from "./types";

// data
export const setPageData = (payload) => {
	return { type: PAGEDATA, payload };
};
export const setCkEditor = (payload) => {
	return { type: CKEDITOR, payload };
};
export const setDragDrop = (payload) => {
	return { type: DRAGDROP, payload };
};
// data

// modal
export const setDefModal = (payload) => {
	return { type: DEFMODAL, payload };
};
export const setInsideModal = (payload) => {
	return { type: INSIDEMODAL, payload };
};
export const closeDefModal = () => {
	return { type: CLOSEDEFMODAL };
};
export const closeInsideModal = () => {
	return { type: CLOSEINSIDEMODAL };
};
// modal
