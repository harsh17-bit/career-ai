import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import useAuthStore from '../../store/authStore';

export default function AssessmentSummary() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const profile = user?.profile || {};
  const score = typeof profile.marks === 'number' ? profile.marks : 0;

  const topCareer =
    (user?.careerRecommendations && user.careerRecommendations[0]) || null;
  const userSkills = profile.skills || [];
  const missingSkills =
    topCareer?.requiredSkills?.filter((s) => !userSkills.includes(s)) || [];

  return (
    <section className="assessment-summary" aria-label="Assessment summary">
      <div className="summary-card">
        <div className="summary-header">
          <div className="summary-title">
            <FiBarChart2 />
            <h3>Assessment Summary</h3>
          </div>
          <div className="summary-actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/assessment')}
            >
              <FiRefreshCw />
              Retake
            </Button>
          </div>
        </div>

        <div className="summary-body">
          <div className="score-block">
            <p className="score-label">Latest score</p>
            <p className="score-value">{score}%</p>
            <div className="score-meter" aria-hidden>
              <div
                className="score-fill"
                style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
              />
            </div>
          </div>

          <div className="weak-skills">
            <p className="weak-label">Top skill gaps</p>
            <div className="weak-list">
              {missingSkills.length > 0 ? (
                missingSkills.slice(0, 6).map((s) => (
                  <Badge key={s} variant="orange">
                    {s}
                  </Badge>
                ))
              ) : (
                <div className="no-gaps">
                  You're matching recommended skills
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="summary-footer">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/assessment')}
          >
            View report
            <FiChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
