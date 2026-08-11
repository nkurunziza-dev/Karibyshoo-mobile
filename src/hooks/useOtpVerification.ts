import { useCallback, useEffect, useMemo, useState } from 'react';

export type OtpStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error';

export function useOtpVerification({
  expirySeconds = 90,
  codeLength = 6,
}: {
  expirySeconds?: number;
  codeLength?: number;
} = {}) {
  const [code, setCode] = useState('');
  const [expiresIn, setExpiresIn] = useState(expirySeconds);
  const [status, setStatus] = useState<OtpStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'sent' && status !== 'verifying') {
      return;
    }

    if (expiresIn <= 0) {
      setStatus('idle');
      return;
    }

    const timeout = setTimeout(() => {
      setExpiresIn((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [expiresIn, status]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(expiresIn / 60);
    const seconds = expiresIn % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, [expiresIn]);

  const sendCode = useCallback(async (target?: string) => {
    setStatus('sending');
    setError(null);

    if (target && !target.trim()) {
      setError('Destination is required.');
      setStatus('error');
      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));

    setCode('');
    setExpiresIn(expirySeconds);
    setStatus('sent');
    return true;
  }, [expirySeconds]);

  const verifyCode = useCallback(async (value: string) => {
    const normalizedValue = value.replace(/\s+/g, '');

    if (normalizedValue.length !== codeLength) {
      setError(`Enter the ${codeLength}-digit code.`);
      setStatus('error');
      return false;
    }

    setStatus('verifying');
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 350));

    if (normalizedValue === '000000') {
      setError('Invalid verification code.');
      setStatus('error');
      return false;
    }

    setCode(normalizedValue);
    setStatus('verified');
    return true;
  }, [codeLength]);

  const resendCode = useCallback(async (target?: string) => {
    setError(null);
    setStatus('sending');
    await new Promise((resolve) => setTimeout(resolve, 250));
    setExpiresIn(expirySeconds);
    setStatus('sent');
    setCode('');
    return true;
  }, [expirySeconds]);

  const clearError = useCallback(() => {
    setError(null);
    setStatus((current) => (current === 'error' ? 'idle' : current));
  }, []);

  return {
    code,
    setCode,
    expiresIn,
    formattedTime,
    status,
    error,
    sendCode,
    verifyCode,
    resendCode,
    clearError,
  };
}
