import client from "./client";

export const requestDetailedCare = (sessionId) =>
  client.post(`api/sessions/${sessionId}/care/`);
