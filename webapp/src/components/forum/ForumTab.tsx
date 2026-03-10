import React, { useState, useEffect } from 'react';
import { Plus, X, MessageSquarePlus, BarChart3, Megaphone, LucideIcon } from 'lucide-react';
import { Post, Poll } from '../../types/post';
import { postService } from '../../services/postService';
import { PostCard } from './PostCard';
import { CreatePostForm } from './CreatePostForm';
import './ForumTab.scss';

type CreateMode = 'post' | 'survey' | 'announcement';

const FAB_ACTIONS: { mode: CreateMode; label: string; icon: LucideIcon }[] = [
  { mode: 'post', label: 'Publication', icon: MessageSquarePlus },
  { mode: 'survey', label: 'Sondage', icon: BarChart3 },
  { mode: 'announcement', label: 'Annonce', icon: Megaphone },
];

export const ForumTab: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fabOpen, setFabOpen] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode | null>(null);

  useEffect(() => {
    postService.getAll().then(setPosts);
  }, []);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const comment = postService.createComment(text);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
  };

  const handleCreate = (content: string, poll?: Poll) => {
    const newPost = postService.createPost(content, poll);
    setPosts((prev) => [newPost, ...prev]);
  };

  const openCreate = (mode: CreateMode) => {
    setFabOpen(false);
    setCreateMode(mode);
  };

  return (
    <div className="forumTab">
      <div className="forumTabFeed">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            onAddComment={(text) => handleAddComment(post.id, text)}
          />
        ))}
      </div>

      <div className="forumTabFabGroup">
        {fabOpen && (
          <div className="forumTabFabActions">
            {FAB_ACTIONS.map(({ mode, label, icon: Icon }) => (
              <button key={mode} className="forumTabFabAction" onClick={() => openCreate(mode)}>
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
        <button
          className={`forumTabFab ${fabOpen ? 'forumTabFabOpen' : ''}`}
          onClick={() => setFabOpen(!fabOpen)}
        >
          {fabOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {fabOpen && <div className="forumTabFabOverlay" onClick={() => setFabOpen(false)} />}

      {createMode && (
        <CreatePostForm
          mode={createMode}
          onClose={() => setCreateMode(null)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};
