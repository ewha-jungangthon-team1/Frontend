import client from "./client";

export const requestDetailedCare = (sessionId) =>
  client.post(`/sessions/${sessionId}/care/`);
