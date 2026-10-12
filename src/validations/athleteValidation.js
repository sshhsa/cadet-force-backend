import Joi from "joi";

const SPORTS = [
  "sambo",
  "thai-boxing",
  "athletics",
  "football",
  "kickboxing",
  "judo",
];

export const createAthleteSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  department: Joi.string().required().messages({
    "string.empty": "Department is required",
    "any.required": "Department is required",
  }),
  course: Joi.number().integer().min(1).max(4).required().messages({
    "number.base": "Course must be a number",
    "number.min": "Course must be between 1 and 4",
    "number.max": "Course must be between 1 and 4",
    "any.required": "Course is required",
  }),
  sport: Joi.string()
    .valid(...SPORTS)
    .required()
    .messages({
      "any.only": "Sport must be one of: " + SPORTS.join(", "),
      "any.required": "Sport is required",
    }),
  rank: Joi.string().required().messages({
    "string.empty": "Rank is required",
    "any.required": "Rank is required",
  }),
  achievements: Joi.string().allow("").optional(),
});

export const updateAthleteSchema = Joi.object({
  name: Joi.string(),
  department: Joi.string(),
  course: Joi.number().integer().min(1).max(4),
  sport: Joi.string().valid(...SPORTS),
  rank: Joi.string(),
  achievements: Joi.string().allow(""),
}).min(1);
