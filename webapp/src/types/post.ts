export interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export interface Post {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  poll?: Poll;
}
