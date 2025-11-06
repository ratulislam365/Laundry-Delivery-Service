

import UserRepository from '../repositories/user.repositories.js';
import AppError from '../utils/appError.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

export default class AuthService {
  // ================= SIGNUP =================
  static async signup({ fullName, emailOrPhone, password }) {
    let existingUser;
    let isEmail = false;

    if (emailOrPhone.includes('@')) {
      isEmail = true;
      existingUser = await UserRepository.findByEmail(emailOrPhone);
    } else {
      existingUser = await UserRepository.findByPhone(emailOrPhone);
    }

    if (existingUser) {
      throw new AppError('User with this email or phone already exists', 409);
    }

    const userData = {
      fullname: fullName,
      password,
    };

    if (isEmail) userData.email = emailOrPhone;
    else userData.phonenumber = emailOrPhone;

    // OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 মিনিট

    userData.emailVerificationOtp = otp;
    userData.emailVerificationOtpExpires = otpExpires;

    console.log('[DEBUG] signup - userData:', userData);

    const user = await UserRepository.create(userData);

    console.log(`Email verification OTP for ${user.email}: ${user.emailVerificationOtp}`);

    const accessToken = user.getJwtToken();
    const refreshToken = user.getRefreshToken();

    return { user, accessToken, refreshToken };
  }

  // ================= VERIFY OTP =================
  static async verifyOtp(email, otp) {
    console.log(`[DEBUG] verifyOtp - email: ${email}, otp: ${otp}`);
    const user = await UserRepository.findByEmail(
      email,
      '+emailVerificationOtp +emailVerificationOtpExpires'
    );

    if (!user) throw new AppError('User not found', 404);

    if (user.emailVerificationOtp !== String(otp) || user.emailVerificationOtpExpires < Date.now()) {
      console.log('[DEBUG] OTP mismatch or expired');
      throw new AppError('Invalid or expired OTP', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const accessToken = user.getJwtToken();
    const refreshToken = user.getRefreshToken();

    return { accessToken, refreshToken };
  }

  // ================= LOGIN =================
  static async login(email, password) {
    const user = await UserRepository.findUserWithPasswordByEmail(email);

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    const accessToken = user.getJwtToken();
    const refreshToken = user.getRefreshToken();

    return { accessToken, refreshToken };
  }

  // ================= FORGOT PASSWORD =================
  static async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);

    if (!user) throw new AppError('User not found', 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.passwordResetOtp = otp;
    user.passwordResetOtpExpires = otpExpires;
    await user.save({ validateBeforeSave: false });

    console.log(`Password reset OTP for ${user.email}: ${otp}`);

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        message: `Your password reset OTP is: ${otp}`,
      });
      return 'Password reset OTP sent to email';
    } catch (error) {
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError('Error sending password reset email', 500);
    }
  }

  // ================= RESET PASSWORD =================
  static async resetPassword(email, otp, password) {
    const user = await UserRepository.findByEmail(email, '+passwordResetOtp +passwordResetOtpExpires');

    if (!user) throw new AppError('User not found', 404);

    if (user.passwordResetOtp !== String(otp) || user.passwordResetOtpExpires < Date.now()) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    user.password = password;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    await user.save();

    return 'Password reset successful';
  }
}





















// import UserRepository from '../repositories/user.repositories.js';
// import AppError from '../utils/appError.js';
// import { sendEmail } from '../utils/sendEmail.js';
// import crypto from 'crypto';

// export default class AuthService {
//   static async signup({ fullName, emailOrPhone, password }) {
//     let existingUser;
//     let isEmail = false;

//     // Differentiate email/phone and check for existing user
//     if (emailOrPhone.includes('@')) {
//       isEmail = true;
//       existingUser = await UserRepository.findByEmail(emailOrPhone);
//     } else {
//       existingUser = await UserRepository.findByPhone(emailOrPhone);
//     }

//     if (existingUser) {
//       throw new AppError('User with this email or phone already exists', 409);
//     }

//     // Create user data
//     const userData = {
//       fullname: fullName, // map to model field
//       password,
//     };

//     if (isEmail) {
//       userData.email = emailOrPhone;
//     } else {
//       userData.phonenumber = emailOrPhone;
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

//     userData.emailVerificationOtp = otp;
//     userData.emailVerificationOtpExpires = otpExpires;

//     console.log('[DEBUG] signup - userData before create:', userData);

//     // Create user
//     const user = await UserRepository.create(userData);

//     // Log OTP for testing
//     console.log(`Email verification OTP for ${user.email}: ${user.emailVerificationOtp}`);

//     // Generate tokens
//     const accessToken = user.getJwtToken();
//     const refreshToken = user.getRefreshToken();

//     // Return user and tokens
//     return { user, accessToken, refreshToken };
//   }

//   static async verifyOtp(email, otp) {
//     console.log(`[DEBUG] verifyOtp - Received email: ${email}, OTP: ${otp}`);
//     const user = await UserRepository.findByEmail(email, '+emailVerificationOtp +emailVerificationOtpExpires');

//     if (!user) {
//       console.log(`[DEBUG] verifyOtp - User not found for email: ${email}`);
//       throw new AppError('User not found', 404);
//     }

//     console.log(`[DEBUG] verifyOtp - User found. Stored OTP: ${user.emailVerificationOtp}, Stored OTP Expires: ${user.emailVerificationOtpExpires}`);
//     console.log(`[DEBUG] verifyOtp - OTP mismatch check: ${user.emailVerificationOtp !== String(otp)}`);
//     console.log(`[DEBUG] verifyOtp - OTP expired check: ${user.emailVerificationOtpExpires < Date.now()}`);

//     if (user.emailVerificationOtp !== String(otp) || user.emailVerificationOtpExpires < Date.now()) {
//       throw new AppError('Invalid or expired OTP', 400);
//     }

//     user.isEmailVerified = true;
//     user.emailVerificationOtp = undefined;
//     user.emailVerificationOtpExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     const accessToken = user.getJwtToken();
//     const refreshToken = user.getRefreshToken();

//     return { accessToken, refreshToken };
//   }

//   static async login(email, password) {
//     const user = await UserRepository.findUserWithPasswordByEmail(email);

//     if (!user || !(await user.comparePassword(password))) {
//       throw new AppError('Invalid email or password', 401);
//     }

//     if (!user.isEmailVerified) {
//       throw new AppError('Please verify your email before logging in', 403);
//     }

//     const accessToken = user.getJwtToken();
//     const refreshToken = user.getRefreshToken();

//     return { accessToken, refreshToken };
//   }

//   static async forgotPassword(email) {
//     const user = await UserRepository.findByEmail(email);

//     if (!user) {
//       throw new AppError('User not found', 404);
//     }

//     const { otp, otpExpires } = user.generateOtp();
//     user.passwordResetOtp = otp;
//     user.passwordResetOtpExpires = otpExpires;

//     // Log OTP for testing
//     console.log(`Password reset OTP for ${user.email}: ${otp}`);
//     await user.save({ validateBeforeSave: false });

//     try {
//       await sendEmail({
//         email: user.email,
//         subject: 'Password Reset',
//         message: `Your password reset OTP is: ${otp}`,
//       });
//       return 'Password reset OTP sent to email';
//     } catch (error) {
//       user.passwordResetOtp = undefined;
//       user.passwordResetOtpExpires = undefined;
//       await user.save({ validateBeforeSave: false });
//       throw new AppError('There was an error sending the password reset email. Please try again later.', 500);
//     }
//   }

//   static async resetPassword(email, otp, password) {
//     const user = await UserRepository.findByEmail(email, '+passwordResetOtp +passwordResetOtpExpires');

//     console.log('User:', user);
//     console.log('Provided OTP:', otp);
//     console.log('OTP Expires:', user ? user.passwordResetOtpExpires : 'No user found');
//     console.log('Current Time:', new Date(Date.now()));

//     if (!user) {
//       throw new AppError('User not found', 404);
//     }

//     if (user.passwordResetOtp !== String(otp) || user.passwordResetOtpExpires < Date.now()) {
//       throw new AppError('Invalid or expired OTP', 400);
//     }

//     user.password = password;
//     user.passwordResetOtp = undefined;
//     user.passwordResetOtpExpires = undefined;
//     await user.save();

//     return 'Password reset successful';
//   }
// }
