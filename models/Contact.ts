import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Mensaje recibido desde el bloque `contactForm`.
 * `practiceArea` permite categorizar la consulta por área de derecho
 * (las opciones concretas las define el programador en el bloque/registry).
 */
const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    practiceArea: { type: String, trim: true }, // categoría de consulta
    status: { type: String, enum: ["new", "read", "archived"], default: "new", index: true },
    sourcePage: { type: String, trim: true }, // ruta de origen (para stats)
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type Contact = InferSchemaType<typeof contactSchema>;

export const ContactModel: Model<Contact> =
  (models.Contact as Model<Contact>) ?? model<Contact>("Contact", contactSchema);
