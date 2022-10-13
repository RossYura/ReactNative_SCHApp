import { useQuery } from 'react-query';
import { UseQueryTypeHelper } from '../../types/global';
import api from '../../utils/api';

export enum SystemQueryKeys {
  GetServerTime = 'system_get_server_time',
}

export const useGetServerTime = (
  options?: UseQueryTypeHelper<{ time: string }>,
) => useQuery(
  [SystemQueryKeys.GetServerTime],
  async () => (await api.get('/system/time')).data,
  options,
);
