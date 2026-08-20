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
      error.response?.data?.detail ??
      error.response?.data?.message ??
      error.message ??
      "요청 중 오류가 발생했어요";

    const normalizedError = new Error(message);
    // 404(리포트 없음) 등 상태 코드로 분기해야 하는 화면을 위해 보존해둔다
    normalizedError.status = error.response?.status ?? null;

    return Promise.reject(normalizedError);
  },
);

export default client;
