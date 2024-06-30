const bcrypt = require("bcryptjs");
const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

exports.registercontrlr = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if the user already exists
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    return res.json({ message: "User already exists with this email!" });
  }

  // Check if the passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Hash the password
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

exports.logincontrlr = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res.json({ message: "Invalid Credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.json({ message: "Invalid Credentials" });
    }

    // Create the payload for the JWT
    const payload = {
      user: {
        id: userExist.id,
      },
    };

    // Sign the JWT
    const authToken = jwt.sign(payload, jwt_secret, { expiresIn: "15h" });

    res
      .status(200)
      .json({ message: "Logged in Successfully", authToken, email: email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in login route" });
  }
};
exports.getUser = async (req, res) => {
  const userId = req.user.id; // Use user ID from the token

  try {
    // Find the user by ID, excluding the password
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({ message: "User not found" });
    }

    res.status(200).json({ message: "user fetched successfully", user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user details" });
  }
};
exports.updatecontrlr = async (req, res) => {
  const { name, email, password, newPassword } = req.body;
  const userId = req.user.id; // Use user ID from the token

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ message: "Unotherized access" });
    }

    // Update name and email directly
    if (name) user.name = name;
    if (email) user.email = email;

    // If password is provided, verify current password and update to new password
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedNewPassword;
    }

    // Save the updated user data
    await user.save();

    res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};
exports.addPeoplecntrlr = async (req, res) => {
  const userId = req.user.id;
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Add the email to the addedPeople array
    user.addedPeople.push(email);

    // Save the updated user document
    await user.save();

    res.status(200).send({ message: "Email added successfully", user });
  } catch (error) {
    res.status(500).send({ error: "An error occurred while adding the email" });
  }
};
