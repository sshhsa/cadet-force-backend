import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { HttpError } from "../utils/HttpError.js";
import { User } from "../models/User.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../services/authServices.js";

const register = async (req, res) => {
  const newUser = await registerUser(req.body);

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { token, user } = await loginUser(req.body);

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.json({ name, email });
};

const logout = async (req, res) => {
  await logoutUser(req.user._id);

  res.status(204).send();
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  user.verify = true;
  user.verificationToken = null;
  await user.save({ validateBeforeSave: false });

  res.json({ message: "Verification successful" });
};

export const authControllers = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  verifyEmail: ctrlWrapper(verifyEmail),
};
