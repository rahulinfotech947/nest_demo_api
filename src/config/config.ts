export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    connectionString: process.env.MONGO_URI,
  },
  PORT: {
    PORT: process.env.PORT,
  },
  NODE_ENV: {
    NODE_ENV: process.env.NODE_ENV,
  },
});
