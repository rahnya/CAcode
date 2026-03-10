import {
  followProject,
  unfollowProject,
  getFollowedProjects,
  isProjectFollowed,
  setPreference,
  getPreference,
} from '../db/database';

interface BridgeMessage {
  id: string;
  action: string;
  payload?: any;
}

export async function handleBridgeMessage(
  message: BridgeMessage
): Promise<unknown> {
  const { action, payload } = message;

  switch (action) {
    case 'FOLLOW_PROJECT': {
      await followProject(payload.projectId);
      return { ok: true };
    }
    case 'UNFOLLOW_PROJECT': {
      await unfollowProject(payload.projectId);
      return { ok: true };
    }
    case 'GET_FOLLOWED': {
      const ids = await getFollowedProjects();
      return { ids };
    }
    case 'IS_FOLLOWED': {
      const followed = await isProjectFollowed(payload.projectId);
      return { followed };
    }
    case 'SET_PREFERENCE': {
      await setPreference(payload.key, payload.value);
      return { ok: true };
    }
    case 'GET_PREFERENCE': {
      const value = await getPreference(payload.key);
      return { value };
    }
    default:
      return { error: `Unknown action: ${action}` };
  }
}
