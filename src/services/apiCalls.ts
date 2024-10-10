import apiClient from '@/utils/apiClient';

export async function getCallsApi() {
  try {
    const { data } = await apiClient.post(`/v1/calls/getCalls`);
    return data;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}
