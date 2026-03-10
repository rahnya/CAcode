import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Post, Comment } from '../../types/post';
import { PollDisplay } from './PollDisplay';
import { CommentSection } from './CommentSection';
import './PostCard.scss';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onAddComment: (text: string) => void;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `il y a ${diffMins}min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `il y a ${diffDays}j`;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onAddComment }) => {
  return (
    <div className="postCard">
      <div className="postCardHeader">
        <img className="postCardAvatar" src={post.avatarUrl} alt="" />
        <div className="postCardMeta">
          <span className="postCardAuthor">{post.author}</span>
          <span className="postCardTime">{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      <p className="postCardContent">{post.content}</p>

      {post.poll && <PollDisplay poll={post.poll} />}

      <div className="postCardActions">
        <button
          className={`postCardAction ${post.liked ? 'postCardActionLiked' : ''}`}
          onClick={onLike}
        >
          <Heart
            size={18}
            fill={post.liked ? '#e62f44' : 'none'}
            stroke={post.liked ? '#e62f44' : 'currentColor'}
          />
          <span>{post.likes}</span>
        </button>
        <div className="postCardAction postCardActionStatic">
          <MessageCircle size={18} />
          <span>{post.comments.length}</span>
        </div>
      </div>

      {(post.comments.length > 0 || true) && (
        <CommentSection comments={post.comments} onAddComment={onAddComment} />
      )}
    </div>
  );
};
