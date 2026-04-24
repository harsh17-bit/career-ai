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
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import '../styles/features/dashboard.css';

const difficultyColors = {
  Easy: 'green',
  Moderate: 'blue',
  Challenging: 'orange',
  Expert: 'pink',
};

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const [recommendations, setRecommendations] = useState([]);
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
      label: 'Profile Score',
      value: `${user?.profile?.marks || 0}%`,
    },
    {
      icon: FiChevronRight,
      label: 'Stream',
      value: user?.profile?.stream || 'N/A',
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg" />
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>
              Welcome back,{' '}
              <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p>Here are your AI-powered career recommendations.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon">
                <stat.icon />
              </div>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

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
        <div className="dashboard-recommendations">
          <h2 className="recommendations-title">
            <FiStar /> Recommended Careers
          </h2>
          <div className="recommendations-grid">
            {recommendations.map((career, index) => (
              <div key={career.name} className="career-card">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
