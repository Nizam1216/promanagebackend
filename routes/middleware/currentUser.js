const jwt = require("jsonwebtoken");

const currentUser = (req, res, next) => {
  const authToken = req.header("authToken");
  if (!authToken) {
    return res.json({ message: "unauthorized access please Login!!" });
  }

  try {
    //this down line will check if anybtampering happened in authtoken or not.
    const legitUser = jwt.verify(authToken, process.env.JWT_SECRET);

    req.user = legitUser.user;
    next();
  } catch (error) {
    res.json({ message: "unauthorized access please Login!!" });
  }
};

module.exports = currentUser;
