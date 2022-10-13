import { useMutation } from 'react-query';
import { UseMutationTypeHelper } from '../../types/global';
import api from '../../utils/api';

type VerifyIAPResponse = { granted: boolean, reason?: string, productId?: string };
export const useVerifyAppleIAP = (
  options?: UseMutationTypeHelper<VerifyIAPResponse, { receipt: string }>,
) => useMutation(
  async ({ receipt }) => (await api.post('/iap/verify/apple', { receipt })).data,
  options,
);

export const useVerifyGoogleIAP = (
  options?: UseMutationTypeHelper<VerifyIAPResponse, { token: string }>,
) => useMutation(
  async ({ token }) => (await api.post('/iap/verify/google', { token })).data,
  options,
);

export const verifyAppleIAPStatic = (receipt: string) => api.post<VerifyIAPResponse>(
  '/iap/verify/apple',
  { receipt },
);
export const verifyGoogleIAPStatic = (token: string) => api.post<VerifyIAPResponse>(
  '/iap/verify/google',
  { token },
);
