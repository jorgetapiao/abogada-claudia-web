import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Usuario del panel /admin. Para el MVP hay un único perfil (la abogada) + el
 * programador. Dejamos `role` por si en el futuro hay editores con permisos
 * distintos.
 */
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel: Model<User> =
  (models.User as Model<User>) ?? model<User>("User", userSchema);
