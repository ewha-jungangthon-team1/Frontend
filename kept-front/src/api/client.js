import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답/에러 형태 통일
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "요청 중 오류가 발생했어요";
    return Promise.reject(new Error(message));
  },
);

export default client;
