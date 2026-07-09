import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Un envío puntual del formulario público (bloque `contactForm`), asociado
 * a un `Contact`. Una misma persona puede tener varios envíos a lo largo
 * del tiempo.
 */
const contactSubmissionSchema = new Schema(
  {
    contactId: { type: Schema.Types.ObjectId, ref: "Contact", required: true, index: true },
    message: { type: String, required: true, trim: true },
    practiceArea: { type: String, trim: true }, // categoría de consulta
    status: { type: String, enum: ["new", "read", "archived"], default: "new", index: true },
    sourcePage: { type: String, trim: true }, // ruta de origen (para stats)
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type ContactSubmission = InferSchemaType<typeof contactSubmissionSchema>;

export const ContactSubmissionModel: Model<ContactSubmission> =
  (models.ContactSubmission as Model<ContactSubmission>) ??
  model<ContactSubmission>("ContactSubmission", contactSubmissionSchema);
