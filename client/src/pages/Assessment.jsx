import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import StepTimeline from '../components/AssessmentLayout/StepTimeline';
import StepContent from '../components/AssessmentLayout/StepContent';
import { careerAPI } from '../services/api';
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

  const saveDraft = () => {
    try {
      window.localStorage.setItem(
        ASSESSMENT_DRAFT_KEY,
        JSON.stringify({ form, step })
      );
      toast.success('Draft saved');
    } catch (e) {
      toast.error('Failed to save draft');
    }
  };

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(ASSESSMENT_DRAFT_KEY);
      setForm(buildInitialForm());
      setStep(0);
      toast.success('Draft cleared');
    } catch (e) {
      toast.error('Failed to clear draft');
    }
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

  const [direction, setDirection] = useState(0);
  const cardRef = useRef(null);

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

  // Focus management: focus first interactive element when step changes
  useEffect(() => {
    const root = cardRef.current;
    const focusable = root?.querySelector(
      'button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) {
      focusable.focus();
    }
  }, [step]);

  // Keyboard navigation: Arrow keys to navigate steps, Ctrl/Cmd+S to save draft
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        if (canProceed()) goNext();
      } else if (e.key === 'ArrowLeft') {
        goBack();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveDraft();
      } else if (e.key === 'Home') {
        setStep(0);
      } else if (e.key === 'End') {
        setStep(4);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, form]);

  return (
    <div className="assessment-page min-h-screen flex flex-col relative">
      <div className="assessment-bg absolute inset-0 gradient-mesh opacity-50" />

      {/* Progress bar */}
      <div className="fixed top-[64px] sm:top-[72px] left-0 right-0 z-40 h-1 bg-white/5">
        <motion.div
          className="h-full gradient-bg"
          animate={{ width: `${((step + 1) / 5) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Main container: side-by-side on desktop, stacked on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 pt-16 sm:pt-20">
        {/* Left Sidebar: Timeline - hidden on mobile/tablet, visible on lg+ */}
        <div className="hidden lg:flex lg:w-1/3 bg-white/[0.02] backdrop-blur-sm">
          <StepTimeline
            steps={steps}
            currentStep={step}
            onStepSelect={setStep}
            disabled={false}
          />
        </div>

        {/* Right Content: Main assessment content */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 md:px-8 py-8 lg:py-6">
          <div className="w-full max-w-2xl">
            {/* Mobile timeline toggle - visible on mobile/tablet only */}
            <div className="lg:hidden mb-6 sm:mb-8">
              <details className="group">
                <summary className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] cursor-pointer hover:bg-white/[0.04] transition">
                  <span className="text-sm font-semibold text-white">
                    Step {step + 1} of 5: {steps[step].title}
                  </span>
                  <span className="transform group-open:rotate-180 transition">
                    ▼
                  </span>
                </summary>
                <div className="mt-2 bg-white/[0.01] rounded-lg border border-white/[0.05] max-h-64 overflow-y-auto">
                  <StepTimeline
                    steps={steps}
                    currentStep={step}
                    onStepSelect={setStep}
                    disabled={false}
                  />
                </div>
              </details>
            </div>

            {/* Draft controls */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
              <span className="text-sm font-mono text-white/30">
                {String(step + 1).padStart(2, '0')} / 05
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="text-xs text-white/40 hover:text-white/60 px-2 py-1 rounded-md transition"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={clearDraft}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-md transition"
                >
                  Clear Draft
                </button>
              </div>
            </div>

            {/* Step content card */}
            <div
              ref={cardRef}
              className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/[0.08]"
              tabIndex={-1}
            >
              <StepContent
                currentStep={step}
                steps={steps}
                form={form}
                direction={direction}
                onFormChange={setForm}
                toggleArray={toggleArray}
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-5 sm:mt-8 gap-3">
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
    </div>
  );
}
