import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2,
  FiStar,
  FiArrowRight,
  FiHeadphones,
  FiBook,
  FiChevronRight,
  FiCheckCircle,
  FiTool,
  FiRotateCcw,
  FiUser,
  FiMap,
  FiPlayCircle,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useAuthStore from '../store/authStore';
import { authAPI, roadmapAPI } from '../services/api';
import '../styles/features/dashboard.css';
import AssessmentSummary from '../components/sections/AssessmentSummary';

const difficultyColors = {
  Easy: 'green',
  Moderate: 'blue',
  Challenging: 'orange',
  Expert: 'pink',
};

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const [recommendations, setRecommendations] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      updateUser(res.data);
      setRecommendations(res.data.careerRecommendations || []);
    } catch (err) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await roadmapAPI.getUserRoadmaps();
        setActiveRoadmap(res.data[0] || null);
      } catch (err) {
        console.error('Failed to fetch roadmap progress');
      }
    };

    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user?.assessmentCompleted || recommendations.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="assessment-empty-state">
          <div className="empty-icon">
            <FiHeadphones />
          </div>
          <h2>Complete Your Assessment</h2>
          <p>
            Take a quick 5-minute assessment to get personalized career
            recommendations powered by AI.
          </p>
          <Button variant="primary" onClick={() => navigate('/assessment')}>
            Start Assessment
            <FiArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  const topCareer = recommendations[0];
  const userSkills = user?.profile?.skills || [];
  const missingSkills =
    topCareer?.requiredSkills?.filter((s) => !userSkills.includes(s)) || [];
  const matchedSkills =
    topCareer?.requiredSkills?.filter((s) => userSkills.includes(s)) || [];
  const nextPhase = activeRoadmap?.phases?.find((phase) => !phase.completed);
  const completedPhases =
    activeRoadmap?.phases?.filter((phase) => phase.completed).length || 0;
  const totalPhases = activeRoadmap?.phases?.length || 0;
  const roadmapProgress = activeRoadmap?.overallProgress || 0;

  const profile = user?.profile || {};
  const completionChecks = [
    !!profile.educationLevel,
    !!profile.stream,
    Array.isArray(profile.subjects) && profile.subjects.length >= 2,
    Array.isArray(profile.interests) && profile.interests.length >= 2,
    Array.isArray(profile.skills) && profile.skills.length >= 2,
    typeof profile.goals === 'string' && profile.goals.trim().length >= 10,
    typeof profile.marks === 'number' && profile.marks >= 0,
  ];
  const profileCompletion = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100
  );

  const stats = [
    {
      icon: FiHeadphones,
      label: 'Careers Matched',
      value: recommendations.length,
    },
    {
      icon: FiBook,
      label: 'Best Match',
      value: `${recommendations[0]?.matchPercentage || 0}%`,
    },
    {
      icon: FiTrendingUp,
      label: 'Profile Completion',
      value: `${profileCompletion}%`,
    },
    {
      icon: FiChevronRight,
      label: 'Stream',
      value: user?.profile?.stream || 'N/A',
    },
  ];

  const quickActions = [
    {
      label: 'View Profile',
      icon: FiUser,
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Open Roadmap',
      icon: FiMap,
      onClick: () =>
        navigate(
          `/roadmap?career=${encodeURIComponent(topCareer?.name || '')}`
        ),
    },
    {
      label: 'Retake Assessment',
      icon: FiRotateCcw,
      onClick: () => navigate('/assessment'),
    },
  ];

  return (
    <div className="dashboard-page">
      <a href="#dashboard-main" className="dashboard-skip-link">
        Skip to dashboard content
      </a>
      <div className="dashboard-bg" />
      <main id="dashboard-main" className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>
              Welcome back,{' '}
              <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p>Here are your AI-powered career recommendations.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => navigate('/assessment')}
          >
            <FiRotateCcw className="w-4 h-4" />
            Retake Assessment
          </Button>
        </div>

        <section className="dashboard-quick-actions" aria-label="Quick actions">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="quick-action-btn"
              onClick={action.onClick}
            >
              <action.icon className="quick-action-icon" />
              <span>{action.label}</span>
              <FiChevronRight className="quick-action-chevron" />
            </button>
          ))}
        </section>

        {/* Stats Grid */}
        <section className="dashboard-stats" aria-label="Dashboard stats">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="stat-card"
              aria-label={stat.label}
            >
              <div className="stat-icon">
                <stat.icon />
              </div>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </article>
          ))}
        </section>

        {/* Assessment Summary */}
        <AssessmentSummary />

        <section className="dashboard-momentum" aria-label="Learning momentum">
          <div className="momentum-copy">
            <div className="skill-gap-badge">
              <FiPlayCircle />
              <span>Learning momentum</span>
            </div>
            {activeRoadmap ? (
              <>
                <h2>{activeRoadmap.career}</h2>
                <p>
                  {nextPhase
                    ? `Your next milestone is ${nextPhase.title}. Keep the streak moving.`
                    : 'You have completed every milestone in this roadmap.'}
                </p>
              </>
            ) : (
              <>
                <h2>Turn a career match into a plan</h2>
                <p>
                  Generate a roadmap to turn your strongest career match into
                  clear, manageable milestones.
                </p>
              </>
            )}
          </div>
          {activeRoadmap ? (
            <div className="momentum-progress">
              <div className="momentum-progress-heading">
                <span>Roadmap progress</span>
                <strong>{roadmapProgress}%</strong>
              </div>
              <div
                className="momentum-progress-track"
                role="progressbar"
                aria-label={`${roadmapProgress}% roadmap progress`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={roadmapProgress}
              >
                <span style={{ width: `${roadmapProgress}%` }} />
              </div>
              <p>
                {completedPhases} of {totalPhases} milestones complete
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  navigate(
                    `/roadmap?career=${encodeURIComponent(activeRoadmap.career)}`
                  )
                }
              >
                Continue roadmap
                <FiArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                navigate(
                  `/roadmap?career=${encodeURIComponent(topCareer?.name || '')}`
                )
              }
            >
              Build my roadmap
              <FiArrowRight className="w-4 h-4" />
            </Button>
          )}
        </section>

        {/* Skill Gap */}
        <div className="dashboard-skill-gap">
          <div className="skill-gap-header">
            <div>
              <div className="skill-gap-badge">
                <FiTool />
                <span>Skill Gap Snapshot</span>
              </div>
              <h2>Skills to focus on for {topCareer?.name || 'your career'}</h2>
              <p>
                A quick view of what you already match and what is missing from
                your current profile.
              </p>
              <div className="skill-counts">
                <div className="count-pill">{matchedSkills.length} matched</div>
                <div className="count-pill">{missingSkills.length} missing</div>
              </div>
            </div>
            <div className="missing-skills-box">
              <p className="box-label">Missing skills</p>
              <div className="skills-list">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill) => (
                    <Badge key={skill} variant="orange">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="no-missing">
                    <FiCheckCircle />
                    <span>Nothing major missing yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <section
          className="dashboard-recommendations"
          aria-label="Career recommendations"
        >
          <h2 className="recommendations-title">
            <FiStar /> Recommended Careers
          </h2>
          <div className="recommendations-grid">
            {recommendations.map((career, index) => (
              <article key={career.name} className="career-card">
                <div className="career-rank">
                  <div className="rank-badge">#{index + 1}</div>
                  <div className="match-percent">
                    <p className="percent">{career.matchPercentage}%</p>
                    <p className="label">match</p>
                  </div>
                </div>

                <div className="career-details">
                  <div className="career-header">
                    <h3>{career.name}</h3>
                    <Badge variant={difficultyColors[career.difficulty]}>
                      {career.difficulty}
                    </Badge>
                  </div>
                  <p className="career-reason">{career.reason}</p>

                  <div className="career-info">
                    <div className="info-item">
                      <FiDollarSign />
                      <span>{career.salaryRange}</span>
                    </div>
                    <div className="info-item">
                      <FiBarChart2 />
                      <span>{career.futureScope}</span>
                    </div>
                  </div>

                  <div className="required-skills">
                    {career.requiredSkills?.map((skill) => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="next-step-box">
                    <p className="next-step-label">Next Step</p>
                    <p className="next-step-text">{career.nextStep}</p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      navigate(
                        `/roadmap?career=${encodeURIComponent(career.name)}`
                      )
                    }
                  >
                    Generate Roadmap
                    <FiChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
