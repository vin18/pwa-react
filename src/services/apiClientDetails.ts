import apiClient from '@/utils/apiClient';

export async function getClientsApi() {
  try {
    const { data } = await apiClient.post(`/v1/calls/getClients`);
    return data;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}

export async function updateClientRecordsApi(clientDetailsPayload) {
  try {
    const { data } = await apiClient.patch(
      `/v1/calls/updateClientDetails`,
      clientDetailsPayload
    );
    return data;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}
