import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface AnalyzedDocument extends MongooseDocument {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  originalText: string;
  categories?: string[];
  summary?: string;
  entities?: Array<{ type: string; text: string }>;
  sentiment?: { label: "positive" | "neutral" | "negative"; score?: number };
  topics?: string[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EntitySchema = new Schema<{ type: string; text: string }>(
  {
    type: { type: String, required: true },
    text: { type: String, required: true }
  },
  { _id: false }
);

const DocumentSchema = new Schema<AnalyzedDocument>(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },
    originalText: { type: String, required: true },
    categories: [{ type: String }],
    summary: { type: String },
    entities: [EntitySchema],
    sentiment: {
      label: { type: String, enum: ["positive", "neutral", "negative"] },
      score: { type: Number, min: 0, max: 1 }
    },
    topics: [{ type: String }],
    error: { type: String }
  },
  { timestamps: true }
);

export const DocumentModel =
  mongoose.models.Document || mongoose.model<AnalyzedDocument>("Document", DocumentSchema);


