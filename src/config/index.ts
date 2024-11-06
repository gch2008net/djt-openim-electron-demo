// WS 10001 API 10002 CHAT 10008 CONFIG 10009

export const WS_URL = "wss://imapi.51djt.com/msg_gateway";
export const API_URL = "https://imapi.51djt.com/api";
export const CHAT_URL = "https://imapi.51djt.com/chat";

// export const WS_URL = "ws://192.168.8.110:10001";
// export const API_URL = "http://192.168.8.110:10002";
// export const CHAT_URL = "http://192.168.8.110:10008";

export const getWsUrl = () => localStorage.getItem("wsUrl") || WS_URL;
export const getApiUrl = () => localStorage.getItem("apiUrl") || API_URL;
export const getChatUrl = () => localStorage.getItem("chatUrl") || CHAT_URL;



export const ENTERPRISE_URL = "https://enterpriseadmin.51djt.com";

// export const ENTERPRISE_URL = "http://enterprise-admin-dev.51djt.net";
export const getEnterPriseUrl = () => localStorage.getItem("enterPriseUrl") || ENTERPRISE_URL;