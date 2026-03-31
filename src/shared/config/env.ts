type PublicEnv = {
  NEXT_PUBLIC_API_URL?: string;
  NEXT_PUBLIC_UMAMI_WEBSITE_ID?: string;
};

type ServerEnv = {
  GRAPHQL_API_URL?: string;
};

const publicEnv: PublicEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
};

const serverEnv: ServerEnv = {
  GRAPHQL_API_URL: process.env.GRAPHQL_API_URL ?? process.env.NEXT_PUBLIC_API_URL,
};

export const env = {
  public: publicEnv,
  server: serverEnv,
} as const;
