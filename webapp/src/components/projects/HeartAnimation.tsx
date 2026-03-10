import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import './HeartAnimation.scss';

interface HeartAnimationProps {
  trigger: number; // increment to trigger animation
}

export const HeartAnimation: React.FC<HeartAnimationProps> = ({ trigger }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1300);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div className="heartAnimation">
      <Heart size={120} fill="#e62f44" strokeWidth={0} />
    </div>
  );
};
