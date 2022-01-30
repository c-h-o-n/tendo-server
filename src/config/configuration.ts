export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '60s',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '120s',
    },
  },
});
