import { useEffect, useRef } from 'react';

export default function VerificationCodeInput({
  value = '',
  length = 6,
  disabled = false,
  autoFocus = true,
  onChange,
  className = '',
}) {
  const inputRefs = useRef([]);
  const digits = Array.from({ length }, (_, index) => value[index] || '');

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const updateValue = (nextDigits, focusIndex) => {
    onChange(nextDigits.join('').slice(0, length));
    if (typeof focusIndex === 'number') {
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleDigitChange = (index, nextValue) => {
    const digit = nextValue.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;

    updateValue(nextDigits, digit && index < length - 1 ? index + 1 : index);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;

    event.preventDefault();

    const nextDigits = Array(length).fill('');
    pasted
      .slice(0, length)
      .split('')
      .forEach((digit, index) => {
        nextDigits[index] = digit;
      });

    const nextFocus = Math.min(pasted.length, length) - 1;
    updateValue(nextDigits, nextFocus >= 0 ? nextFocus : 0);
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(event) => handleDigitChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={index === 0 ? handlePaste : undefined}
          aria-label={`Verification digit ${index + 1}`}
          className="h-16 w-14 rounded-2xl border border-slate-200 bg-white text-center text-2xl font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-cyan-300 dark:focus:shadow-[0_0_0_4px_rgba(34,211,238,0.10)]"
        />
      ))}
    </div>
  );
}
