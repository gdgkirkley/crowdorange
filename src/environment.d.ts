declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PORT?: string
      APP_SECRET: string
    }
  }

  namespace Express {
    interface User {
      id: number
      username: string
    }
  }
}

export {}
