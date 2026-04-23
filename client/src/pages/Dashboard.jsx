import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
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
  FiDownload,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

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
  const topCareer = recommendations[0];
  const userSkills = user?.profile?.skills || [];
  const missingSkills =
    topCareer?.requiredSkills?.filter((skill) => !userSkills.includes(skill)) ||
    [];
  const matchedSkills =
    topCareer?.requiredSkills?.filter((skill) => userSkills.includes(skill)) ||
    [];

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

  const handleGenerateRoadmap = (career) => {
    navigate(`/roadmap?career=${encodeURIComponent(career)}`);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let y = 20;

    const addText = (
      text,
      size = 11,
      color = [25, 28, 36],
      weight = 'normal'
    ) => {
      doc.setFont('helvetica', weight);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y);
      y += lines.length * lineHeight;
    };

    const addSection = (title) => {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.text(title, margin, y);
      y += 8;
    };

    const addBulletList = (items) => {
      if (!items.length) {
        addText('None', 11, [90, 96, 109]);
        return;
      }

      items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, maxWidth);
        doc.text(lines, margin, y);
        y += lines.length * lineHeight;
      });
    };

    doc.setFillColor(37, 99, 235);
    doc.roundedRect(0, 0, pageWidth, 18, 0, 0, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CareerAI Career Summary', margin, 11);

    y = 28;
    addText(`Name: ${user?.name || 'User'}`, 12, [17, 24, 39], 'bold');
    addText(
      `Generated on: ${new Date().toLocaleDateString()}`,
      10,
      [90, 96, 109]
    );

    addSection('Profile Overview');
    addText(`Stream: ${user?.profile?.stream || 'N/A'}`);
    addText(`Marks: ${user?.profile?.marks || 0}%`);
    addText(`Education Level: ${user?.profile?.educationLevel || 'N/A'}`);

    addSection('Top Career Match');
    if (topCareer) {
      addText(`Career: ${topCareer.name}`, 12, [17, 24, 39], 'bold');
      addText(`Match: ${topCareer.matchPercentage || 0}%`);
      addText(`Difficulty: ${topCareer.difficulty || 'N/A'}`);
      addText(`Salary Range: ${topCareer.salaryRange || 'N/A'}`);
      addText(`Future Scope: ${topCareer.futureScope || 'N/A'}`);
      addText(`Why it fits: ${topCareer.reason || 'N/A'}`);

      addSection('Skills');
      addText('Matched skills:');
      addBulletList(matchedSkills);
      y += 2;
      addText('Missing skills:');
      addBulletList(missingSkills);
    } else {
      addText('No career recommendation available yet.');
    }

    if (recommendations.length > 1) {
      addSection('Other Recommendations');
      addBulletList(
        recommendations
          .slice(1, 4)
          .map(
            (career) => `${career.name} - ${career.matchPercentage || 0}% match`
          )
      );
    }

    doc.save(
      `careerai-summary-${user?.name?.replace(/\s+/g, '-').toLowerCase() || 'profile'}.pdf`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full gradient-bg mx-auto mb-4 animate-pulse" />
          <p className="text-white/40">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user?.assessmentCompleted || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-3xl gradient-bg mx-auto mb-6 flex items-center justify-center">
            <FiHeadphones className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Complete Your Assessment
          </h2>
          <p className="text-white/40 mb-8">
            Take a quick 5-minute assessment to get personalized career
            recommendations powered by AI.
          </p>
          <Button variant="primary" onClick={() => navigate('/assessment')}>
            Start Assessment
            <FiArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen pt-24 pb-20 px-6 relative">
      <div className="dashboard-bg absolute inset-0 gradient-mesh opacity-30" />

      <div className="container-apple relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Welcome back,{' '}
              <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-lg text-white/40">
              Here are your AI-powered career recommendations.
            </p>
          </div>

          <Button variant="secondary" onClick={handleExportPdf}>
            Export PDF
            <FiDownload className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            {
              icon: FiHeadphones,
              label: 'Careers Matched',
              value: recommendations.length,
              color: 'from-blue-500 to-cyan-400',
            },
            {
              icon: FiBook,
              label: 'Best Match',
              value: `${recommendations[0]?.matchPercentage || 0}%`,
              color: 'from-purple-500 to-pink-400',
            },
            {
              icon: FiTrendingUp,
              label: 'Profile Score',
              value: `${user?.profile?.marks || 0}%`,
              color: 'from-green-500 to-emerald-400',
            },
            {
              icon: FiChevronRight,
              label: 'Stream',
              value: user?.profile?.stream || 'N/A',
              color: 'from-orange-500 to-amber-400',
            },
          ].map((stat, i) => (
            <div key={stat.label} className="card-apple text-center">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} mx-auto mb-3 flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Skill Gap Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <Card className="p-6 md:p-7" glow>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-2">
                  <FiTool className="h-5 w-5 text-apple-blue" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-apple-blue">
                    Skill Gap Snapshot
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {topCareer
                    ? `Skills to focus on for ${topCareer.name}`
                    : 'Skills to focus on next'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  {topCareer
                    ? 'A quick view of what you already match and what is missing from your current profile.'
                    : 'Complete your assessment to get a personalized skill gap summary.'}
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70">
                    {matchedSkills.length} matched
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70">
                    {missingSkills.length} missing
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                  Missing skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((skill) => (
                      <Badge key={skill} variant="orange">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <FiCheckCircle className="h-4 w-4" />
                      <span>Nothing major missing yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
            <FiStar className="w-6 h-6 text-apple-blue" />
            Recommended Careers
          </h2>

          <div className="space-y-4">
            {recommendations.map((career, index) => (
              <motion.div
                key={career.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="!p-0 overflow-hidden" glow>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Rank & Match */}
                      <div className="flex items-center md:flex-col md:items-center gap-4 md:gap-2 md:min-w-[80px]">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                          <span className="text-xl font-bold text-white">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold gradient-text">
                            {career.matchPercentage}%
                          </p>
                          <p className="text-xs text-white/30">match</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            {career.name}
                          </h3>
                          <Badge variant={difficultyColors[career.difficulty]}>
                            {career.difficulty}
                          </Badge>
                        </div>
                        <p className="text-white/50 text-sm mb-4 leading-relaxed">
                          {career.reason}
                        </p>

                        {/* Info chips */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-white/50">
                            <FiDollarSign className="w-4 h-4 text-green-400" />
                            <span>{career.salaryRange}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/50">
                            <FiBarChart2 className="w-4 h-4 text-blue-400" />
                            <span>{career.futureScope}</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {career.requiredSkills?.map((skill) => (
                            <Badge key={skill} variant="default">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {/* Next Step */}
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
                          <p className="text-xs text-white/30 mb-1">
                            Next Step
                          </p>
                          <p className="text-sm text-white/70">
                            {career.nextStep}
                          </p>
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleGenerateRoadmap(career.name)}
                        >
                          Generate Roadmap
                          <FiChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
