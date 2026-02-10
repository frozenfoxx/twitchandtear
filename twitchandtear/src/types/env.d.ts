declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_USERNAME?: string;
      CHANNELS: string;
      CLIENT_ID?: string;
      CLIENT_SECRET?: string;
      REFRESH_TOKEN?: string;
      OAUTH_TOKEN?: string;
      REDIRECT_PORT?: string;
      STREAM_KEY?: string;
      TARGET_HOST?: string;
      TARGET_PORT?: string;
      TARGET_PASSWORD?: string;
      DOOMWADDIR?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
    }
  }
}

export {};
