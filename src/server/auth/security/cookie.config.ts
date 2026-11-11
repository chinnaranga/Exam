import { Response } from 'express';

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'examifypro_access_token',
  REFRESH_TOKEN: 'examifypro_refresh_token',
};

const IS_PROD = process.env.NODE_ENV === 'production';

export class CookieConfig {
  /**
   * Set HTTP-Only Secure Cookies for Access & Refresh Tokens
   */
  public static setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    accessExpMs: number,
    refreshExpMs: number
  ) {
    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      expires: new Date(accessExpMs),
      path: '/',
    });

    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      expires: new Date(refreshExpMs),
      path: '/api/v1/auth/refresh',
    });
  }

  /**
   * Clear Authentication Cookies on Logout
   */
  public static clearAuthCookies(res: Response) {
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, { path: '/' });
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { path: '/api/v1/auth/refresh' });
  }
}
