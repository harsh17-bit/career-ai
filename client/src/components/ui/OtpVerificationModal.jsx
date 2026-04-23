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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0a0f18] px-6 py-7 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:px-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                  Verification Code
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  Enter the 6-digit code
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  We sent a code to {email}. It expires in 10 minutes.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
                aria-label="Close verification modal"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex flex-col items-center gap-5">
              <div className="flex items-center gap-4">
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
                      className="h-14 w-12 rounded-2xl border border-white/15 bg-white/5 text-center text-2xl font-semibold text-white outline-none transition focus:border-cyan-300 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                    />
                  ))}
                </div>

                <div className="text-3xl font-semibold text-white/70">•</div>

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
                        className="h-14 w-12 rounded-2xl border border-white/15 bg-white/5 text-center text-2xl font-semibold text-white outline-none transition focus:border-cyan-300 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/60">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <FiClock className="h-4 w-4 text-cyan-300" />
                  {isExpired
                    ? 'Code expired'
                    : `Expires in ${formatRemaining(remainingSeconds)}`}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <p className="mt-3 text-center text-sm text-amber-300">
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
