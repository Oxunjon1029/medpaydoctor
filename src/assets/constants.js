import { getCookie } from "../functions/useCookies";

export const TOKEN = "MEDPAY_DOCTOR_TOKEN";
export let API_URL = "https://welse.uz/api/";
export const token = getCookie(TOKEN);
export let WEB_SOCKET_URL = "http://92.63.206.30:9005/mb-websocket";

export let headers = {
	"Content-Type": "application/json; charset=utf-8",
	"Accept": "application/json",
	"Authorization": token ? `Bearer ${token}` : "",
};
