import { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookies = (res: Response, tokens: AuthTokens) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
