import { useQuery } from 'react-query';
import { AvatarId, UseQueryTypeHelper } from '../../types/global';
import api from '../../utils/api';

export enum AudioQueryKeys {
  GetAllStaticTTS = 'audio_get_all_static_tts',
}

export const useGetAllStaticTTS = (
  options?: UseQueryTypeHelper<Record<AvatarId, string[]> & { none: string[], _lastUpdate: string }>,
) => useQuery(
  [AudioQueryKeys.GetAllStaticTTS],
  async () => (await api.get('/audio/static-tts')).data,
  options,
);
