type PublicEnv = {
  NEXT_PUBLIC_API_URL?: string;
};

const publicEnv: PublicEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

export const env = {
  public: publicEnv,
} as const;

