import { bridge } from '../lib/bridge';

export function useStorage() {
  const follow = async (projectId: string) => {
    await bridge.send('FOLLOW_PROJECT', { projectId });
  };

  const unfollow = async (projectId: string) => {
    await bridge.send('UNFOLLOW_PROJECT', { projectId });
  };

  const getFollowed = async (): Promise<string[]> => {
    const result = await bridge.send<{ ids: string[] }>('GET_FOLLOWED');
    return result.ids;
  };

  const isFollowed = async (projectId: string): Promise<boolean> => {
    const result = await bridge.send<{ followed: boolean }>('IS_FOLLOWED', { projectId });
    return result.followed;
  };

  const setPreference = async (key: string, value: string) => {
    await bridge.send('SET_PREFERENCE', { key, value });
  };

  const getPreference = async (key: string): Promise<string | null> => {
    const result = await bridge.send<{ value: string | null }>('GET_PREFERENCE', { key });
    return result.value;
  };

  return { follow, unfollow, getFollowed, isFollowed, setPreference, getPreference };
}
