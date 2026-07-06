import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Evento simple para las estadísticas del panel (sin depender de un servicio
 * externo). Ej.: visitas por página y conversiones del formulario de contacto.
 * `day` (YYYY-MM-DD) facilita las agregaciones por día.
 */
const eventSchema = new Schema(
  {
    type: { type: String, enum: ["pageview", "contact_submit"], required: true, index: true },
    path: { type: String, trim: true, index: true },
    referrer: { type: String, trim: true },
    day: { type: String, trim: true, index: true }, // "2026-07-05"
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type Event = InferSchemaType<typeof eventSchema>;

export const EventModel: Model<Event> =
  (models.Event as Model<Event>) ?? model<Event>("Event", eventSchema);
