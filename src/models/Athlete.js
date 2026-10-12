import { Schema, model } from "mongoose";

const athleteSchema = new Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    course: { type: Number, required: true, min: 1, max: 4 },
    sport: { type: String, required: true },
    rank: { type: String, required: true },
    achievements: { type: String, default: "" },
    avatarURL: { type: String, default: null },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { versionKey: false, timestamps: true },
);

export const Athlete = model("Athlete", athleteSchema);
