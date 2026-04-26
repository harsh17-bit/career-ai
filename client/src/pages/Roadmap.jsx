import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMap,
  FiClock,
  FiBook,
  FiVideo,
  FiFileText,
  FiExternalLink,
  FiCheckCircle,
  FiCircle,
  FiLock,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiLoader,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { roadmapAPI } from '../services/api';
import toast from 'react-hot-toast';
import { addNotification } from '../utils/notifications';

const resourceIcons = {
  course: FiBook,
  video: FiVideo,
  book: FiFileText,
  doc: FiFileText,
};

const difficultyColors = {
  Beginner: 'green',
  Intermediate: 'blue',
  Advanced: 'orange',
  Expert: 'pink',
};

export default function Roadmap() {
  const [searchParams] = useSearchParams();
  const career = searchParams.get('career');
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(0);

  const completedMilestones =
    activeRoadmap?.phases?.filter((phase) => phase.completed)?.length || 0;
  const totalMilestones = activeRoadmap?.phases?.length || 0;

  const getStreak = () => {
    const dates = (activeRoadmap?.phases || [])
      .filter((phase) => phase.completedAt)
      .map((phase) => new Date(phase.completedAt).setHours(0, 0, 0, 0))
      .sort((a, b) => b - a);

    if (!dates.length) return 0;

    let streak = 1;
    for (let index = 0; index < dates.length - 1; index += 1) {
      const currentDay = dates[index];
      const nextDay = dates[index + 1];
      const dayDiff = (currentDay - nextDay) / (24 * 60 * 60 * 1000);

      if (dayDiff === 1) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = getStreak();

  const completionBadge = (() => {
    const progress = activeRoadmap?.overallProgress || 0;
    if (progress >= 100) return 'Platinum';
    if (progress >= 75 || streak >= 5) return 'Gold';
    if (progress >= 50 || streak >= 3) return 'Silver';
    return 'Bronze';
  })();

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (career && roadmaps.length === 0) {
      generateNewRoadmap();
    }
  }, [career]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await roadmapAPI.getUserRoadmaps();
      setRoadmaps(res.data);
      if (res.data.length > 0) {
        const match = career
          ? res.data.find(
              (r) => r.career.toLowerCase() === career.toLowerCase()
            )
          : null;
        setActiveRoadmap(match || res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const generateNewRoadmap = async () => {
    if (!career) return;
    setGenerating(true);
    try {
      const res = await roadmapAPI.generate({ career, level: 'beginner' });
      setActiveRoadmap(res.data);
      setRoadmaps((prev) => [res.data, ...prev]);
      addNotification({
        type: 'roadmap',
        title: 'Roadmap generated',
        description: `${res.data.career} is ready with ${res.data.phases?.length || 0} phases.`,
        href: `/roadmap?career=${encodeURIComponent(res.data.career)}`,
      });
      toast.success('Roadmap generated!');
    } catch (err) {
      toast.error('Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const togglePhase = async (phaseIndex) => {
    if (!activeRoadmap) return;
    try {
      const res = await roadmapAPI.toggleMilestone({
        roadmapId: activeRoadmap._id,
        phaseIndex,
      });
      setActiveRoadmap(res.data);

      if (res.data.phases[phaseIndex].completed) {
        addNotification({
          type: 'milestone',
          title: 'Milestone completed',
          description: `${res.data.phases[phaseIndex].title} is marked complete.`,
          href: '/roadmap',
        });
        toast.success('Phase completed! 🎉', { icon: '🏆' });
      }
    } catch (err) {
      toast.error('Failed to update milestone');
    }
  };

  if (loading || generating) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <FiLoader className="w-12 h-12 text-apple-blue mx-auto mb-4 animate-spin" />
          <p className="text-white/40">
            {generating
              ? 'AI is building your roadmap...'
              : 'Loading roadmaps...'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!activeRoadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-3xl gradient-bg mx-auto mb-6 flex items-center justify-center">
            <FiMap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            No Roadmaps Yet
          </h2>
          <p className="text-white/40 mb-8">
            Generate a career roadmap from your dashboard to get started.
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="roadmap-page min-h-screen pt-6 sm:pt-8 pb-14 sm:pb-20 px-4 sm:px-6 relative">
      <div className="roadmap-bg absolute inset-0 gradient-mesh opacity-20" />

      <div className="container-apple relative z-10 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <FiStar className="w-5 h-5 text-apple-blue" />
            <span className="text-sm font-semibold text-apple-blue uppercase tracking-wider">
              Learning Roadmap
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 sm:mb-3">
            {activeRoadmap.career}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/40 text-sm sm:text-base">
            <span className="flex items-center gap-1.5">
              <FiClock className="w-4 h-4" />
              {activeRoadmap.totalDuration}
            </span>
            <Badge variant="blue">{activeRoadmap.level}</Badge>
          </div>

          <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white/70">
              {completedMilestones}/{totalMilestones} milestones
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white/70">
              {streak} day streak
            </div>
            <Badge
              variant={
                completionBadge === 'Platinum'
                  ? 'pink'
                  : completionBadge === 'Gold'
                    ? 'orange'
                    : completionBadge === 'Silver'
                      ? 'blue'
                      : 'green'
              }
            >
              {completionBadge} badge
            </Badge>
          </div>
        </motion.div>

        {/* Roadmap selector if multiple */}
        {roadmaps.length > 1 && (
          <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
            {roadmaps.map((rm) => (
              <button
                key={rm._id}
                onClick={() => {
                  setActiveRoadmap(rm);
                  setExpandedPhase(0);
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeRoadmap._id === rm._id
                    ? 'bg-apple-blue/20 text-apple-blue border border-apple-blue/30'
                    : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                }`}
              >
                {rm.career}
              </button>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/50">
              Overall Progress
            </span>
            <span className="text-base sm:text-lg font-bold gradient-text">
              {activeRoadmap.overallProgress || 0}%
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between text-xs text-white/35">
            <span>
              {completedMilestones} completed milestone
              {completedMilestones === 1 ? '' : 's'}
            </span>
            <span>{completionBadge} badge</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-bg rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${activeRoadmap.overallProgress || 0}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>

        {/* Phases Timeline */}
        <div className="space-y-3 sm:space-y-4">
          {activeRoadmap.phases?.map((phase, index) => {
            const isExpanded = expandedPhase === index;
            const isLocked =
              index > 0 &&
              !activeRoadmap.phases[index - 1]?.completed &&
              !phase.completed;
            const ResourceIcon =
              resourceIcons[phase.resources?.[0]?.type] || FiBook;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div
                  className={`glass-card rounded-3xl overflow-hidden transition-all duration-500 ${
                    phase.completed ? 'border-green-500/20' : ''
                  } ${isLocked ? 'opacity-60' : ''}`}
                >
                  {/* Phase header */}
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? -1 : index)}
                    className="w-full p-4 sm:p-6 flex items-center gap-3 sm:gap-4 text-left"
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                        phase.completed
                          ? 'bg-green-500/20'
                          : isLocked
                            ? 'bg-white/5'
                            : 'bg-apple-blue/20'
                      }`}
                    >
                      {phase.completed ? (
                        <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                      ) : isLocked ? (
                        <FiLock className="w-5 h-5 sm:w-6 sm:h-6 text-white/30" />
                      ) : (
                        <span className="text-base sm:text-lg font-bold text-apple-blue">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                        {phase.title}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1">
                        <span className="text-xs sm:text-sm text-white/40 flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5" />
                          {phase.duration}
                        </span>
                        <Badge
                          variant={
                            difficultyColors[phase.difficulty] || 'default'
                          }
                        >
                          {phase.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {isExpanded ? (
                      <FiChevronUp className="w-5 h-5 text-white/30" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-white/30" />
                    )}
                  </button>

                  {/* Phase content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
                          {/* Topics */}
                          <div>
                            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                              Topics
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {phase.topics?.map((topic, ti) => (
                                <div
                                  key={ti}
                                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                                >
                                  <FiCircle className="w-3.5 h-3.5 text-apple-blue flex-shrink-0" />
                                  <span className="text-sm text-white/70">
                                    {topic}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Resources */}
                          {phase.resources?.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                                Resources
                              </h4>
                              <div className="space-y-2">
                                {phase.resources.map((resource, ri) => {
                                  const Icon =
                                    resourceIcons[resource.type] || FiBook;
                                  return (
                                    <a
                                      key={ri}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all group"
                                    >
                                      <Icon className="w-4 h-4 text-apple-blue flex-shrink-0" />
                                      <span className="text-sm text-white/70 flex-1">
                                        {resource.title}
                                      </span>
                                      <Badge variant="default">
                                        {resource.type}
                                      </Badge>
                                      <FiExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Complete button */}
                          <Button
                            variant={phase.completed ? 'ghost' : 'primary'}
                            size="sm"
                            onClick={() => togglePhase(index)}
                            disabled={isLocked}
                          >
                            {phase.completed ? (
                              <>
                                <FiCheckCircle className="w-4 h-4" />
                                Completed — Undo
                              </>
                            ) : (
                              <>
                                <FiAward className="w-4 h-4" />
                                Mark as Complete
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
