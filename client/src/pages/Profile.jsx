import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiAward,
  FiBook,
  FiHeart,
  FiTool,
  FiSave,
} from 'react-icons/fi';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ name: form.name });
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page min-h-screen pt-6 sm:pt-8 pb-14 sm:pb-20 px-4 sm:px-6 relative">
      <div className="profile-bg absolute inset-0 gradient-mesh opacity-20" />

      <div className="container-apple relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 sm:mb-3">
            Profile
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/40">
            Manage your account and career preferences.
          </p>
        </motion.div>

        {/* Avatar + Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-5 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl gradient-bg flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                {user?.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/40">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">
                <FiUser className="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-apple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">
                <FiMail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                value={form.email}
                disabled
                className="input-apple opacity-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              loading={loading}
            >
              <FiSave className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* Profile Details */}
        {user?.profile && user.assessmentCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Assessment Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                  <FiAward className="w-4 h-4" />
                  Education Level
                </div>
                <p className="text-white font-medium">
                  {user.profile.educationLevel}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                  <FiBook className="w-4 h-4" />
                  Stream
                </div>
                <p className="text-white font-medium">{user.profile.stream}</p>
              </div>
            </div>

            <hr className="border-white/[0.06] my-6" />

            {/* Subjects */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white/50 mb-3">
                Subjects
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.profile.subjects?.map((s) => (
                  <Badge key={s} variant="blue">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white/50 mb-3 flex items-center gap-1">
                <FiHeart className="w-3.5 h-3.5" />
                Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.profile.interests?.map((i) => (
                  <Badge key={i} variant="purple">
                    {i}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium text-white/50 mb-3 flex items-center gap-1">
                <FiTool className="w-3.5 h-3.5" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.profile.skills?.map((s) => (
                  <Badge key={s} variant="green">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
