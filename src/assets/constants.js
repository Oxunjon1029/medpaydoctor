import { getCookie } from "../functions/useCookies";

export const TOKEN = "MEDPAY_DOCTOR_TOKEN";
export let API_URL = "http://92.63.206.30:9000/api/v1/";
export const token = getCookie(TOKEN);
export let WEB_SOCKET_URL = "http://92.63.206.30:9005/mb-websocket";

export let headers = {
	"X-Requested-With": "XMLHttpRequest",
	"Content-Type": "application/json; charset=utf-8",
	Authorization: token ? `Bearer ${token}` : "",
};
