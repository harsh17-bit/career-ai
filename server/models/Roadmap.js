import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  title: String,
  duration: String,
  difficulty: String,
  topics: [String],
  resources: [
    {
      title: String,
      type: { type: String, enum: ['course', 'book', 'video', 'doc'] },
      url: String,
    },
  ],
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    career: { type: String, required: true },
    level: { type: String, default: 'beginner' },
    totalDuration: String,
    phases: [phaseSchema],
    overallProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
