const express = require("express");
const {
  registercontrlr,
  logincontrlr,
  updatecontrlr,
  getUser,
  addPeoplecntrlr,
} = require("../controllers/usercontrollers");
const currentUser = require("./middleware/currentUser");

const router = express.Router();

router.post("/register", registercontrlr);
router.post("/login", logincontrlr);
router.post("/getuser", currentUser, getUser);
router.post("/update", currentUser, updatecontrlr);
router.post("/add-people", currentUser, addPeoplecntrlr);
module.exports = router;
