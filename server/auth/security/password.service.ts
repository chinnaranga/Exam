import crypto from 'crypto';

export class PasswordService {
  /**
   * Secure Password Hashing using PBKDF2 with SHA-512 & Salt
   */
  public static async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  /**
   * Verify candidate password against stored hash using timing-safe comparison
   */
  public static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return new Promise((resolve) => {
      const [salt, key] = storedHash.split(':');
      if (!salt || !key) return resolve(false);

      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) return resolve(false);
        const candidateKey = derivedKey.toString('hex');
        resolve(crypto.timingSafeEqual(Buffer.from(key), Buffer.from(candidateKey)));
      });
    });
  }

  /**
   * Password Complexity Verification
   */
  public static validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one digit.' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character.' };
    }
    return { isValid: true };
  }

  /**
   * Generate Secure 64-character Reset / Verification Hex Token
   */
  public static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
