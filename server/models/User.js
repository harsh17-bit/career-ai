import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationOtpHash: { type: String, default: '' },
    emailVerificationExpiresAt: { type: Date, default: null },
    emailVerificationAttempts: { type: Number, default: 0 },
    passwordResetOtpHash: { type: String, default: '' },
    passwordResetExpiresAt: { type: Date, default: null },
    passwordResetAttempts: { type: Number, default: 0 },
    lastWeeklyCheckInAt: { type: Date, default: null },
    profile: {
      educationLevel: { type: String, default: '' },
      stream: { type: String, default: '' },
      marks: { type: Number, default: 0 },
      subjects: [{ type: String }],
      interests: [{ type: String }],
      skills: [{ type: String }],
      goals: { type: String, default: '' },
    },
    assessmentCompleted: { type: Boolean, default: false },
    careerRecommendations: [
      {
        name: String,
        matchPercentage: Number,
        reason: String,
        requiredSkills: [String],
        salaryRange: String,
        futureScope: String,
        difficulty: String,
        nextStep: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
