import Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  PORT: Joi.number().port().default(4000),
  FRONTEND_URL: Joi.string().uri().default("http://localhost:3000"),
  GROQ_API_KEY: Joi.string().allow("").optional(),
  GROQ_MODEL: Joi.string().default("openai/gpt-oss-20b"),
  AI_GLOBAL_RPM: Joi.number().integer().min(1).default(1),
  AI_GLOBAL_RPD: Joi.number().integer().min(1).default(100),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),

  GOOGLE_CLIENT_ID: Joi.string().allow("").optional(),

  GOOGLE_CLIENT_SECRET: Joi.string().allow("").optional(),

  GOOGLE_CALLBACK_URL: Joi.string().uri().allow("").optional(),
});
