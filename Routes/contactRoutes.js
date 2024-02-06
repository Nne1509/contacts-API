const express = require("express");
const router = express.Router();

const {
  createContact,
  readContacts,
  readContact,
  updateContact,
  deleteContact,
} = require("../Controllers/contactController");
const { validateToken } = require("../middleware/validateTokenHandler");

router
  .route("/api/users/:user_id/contacts/createContact")
  .post(validateToken, createContact);

router.route("/api/users/:user_id/contacts").get(validateToken, readContacts);

router.route("/api/users/:user_id/contact").get(validateToken, readContact);

router
  .route("/api/users/:user_id/contacts/:contact_id/updateContact")
  .put(validateToken, updateContact);

router
  .route("/api/users/:user_id/contacts/:contact_id/deleteContact")
  .delete(validateToken, deleteContact);

module.exports = router;
