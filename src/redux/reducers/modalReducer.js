import { CLOSEDEFMODAL, CLOSEINSIDEMODAL, DEFMODAL, INSIDEMODAL } from "../types";

const initial = {
	defaultM: {
		visible: false,
		title: "",
		action: "",
		id: "",
	},
	InsideM: {
		visible: false,
		title: "",
		action: "",
		di: "",
		isreturn: false,
		index: null,
	},
};

export default function modalReducer(state = initial, { type, payload }) {
	switch (type) {
		case DEFMODAL:
			return {
				...state,
				defaultM: payload,
			};
		case INSIDEMODAL:
			return {
				...state,
				InsideM: payload,
			};
		case CLOSEINSIDEMODAL:
			return {
				...state,
				InsideM: {
					visible: false,
					title: "",
					action: "",
				},
			};
		case CLOSEDEFMODAL:
			return {
				...state,
				defaultM: {
					visible: false,
					title: "",
					action: "",
				},
			};
		default:
			return state;
	}
}
