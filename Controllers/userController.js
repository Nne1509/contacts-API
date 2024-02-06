const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//@desc REGISTER users
//@route POST /users/register
//@access public

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (!(firstname && lastname && username && email && password)) {
      return res.status(400).send("All fields are mandatory!");
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const conn = await pool.connect();
      const sql = `INSERT INTO users(
        firstname, lastname, username, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;
      const values = [firstname, lastname, username, email, hashedPassword];
      const result = await conn.query(sql, values);
      const rows = result.rows[0];
      conn.release();
      res.status(201).send(rows);
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

//@desc LOGIN users
//@route POST /users/login
//@access public

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("All fields are mandatory");
    }
    // checks if user is in database
    const conn = await pool.connect();
    const sql = `SELECT * FROM users WHERE username ILIKE $1;`;
    const result = await conn.query(sql, [username]);
    const user = result.rows[0];
    if (!user) {
      res.status(400).send("account not found");
    }
    //compare password with hashed password
    const hashedPassword = result.rows[0].password;
    conn.release();
    if (!(await bcrypt.compare(password, hashedPassword))) {
      return res.status(401).send("Invalid password");
    }
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2h",
    });
    res.status(201).send({ accessToken, message: "You are logged in" });
  } catch (error) {
    res.status(500).send({ error });
  }
};

//@desc get users from database
//@route GET /users
//@access public

const getUsers = async (req, res) => {
  try {
    const conn = await pool.connect();
    const sql = `SELECT * FROM users`;
    const result = await conn.query(sql);
    const rows = result.rows;
    res.status(200).send(rows);
  } catch (error) {
    res.status(500).send({ error });
  }
};

module.exports = { registerUser, loginUser, getUsers };
