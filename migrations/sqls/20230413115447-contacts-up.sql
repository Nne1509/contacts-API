/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS contacts (
  contact_id SERIAL PRIMARY KEY,
  fullname VARCHAR (255),
  email VARCHAR (255),
  phonenumber VARCHAR (20) UNIQUE,
  user_id INTEGER REFERENCES users (user_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);