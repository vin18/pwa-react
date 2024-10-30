import apiClient from '@/utils/apiClient';

export async function getClientsApi(dealerId) {
  try {
    const { data } = await apiClient.post(`/v1/calls/getClients`, { dealerId });
    return data;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}

export async function updateClientRecordsApi(clientDetailsPayload) {
  try {
    const { data } = await apiClient.post(
      `/v1/calls/updateClientDetails`,
      clientDetailsPayload
    );
    return data;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}
