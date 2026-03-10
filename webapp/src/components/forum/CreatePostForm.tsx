import React, { useState } from 'react';
import { X, Send, Plus, Trash2 } from 'lucide-react';
import { Poll } from '../../types/post';
import { POST_MAX_LENGTH, POLL_MIN_OPTIONS, POLL_MAX_OPTIONS } from '../../config/constants';
import './CreatePostForm.scss';

type CreateMode = 'post' | 'survey' | 'announcement';

const MODE_LABELS: Record<CreateMode, { title: string; placeholder: string }> = {
  post: { title: 'Nouvelle publication', placeholder: 'Partagez votre actualité avec la communauté...' },
  survey: { title: 'Nouveau sondage', placeholder: 'Posez votre question...' },
  announcement: { title: 'Nouvelle annonce', placeholder: 'Rédigez votre annonce...' },
};

interface CreatePostFormProps {
  mode: CreateMode;
  onClose: () => void;
  onSubmit: (content: string, poll?: Poll) => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ mode, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { title, placeholder } = MODE_LABELS[mode];

  const addOption = () => {
    if (options.length < POLL_MAX_OPTIONS) setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > POLL_MIN_OPTIONS) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    setOptions(options.map((o, i) => (i === index ? value : o)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let poll: Poll | undefined;
    if (mode === 'survey') {
      const validOptions = options.filter((o) => o.trim());
      if (validOptions.length < POLL_MIN_OPTIONS) return;
      poll = {
        question: content.trim(),
        options: validOptions.map((text, i) => ({ id: `opt_${i}`, text: text.trim(), votes: 0 })),
        totalVotes: 0,
      };
    }

    onSubmit(content.trim(), poll);
    onClose();
  };

  const canSubmit = mode === 'survey'
    ? content.trim() && options.filter((o) => o.trim()).length >= POLL_MIN_OPTIONS
    : content.trim() && content.length <= POST_MAX_LENGTH;

  return (
    <div className="createPostOverlay" onClick={onClose}>
      <div className="createPost" onClick={(e) => e.stopPropagation()}>
        <div className="createPostHeader">
          <h3>{title}</h3>
          <button className="createPostClose" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            className="createPostTextarea"
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={mode === 'survey' ? 3 : 5}
            autoFocus
          />

          {mode === 'survey' && (
            <div className="createPostOptions">
              {options.map((opt, i) => (
                <div key={i} className="createPostOption">
                  <input
                    className="createPostOptionInput"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                  />
                  {options.length > POLL_MIN_OPTIONS && (
                    <button type="button" className="createPostOptionRemove" onClick={() => removeOption(i)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              {options.length < POLL_MAX_OPTIONS && (
                <button type="button" className="createPostAddOption" onClick={addOption}>
                  <Plus size={14} />
                  <span>Ajouter une option</span>
                </button>
              )}
            </div>
          )}

          <div className="createPostFooter">
            <span className="createPostCharCount">
              {content.length}/{POST_MAX_LENGTH}
            </span>
            <button
              type="submit"
              className="createPostSubmit"
              disabled={!canSubmit}
            >
              <Send size={16} />
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
