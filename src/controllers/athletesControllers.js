import { unlink } from "node:fs/promises";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { HttpError } from "../utils/HttpError.js";
import { Athlete } from "../models/Athlete.js";
import { uploadAvatar } from "../services/cloudinaryServices.js";

const getAll = async (req, res) => {
  const athletes = await Athlete.find({});

  res.json(athletes);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const athlete = await Athlete.findOne({ _id: id, owner: req.user._id });

  if (!athlete) {
    throw HttpError(404, "Athlete not found");
  }

  res.json(athlete);
};

const create = async (req, res) => {
  const newAthlete = await Athlete.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json(newAthlete);
};

const update = async (req, res) => {
  const { id } = req.params;

  const updatedAthlete = await Athlete.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    req.body,
    { new: true },
  );

  if (!updatedAthlete) {
    throw HttpError(404, "Athlete not found");
  }

  res.json(updatedAthlete);
};

const remove = async (req, res) => {
  const { id } = req.params;

  const deletedAthlete = await Athlete.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });

  if (!deletedAthlete) {
    throw HttpError(404, "Athlete not found");
  }

  res.json({ message: "Athlete deleted" });
};

const updateAvatar = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  const avatarURL = await uploadAvatar(req.file.path);
  await unlink(req.file.path);

  const updatedAthlete = await Athlete.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { avatarURL },
    { new: true },
  );

  if (!updatedAthlete) {
    throw HttpError(404, "Athlete not found");
  }

  res.json(updatedAthlete);
};

export const athleteControllers = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  create: ctrlWrapper(create),
  update: ctrlWrapper(update),
  remove: ctrlWrapper(remove),
  updateAvatar: ctrlWrapper(updateAvatar),
};
