import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Persona que completó el formulario público (bloque `contactForm`) al
 * menos una vez. Se identifica por `email`: un mismo email nunca genera
 * dos contactos, solo nuevos `ContactSubmission` asociados a este.
 */
const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

export type Contact = InferSchemaType<typeof contactSchema>;

export const ContactModel: Model<Contact> =
  (models.Contact as Model<Contact>) ?? model<Contact>("Contact", contactSchema);
