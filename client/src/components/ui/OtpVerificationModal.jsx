import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiClock, FiRotateCcw, FiX } from 'react-icons/fi';
import Button from './Button';

const OTP_LENGTH = 6;

const formatRemaining = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export default function OtpVerificationModal({
  isOpen,
  email,
  expiresAt,
  verifying = false,
  resending = false,
  onClose,
  onVerify,
  onResend,
}) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const inputRefs = useRef([]);

  const otp = useMemo(() => digits.join(''), [digits]);
  const isExpired = remainingSeconds <= 0;

  useEffect(() => {
    if (!isOpen) {
      setDigits(Array(OTP_LENGTH).fill(''));
      setRemainingSeconds(0);
      return;
    }

    const tick = () => {
      const nextRemaining = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      );
      setRemainingSeconds(nextRemaining);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isOpen, expiresAt]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const updateDigit = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, index) => {
      next[index] = char;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.length !== OTP_LENGTH || isExpired || verifying) return;
    onVerify(otp);
  };

  const handleResend = async () => {
    if (resending) return;
    setDigits(Array(OTP_LENGTH).fill(''));
    await onResend();
    inputRefs.current[0]?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/20 p-3 backdrop-blur-sm dark:bg-black/80 sm:items-center sm:px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-[24px] border border-slate-200 bg-white px-4 py-5 text-slate-900 shadow-2xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#0a0f18] dark:text-white dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:rounded-[28px] sm:px-8 sm:py-7"
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300/80">
                  Verification Code
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Enter the 6-digit code
                </h2>
                <p className="mt-2 break-words text-sm leading-6 text-slate-500 dark:text-white/55">
                  We sent a code to {email}. It expires in 10 minutes.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:text-white/50 transition dark:hover:bg-white/5 dark:hover:text-white"
                aria-label="Close verification modal"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-5 sm:mt-8">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                <div className="flex gap-2 sm:gap-3">
                  {digits.slice(0, 3).map((digit, index) => (
                    <input
                      key={`left-${index}`}
                      ref={(node) => {
                        inputRefs.current[index] = node;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(event) =>
                        updateDigit(index, event.target.value)
                      }
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="h-12 w-10 rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-semibold text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(6,182,212,0.12)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-cyan-300 dark:focus:bg-white/10 dark:focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] sm:h-14 sm:w-12 sm:rounded-2xl sm:text-2xl"
                    />
                  ))}
                </div>

                <div className="hidden text-3xl font-semibold text-slate-300 dark:text-white/70 sm:block">
                  •
                </div>

                <div className="flex gap-2 sm:gap-3">
                  {digits.slice(3).map((digit, index) => {
                    const actualIndex = index + 3;
                    return (
                      <input
                        key={`right-${index}`}
                        ref={(node) => {
                          inputRefs.current[actualIndex] = node;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(event) =>
                          updateDigit(actualIndex, event.target.value)
                        }
                        onKeyDown={(event) => handleKeyDown(actualIndex, event)}
                        className="h-12 w-10 rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-semibold text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(6,182,212,0.12)] dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-cyan-300 dark:focus:bg-white/10 dark:focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] sm:h-14 sm:w-12 sm:rounded-2xl sm:text-2xl"
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-3">
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60 sm:w-auto">
                  <FiClock className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                  {isExpired
                    ? 'Code expired'
                    : `Expires in ${formatRemaining(remainingSeconds)}`}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:w-auto"
                >
                  <FiRotateCcw className="h-4 w-4" />
                  Resend code
                </button>
              </div>

              <div className="w-full max-w-sm">
                <Button
                  type="button"
                  className="w-full !rounded-2xl"
                  loading={verifying}
                  disabled={otp.length !== OTP_LENGTH || isExpired}
                  onClick={handleVerify}
                >
                  Verify Email
                </Button>
                {isExpired && (
                  <p className="mt-3 text-center text-sm text-amber-600 dark:text-amber-300">
                    Your code expired. Request a new one to continue.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
