import { useEffect, useRef, useState } from 'react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve(window.google);
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google sign-in'));
    document.head.appendChild(script);
  });
}

export default function GoogleSignInButton({
  mode = 'signin',
  onSuccess,
  className = '',
}) {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const [ready, setReady] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const buttonText = mode === 'signup' ? 'signup_with' : 'signin_with';

  useEffect(() => {
    if (!clientId || !containerRef.current) return undefined;

    let cancelled = false;

    const renderButton = () => {
      if (!window.google?.accounts?.id || !containerRef.current || cancelled) {
        return;
      }

      const target = containerRef.current;
      const wrapperWidth = target.parentElement?.clientWidth || 320;
      const buttonWidth = Math.max(280, Math.min(wrapperWidth, 480));

      target.innerHTML = '';
      if (!window.__gsiInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response?.credential) {
              toast.error('Google sign-in failed. Please try again.');
              return;
            }

            try {
              const res = await authAPI.googleAuth({
                credential: response.credential,
              });
              toast.success(
                mode === 'signup'
                  ? 'Account created with Google!'
                  : 'Signed in with Google!'
              );
              onSuccess?.(res.data);
            } catch (error) {
              toast.error(
                error.response?.data?.message || 'Google sign-in failed'
              );
            }
          },
        });
        window.__gsiInitialized = true;
      }

      // Always (re)render the button so it can adapt to size/resize.
      window.google.accounts.id.renderButton(target, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        width: buttonWidth,
        text: buttonText,
        logo_alignment: 'left',
      });

      setReady(true);
    };

    loadGoogleScript()
      .then(() => renderButton())
      .catch(() => {
        toast.error('Google sign-in could not be loaded.');
      });

    if (window.ResizeObserver && containerRef.current.parentElement) {
      observerRef.current = new ResizeObserver(() => {
        renderButton();
      });
      observerRef.current.observe(containerRef.current.parentElement);
    } else {
      window.addEventListener('resize', renderButton);
    }

    return () => {
      cancelled = true;
      if (observerRef.current) observerRef.current.disconnect();
      window.removeEventListener('resize', renderButton);
    };
  }, [clientId, mode, onSuccess]);

  if (!clientId) {
    return (
      <div
        className={`rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 ${className}`}
      >
        Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.
      </div>
    );
  }

  return (
    <div className={`flex w-full justify-center ${className}`}>
      <div className="w-full max-w-[480px] rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div
          ref={containerRef}
          className="flex justify-center"
          aria-live="polite"
        />
        {!ready && (
          <div className="px-3 py-2 text-center text-sm text-slate-500 dark:text-slate-300">
            Loading Google sign-in...
          </div>
        )}
      </div>
    </div>
  );
}
