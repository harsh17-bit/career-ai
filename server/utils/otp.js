import crypto from 'crypto';

export const generateOtp = () =>
  String(crypto.randomInt(100000, 999999)).padStart(6, '0');

export const hashOtp = (otp) =>
  crypto.createHash('sha256').update(otp).digest('hex');
