import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiArrowLeft,
  FiAward,
  FiBook,
  FiZap,
  FiTool,
  FiTarget,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';
import { careerAPI } from '../services/api';
import {
  EDUCATION_LEVELS,
  STREAMS,
  SUBJECTS,
  INTERESTS,
  SKILLS,
} from '../utils/constants';
import toast from 'react-hot-toast';

const steps = [
  {
    id: 0,
    title: 'Education Level',
    subtitle: 'What is your current education level?',
    icon: FiAward,
  },
  {
    id: 1,
    title: 'Your Stream',
    subtitle: 'Select your field of study',
    icon: FiBook,
  },
  {
    id: 2,
    title: 'Subjects & Interests',
    subtitle: 'Pick subjects you enjoy and your interests',
    icon: FiZap,
  },
  {
    id: 3,
    title: 'Skills',
    subtitle: 'Select your current skills',
    icon: FiTool,
  },
  {
    id: 4,
    title: 'Goals & Marks',
    subtitle: 'Tell us about your goals and academic performance',
    icon: FiTarget,
  },
];

const calculateAcademicScore = (form) => {
  const educationScore = form.educationLevel ? 12 : 0;
  const streamScore = form.stream ? 8 : 0;
  const subjectsScore = Math.min(form.subjects.length, 6) * 4;
  const interestsScore = Math.min(form.interests.length, 6) * 2;
  const skillsScore = Math.min(form.skills.length, 8) * 4;
  const goalsLength = (form.goals || '').trim().length;
  const goalsScore = Math.min(goalsLength, 200) * 0.18;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        educationScore +
          streamScore +
          subjectsScore +
          interestsScore +
          skillsScore +
          goalsScore
      )
    )
  );
};

export default function Assessment() {
  const ASSESSMENT_DRAFT_KEY = 'career-ai-assessment-draft';

  const { user, updateUser } = useAuthStore();

  const buildInitialForm = () => ({
    educationLevel: user?.profile?.educationLevel || '',
    stream: user?.profile?.stream || '',
    marks: typeof user?.profile?.marks === 'number' ? user.profile.marks : 0,
    subjects: Array.isArray(user?.profile?.subjects)
      ? user.profile.subjects
      : [],
    interests: Array.isArray(user?.profile?.interests)
      ? user.profile.interests
      : [],
    skills: Array.isArray(user?.profile?.skills) ? user.profile.skills : [],
    goals: user?.profile?.goals || '',
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(buildInitialForm);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ASSESSMENT_DRAFT_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.form && typeof parsed.form === 'object') {
        setForm((prev) => ({ ...prev, ...parsed.form }));
      }
      if (typeof parsed?.step === 'number') {
        setStep(Math.max(0, Math.min(4, parsed.step)));
      }
    } catch {
      // Ignore malformed draft data.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      ASSESSMENT_DRAFT_KEY,
      JSON.stringify({ form, step })
    );
  }, [form, step]);

  useEffect(() => {
    const nextScore = calculateAcademicScore(form);
    if (nextScore !== form.marks) {
      setForm((prev) => ({ ...prev, marks: nextScore }));
    }
  }, [
    form.educationLevel,
    form.stream,
    form.subjects,
    form.interests,
    form.skills,
    form.goals,
  ]);

  const toggleArray = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!form.educationLevel;
      case 1:
        return !!form.stream;
      case 2:
        return form.subjects.length >= 2 && form.interests.length >= 2;
      case 3:
        return form.skills.length >= 2;
      case 4:
        return (
          form.goals.length >= 10 &&
          Number.isFinite(Number(form.marks)) &&
          Number(form.marks) > 0 &&
          Number(form.marks) <= 100
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await careerAPI.getRecommendations(form);
      updateUser({
        assessmentCompleted: true,
        careerRecommendations: res.data.careers,
        profile: form,
      });
      window.localStorage.removeItem(ASSESSMENT_DRAFT_KEY);
      toast.success('Career recommendations ready!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to generate recommendations'
      );
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    } else handleSubmit();
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const OptionGrid = ({ options, selected, onSelect, multi = false }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {options.map((option) => {
        const isSelected = multi
          ? selected.includes(option)
          : selected === option;
        return (
          <motion.button
            key={option}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(option)}
            className={`px-4 py-3.5 rounded-2xl text-sm font-medium text-left transition-all duration-300 border ${
              isSelected
                ? 'bg-apple-blue/20 border-apple-blue/50 text-apple-blue'
                : 'bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:border-white/[0.15]'
            }`}
          >
            {option}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <div className="assessment-page min-h-screen flex flex-col pt-20 relative">
      <div className="assessment-bg absolute inset-0 gradient-mesh opacity-50" />

      {/* Progress bar */}
      <div className="fixed top-[72px] left-0 right-0 z-40 h-1 bg-white/5">
        <motion.div
          className="h-full gradient-bg"
          animate={{ width: `${((step + 1) / 5) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Step counter */}
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-right mb-6"
          >
            <span className="text-sm font-mono text-white/30">
              {String(step + 1).padStart(2, '0')} / 05
            </span>
          </motion.div>

          {/* Step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/[0.08]">
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const Icon = steps[step].icon;
                    return <Icon className="w-6 h-6 text-apple-blue" />;
                  })()}
                  <span className="text-sm font-semibold text-apple-blue uppercase tracking-wider">
                    Step {step + 1}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  {steps[step].title}
                </h2>
                <p className="text-white/40 mb-8">{steps[step].subtitle}</p>

                {/* Step 0: Education Level */}
                {step === 0 && (
                  <OptionGrid
                    options={EDUCATION_LEVELS}
                    selected={form.educationLevel}
                    onSelect={(v) => setForm({ ...form, educationLevel: v })}
                  />
                )}

                {/* Step 1: Stream */}
                {step === 1 && (
                  <OptionGrid
                    options={STREAMS}
                    selected={form.stream}
                    onSelect={(v) => setForm({ ...form, stream: v })}
                  />
                )}

                {/* Step 2: Subjects & Interests */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Subjects{' '}
                        <span className="text-white/30 text-sm font-normal">
                          (min 2)
                        </span>
                      </h3>
                      <OptionGrid
                        options={SUBJECTS}
                        selected={form.subjects}
                        onSelect={(v) => toggleArray('subjects', v)}
                        multi
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Interests{' '}
                        <span className="text-white/30 text-sm font-normal">
                          (min 2)
                        </span>
                      </h3>
                      <OptionGrid
                        options={INTERESTS}
                        selected={form.interests}
                        onSelect={(v) => toggleArray('interests', v)}
                        multi
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Skills */}
                {step === 3 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Your Skills{' '}
                      <span className="text-white/30 text-sm font-normal">
                        (min 2)
                      </span>
                    </h3>
                    <OptionGrid
                      options={SKILLS}
                      selected={form.skills}
                      onSelect={(v) => toggleArray('skills', v)}
                      multi
                    />
                  </div>
                )}

                {/* Step 4: Goals & Marks */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">
                        Academic Score (%)
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full gradient-bg"
                            animate={{ width: `${form.marks}%` }}
                            transition={{ duration: 0.35 }}
                          />
                        </div>
                        <span className="text-2xl font-bold text-white w-16 text-right">
                          {form.marks}%
                        </span>
                      </div>
                      <p className="text-xs text-white/35 mt-2">
                        Auto-calculated from your selected education, stream,
                        subjects, interests, skills, and career goals.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/50 mb-2">
                        Career Goals
                      </label>
                      <textarea
                        value={form.goals}
                        onChange={(e) =>
                          setForm({ ...form, goals: e.target.value })
                        }
                        placeholder="Describe your dream career and what you want to achieve..."
                        rows={4}
                        className="input-apple resize-none"
                      />
                      <p className="text-xs text-white/30 mt-1">
                        {form.goals.length}/200 characters (min 10)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={step === 0}
              className={step === 0 ? 'invisible' : ''}
            >
              <FiArrowLeft className="w-5 h-5" />
              Back
            </Button>

            <Button
              variant="primary"
              onClick={goNext}
              disabled={!canProceed()}
              loading={loading}
            >
              {step === 4 ? 'Get Recommendations' : 'Continue'}
              <FiArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
