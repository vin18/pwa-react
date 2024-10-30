import apiClient from '@/utils/apiClient';

export async function getCallsApi(dealerId) {
  try {
    const { data } = await apiClient.post(`/v1/calls/getCalls`, { dealerId });
    return data;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}

export async function getRecordingApi(recordingPath) {
  try {
    const { data } = await apiClient.post(`/v1/calls/getRecording`, {
      recordingPath,
    });
    return data;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}
