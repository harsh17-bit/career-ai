import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, required: true, maxlength: 30000 },
    analysis: {
      score: { type: Number, min: 0, max: 100, default: null },
      summary: { type: String, default: '' },
      strengths: [{ type: String }],
      missingKeywords: [{ type: String }],
      suggestions: [{ type: String }],
      analyzedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

resumeSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model('Resume', resumeSchema);
