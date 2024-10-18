import apiClient from '@/utils/apiClient';

interface IPayload {
  userId: string;
  password: string;
}

export async function loginApi(values: IPayload) {
  try {
    const { data } = await apiClient.post(
      `/v1/auth/login?loginType=${1}`,
      values
    );
    return data;
  } catch (error: unknown) {
    console.log(error);
    throw new Error(error?.response?.data?.message ?? error);
  }
}

export async function logoutApi() {
  try {
    const { data } = await apiClient.post('/v1/auth/logout');
    return data.data;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}

export async function localStorageApi() {
  try {
    const { data } = await apiClient.post(`/v1/auth/getLocalStorageSecretKey`);
    return data.lssk;
  } catch (error: unknown) {
    console.log(error);
    return error;
  }
}
