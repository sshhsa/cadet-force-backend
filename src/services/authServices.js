import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

import { User } from "../models/User.js";
import { HttpError } from "../utils/HttpError.js";
import { sendVerificationEmail } from "./emailServices.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = randomUUID();

  const newUser = await User.create({
    name,
    email,
    password,
    verificationToken,
  });

  await sendVerificationEmail({ email, verificationToken });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  user.token = token;
  await user.save();

  return { token, user };
};

export const logoutUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  user.token = null;
  await user.save();
};
