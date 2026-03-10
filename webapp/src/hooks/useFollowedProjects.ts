import { useState, useEffect, useCallback } from 'react';
import { useStorage } from './useStorage';

export function useFollowedProjects() {
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const storage = useStorage();

  useEffect(() => {
    storage.getFollowed().then(setFollowedIds);
  }, []);

  const isFollowed = useCallback(
    (projectId: string) => followedIds.includes(projectId),
    [followedIds]
  );

  const toggleFollow = useCallback(
    async (projectId: string) => {
      const currently = followedIds.includes(projectId);
      if (currently) {
        await storage.unfollow(projectId);
        setFollowedIds((prev) => prev.filter((id) => id !== projectId));
      } else {
        await storage.follow(projectId);
        setFollowedIds((prev) => [...prev, projectId]);
      }
      return !currently;
    },
    [followedIds, storage]
  );

  return { followedIds, isFollowed, toggleFollow };
}
