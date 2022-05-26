import { CKEDITOR, DRAGDROP, PAGEDATA } from "../types";

const initial = {
	pageData: { content: [], total: 1 },
	ckEditor: "<p></p>",
	dragDrop: [],
};

export default function dataReducer(state = initial, { type, payload }) {
	switch (type) {
		case PAGEDATA:
			return { ...state, pageData: payload };
		case CKEDITOR:
			return { ...state, ckEditor: payload };
		case DRAGDROP:
			return { ...state, dragDrop: payload };
		default:
			return state;
	}
}
