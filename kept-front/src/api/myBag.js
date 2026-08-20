import client from "./client";

// 가방 목록 조회
export const getBags = () => client.get("api/bags/");
