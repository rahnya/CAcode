import React, { useState } from 'react';
import { Poll } from '../../types/post';
import './PollDisplay.scss';

interface PollDisplayProps {
  poll: Poll;
}

export const PollDisplay: React.FC<PollDisplayProps> = ({ poll }) => {
  const [votedId, setVotedId] = useState<string | null>(null);
  const [options, setOptions] = useState(poll.options);
  const [total, setTotal] = useState(poll.totalVotes);
  const hasVoted = votedId !== null;

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    setVotedId(optionId);
    setOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
    );
    setTotal((prev) => prev + 1);
  };

  return (
    <div className="pollDisplay">
      <p className="pollDisplayQuestion">{poll.question}</p>
      <div className="pollDisplayOptions">
        {options.map((option) => {
          const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;
          return (
            <button
              key={option.id}
              className={`pollDisplayOption ${hasVoted ? 'pollDisplayOptionVoted' : ''} ${votedId === option.id ? 'pollDisplayOptionSelected' : ''}`}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
            >
              {hasVoted && (
                <div
                  className="pollDisplayBar"
                  style={{ width: `${pct}%` }}
                />
              )}
              <span className="pollDisplayText">{option.text}</span>
              {hasVoted && <span className="pollDisplayPct">{pct}%</span>}
            </button>
          );
        })}
      </div>
      <span className="pollDisplayTotal">{total} votes</span>
    </div>
  );
};
