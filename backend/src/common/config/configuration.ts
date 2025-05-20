export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    url: process.env.DATABASE_URL,
  },
  app: {
    domain: process.env.APP_DOMAIN || 'http://localhost:3000',
    apiPrefix: process.env.API_PREFIX || 'api',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
});
