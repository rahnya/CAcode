import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Comment } from '../../types/post';
import './CommentSection.scss';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText('');
  };

  const visibleComments = expanded ? comments : comments.slice(0, 2);

  return (
    <div className="commentSection">
      {comments.length > 2 && !expanded && (
        <button className="commentSectionShowAll" onClick={() => setExpanded(true)}>
          Voir les {comments.length} commentaires
        </button>
      )}
      {visibleComments.map((comment) => (
        <div key={comment.id} className="commentSectionItem">
          <img className="commentSectionAvatar" src={comment.avatarUrl} alt="" />
          <div className="commentSectionBody">
            <span className="commentSectionAuthor">{comment.author}</span>
            <span className="commentSectionText">{comment.content}</span>
          </div>
        </div>
      ))}
      <form className="commentSectionInput" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ajouter un commentaire..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={!text.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
