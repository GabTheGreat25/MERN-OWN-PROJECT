import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = "test";
// const secret =
//   "xzKt9XQ5mhfYbZcfjK7kczG5f5n4j4Nqd3yXcM9NnF7jY8BvQhN7gLk5t5p4f4E3";

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModal.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (await UserModal.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const newUser = await UserModal.create({
      email,
      password: await bcrypt.hash(password, 12),
      name: `${firstName} ${lastName}`,
    });

    const payload = {
      id: newUser._id,
      name: newUser.name,
    };

    res.status(200).json({
      user: newUser,
      token: jwt.sign(payload, secret, { expiresIn: "1h" }),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
