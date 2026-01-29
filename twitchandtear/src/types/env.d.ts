declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_USERNAME?: string;
      CHANNELS: string;
      CLIENT_ID?: string;
      CLIENT_SECRET?: string;
      OAUTH_TOKEN?: string;
      STREAM_KEY?: string;
      TARGET_HOST?: string;
      TARGET_PORT?: string;
      DOOMWADDIR?: string;
      RCONPASSWORD?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
    }
  }
}

export {};
