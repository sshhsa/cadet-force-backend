import { Router } from "express";

import { athleteControllers } from "../controllers/athletesControllers.js";
import { validateBody } from "../middleware/validateBody.js";
import { authenticate } from "../middleware/authenticate.js";
import { isValidId } from "../middleware/isValidId.js";
import { upload } from "../middleware/upload.js";
import {
  createAthleteSchema,
  updateAthleteSchema,
} from "../validations/athleteValidation.js";

export const athleteRouter = Router();

athleteRouter.get("/", athleteControllers.getAll);
athleteRouter.get(
  "/:id",
  authenticate,
  isValidId,
  athleteControllers.getById,
);
athleteRouter.post(
  "/",
  authenticate,
  validateBody(createAthleteSchema),
  athleteControllers.create,
);
athleteRouter.patch(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateAthleteSchema),
  athleteControllers.update,
);
athleteRouter.patch(
  "/:id/avatar",
  authenticate,
  isValidId,
  upload.single("avatar"),
  athleteControllers.updateAvatar,
);
athleteRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  athleteControllers.remove,
);
