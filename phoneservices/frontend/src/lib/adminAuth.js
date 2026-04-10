import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";

const decodeJwtPayload = (token) => {
	try {
		const [, payload] = String(token || "").split(".");
		if (!payload) return null;
		const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
		const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
		return JSON.parse(window.atob(padded));
	} catch {
		return null;
	}
};

const isJwtExpired = (token) => {
	const payload = decodeJwtPayload(token);
	if (!payload || typeof payload.exp !== "number") return true;
	return payload.exp * 1000 <= Date.now();
};

export const getAdminToken = () => window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
export const getAdminRefreshToken = () => window.localStorage.getItem(REFRESH_TOKEN_KEY) || "";

export const setAdminTokens = ({ token, refreshToken }) => {
	if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
	if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearAdminToken = () => {
	window.localStorage.removeItem(ACCESS_TOKEN_KEY);
	window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isAdminAuthenticated = () => {
	const token = getAdminToken();
	return !!token && !isJwtExpired(token);
};
