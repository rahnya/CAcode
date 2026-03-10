import { Post, Comment, Poll } from '../types/post';
import { POSTS } from '../data/posts';
import { CURRENT_USER } from '../config/constants';

export const postService = {
  async getAll(): Promise<Post[]> {
    return POSTS;
  },

  createPost(content: string, poll?: Poll): Post {
    return {
      id: `post_${Date.now()}`,
      author: CURRENT_USER.name,
      avatarUrl: CURRENT_USER.avatarUrl,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
      poll,
    };
  },

  createComment(text: string): Comment {
    return {
      id: `c_${Date.now()}`,
      author: CURRENT_USER.name,
      avatarUrl: CURRENT_USER.avatarUrl,
      content: text,
      createdAt: new Date().toISOString(),
    };
  },
};
