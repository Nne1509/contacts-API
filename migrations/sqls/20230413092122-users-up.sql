/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  firstname VARCHAR (255),
  lastname VARCHAR(255),
  username VARCHAR (255) UNIQUE NOT NULL,
  email VARCHAR (255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
