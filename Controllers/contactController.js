const { getUserID } = require("../Services/contactServices");
const pool = require("../db");
const fs = require("fs");

//@desc CREATE contact
//@route POST /api/users/:user_id/contacts/createContact
//@access private

const createContact = async (req, res) => {
  try {
    const user_id = getUserID(req);
    const { fullname, email, phonenumber } = req.body;
    if (!(fullname && email && phonenumber)) {
      return res.status(400).send("All fields are mandatory");
    }
    const conn = await pool.connect();
    const sql = `INSERT INTO contacts (fullname, email, phonenumber, user_id) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [fullname, email, phonenumber, user_id];
    const result = await conn.query(sql, values);
    const rows = result.rows[0];
    conn.release();
    return res.send(rows);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

//@desc READ all contacts
//@route GET /api/users/:user_id/contacts
//@access private

const readContacts = async (req, res) => {
  try {
    const user_id = getUserID(req);
    const conn = await pool.connect();
    const sql = `SELECT * FROM contacts WHERE user_id = $1`;
    const result = await conn.query(sql, [user_id]);
    const rows = result.rows;
    conn.release();
    return res.send(rows);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

//@desc READ contact
//@route GET /api/users/:user_id/contact
//@access private

const readContact = async (req, res) => {
  try {
    const { fullname } = req.query;
    const user_id = getUserID(req);
    const conn = await pool.connect();
    const sql = `SELECT * FROM contacts WHERE fullname ILIKE $1 AND user_id = $2`;
    const values = [`%${fullname}%`, user_id];
    const result = await conn.query(sql, values);
    const rows = result.rows;
    return res.send(rows);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

//@desc UPDATE contact
//@route PUT /api/users/:user_id/contacts/:contact_id/updateContact
//@access private

const updateContact = async (req, res) => {
  try {
    const user_id = getUserID(req);
    const { contact_id } = req.params;
    const { fullname, email, phonenumber } = req.body;
    if (!fullname && !email && !phonenumber) {
      return res
        .status(400)
        .send("please input at least one contact field to update");
    }
    const conn = await pool.connect();
    const sql = `UPDATE contacts SET
    ${fullname !== undefined ? `fullname = '${fullname}', ` : ""}
    ${email !== undefined ? `email = '${email}', ` : ""}
    ${phonenumber !== undefined ? `phonenumber = '${phonenumber}', ` : ""}
    user_id = $1 WHERE contact_id = $2
    RETURNING *;`;
    const values = [user_id, contact_id];
    const result = await conn.query(sql, values);
    const rows = result.rows[0];
    return res.send(rows);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

//desc DELETE contact
//@route DELETE /api/users/:user_id/contacts/:contact_id/deleteContact
//@access private

const deleteContact = async (req, res) => {
  try {
    const user_id = getUserID(req);
    const { contact_id } = req.params;
    const conn = await pool.connect();
    const sql = `DELETE FROM contacts WHERE contact_id = ($1) RETURNING *;`;
    const result = await conn.query(sql, [contact_id]);
    const rows = result.rows[0];
    return res.send(rows);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

module.exports = {
  createContact,
  readContacts,
  readContact,
  updateContact,
  deleteContact,
};
