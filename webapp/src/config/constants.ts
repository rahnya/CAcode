// Forum
export const POST_MAX_LENGTH = 500;
export const POLL_MIN_OPTIONS = 2;
export const POLL_MAX_OPTIONS = 6;

// Region dashboard
export const LEADERBOARD_SIZE = 3;

export const CITIZEN_COUNTS: Record<string, number> = {
  '04': 1240,
  '06': 4870,
  '83': 3150,
  all: 9260,
};

export const MOCK_FOLLOW_COUNTS: Record<string, number> = {
  p1: 342, p2: 567, p3: 289, p4: 723, p5: 456,
  p6: 198, p7: 87, p8: 634, p9: 412, p10: 156,
  p11: 521, p12: 378, p13: 64, p14: 445, p15: 301,
  p16: 223, p17: 134, p18: 489,
};

// Current user (mock)
export const CURRENT_USER = {
  name: 'Vous',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=ME&backgroundColor=007461',
};
