import type { Request, Response } from "express";

import crypto from "node:crypto";

import { prisma } from "../app";

import axios from "axios";
import jwt, { type SignOptions } from "jsonwebtoken";

export const register = async (_req: Request, res: Response) => {
  res.status(501).json({ status: "not_implemented" });
};

export const login = async (_req: Request, res: Response) => {
  res.status(501).json({ status: "not_implemented" });
};

export const logout = async (_req: Request, res: Response) => {
  res.status(501).json({ status: "not_implemented" });
};

export const me = async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userEmail: true,
      firstName: true,
      lastName: true,
      status: true,
      role: { select: { name: true } },
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ status: "error", message: "User not found" });
    return;
  }

  res.status(200).json({
    status: "ok",
    user: {
      id: user.id,
      email: user.userEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.name,
      status: user.status,
      createdAt: user.createdAt,
    },
  });
};

type OAuthProvider = "google" | "facebook" | "wechat";

const isOAuthProvider = (value: string): value is OAuthProvider =>
  value === "google" || value === "facebook" || value === "wechat";

const FRONTEND_OAUTH_REDIRECT =
  process.env.FRONTEND_OAUTH_REDIRECT || "http://localhost:5173/oauth/callback";

const FRONTEND_LINKED_ACCOUNTS_REDIRECT =
  process.env.FRONTEND_LINKED_ACCOUNTS_REDIRECT ||
  "http://localhost:5173/settings/linked-accounts";

const WECHAT_DEMO_MODE =
  String(process.env.WECHAT_DEMO_MODE || "").toLowerCase() === "true" ||
  String(process.env.WECHAT_DEMO_MODE || "") === "1";

const JWT_SECRET = process.env.JWT_SECRET;

const ensureJwtSecret = () => {
  if (!JWT_SECRET) {
    throw new Error("Missing env: JWT_SECRET");
  }
  return JWT_SECRET;
};

const issueJwt = (userId: number) => {
  const secret = ensureJwtSecret();
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  return jwt.sign({ sub: userId }, secret, { expiresIn });
};

type OAuthFlow = "login" | "link";
type OAuthStateRecord = {
  provider: OAuthProvider;
  flow: OAuthFlow;
  userId?: number;
  createdAtMs: number;
};
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const oauthState = new Map<string, OAuthStateRecord>();

const cleanupOauthState = () => {
  const now = Date.now();
  for (const [key, record] of oauthState.entries()) {
    if (now - record.createdAtMs > OAUTH_STATE_TTL_MS) {
      oauthState.delete(key);
    }
  }
};

const newState = (provider: OAuthProvider, flow: OAuthFlow = "login", userId?: number) => {
  cleanupOauthState();
  const state = crypto.randomBytes(24).toString("hex");
  oauthState.set(state, { provider, flow, userId, createdAtMs: Date.now() });
  return state;
};

const consumeState = (provider: OAuthProvider, state: string, flow: OAuthFlow = "login") => {
  cleanupOauthState();
  const record = oauthState.get(state);
  if (!record) return null;
  oauthState.delete(state);
  if (record.provider !== provider) return null;
  if (record.flow !== flow) return null;
  return record;
};

const redirectToFrontend = (res: Response, params: Record<string, string>) => {
  const url = new URL(FRONTEND_OAUTH_REDIRECT);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  res.redirect(302, url.toString());
};

const redirectToLinkedAccounts = (res: Response, params: Record<string, string>) => {
  const url = new URL(FRONTEND_LINKED_ACCOUNTS_REDIRECT);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  res.redirect(302, url.toString());
};

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
};

const getEnvOptional = (key: string) => process.env[key];

const getRoleIdForOAuthUsers = async () => {
  const role = await prisma.role.upsert({
    where: { name: "BUYER" },
    update: {},
    create: { name: "BUYER" },
  });
  return role.id;
};

const linkOrCreateUserForSocial = async (args: {
  provider: Exclude<OAuthProvider, "wechat">;
  providerUserId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const { provider, providerUserId } = args;
  const email = args.email?.trim() || undefined;

  const existingSocial = await prisma.userSocialAccount.findFirst({
    where: { provider, providerUserId },
  });
  if (existingSocial) {
    const user = await prisma.user.findUnique({ where: { id: existingSocial.userId } });
    if (!user) {
      throw new Error("Linked user not found");
    }
    return user;
  }

  const existingUserByEmail = email
    ? await prisma.user.findUnique({ where: { userEmail: email } })
    : null;

  if (existingUserByEmail) {
    await prisma.userSocialAccount.create({
      data: {
        provider,
        providerUserId,
        email,
        userId: existingUserByEmail.id,
      },
    });
    return existingUserByEmail;
  }

  const roleId = await getRoleIdForOAuthUsers();

  const safeEmail = email || `${provider}-${providerUserId}@no-email.example`;
  const firstName = args.firstName?.trim() || "OAuth";
  const lastName = args.lastName?.trim() || provider;

  const user = await prisma.user.create({
    data: {
      roleId,
      firstName,
      lastName,
      userEmail: safeEmail,
      status: "ACTIVE",
      socialAccounts: {
        create: {
          provider,
          providerUserId,
          email,
        },
      },
    },
  });

  return user;
};

const linkOrCreateUserForWechatDemo = async () => {
  const provider = "wechat";
  const providerUserId = "demo-user";
  const email = "wechat-demo@no-email.example";

  const existingSocial = await prisma.userSocialAccount.findFirst({
    where: { provider, providerUserId },
  });
  if (existingSocial) {
    const user = await prisma.user.findUnique({ where: { id: existingSocial.userId } });
    if (!user) {
      throw new Error("Linked user not found");
    }
    return user;
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: { userEmail: email },
  });

  if (existingUserByEmail) {
    await prisma.userSocialAccount.create({
      data: {
        provider,
        providerUserId,
        email,
        userId: existingUserByEmail.id,
      },
    });
    return existingUserByEmail;
  }

  const roleId = await getRoleIdForOAuthUsers();

  const user = await prisma.user.create({
    data: {
      roleId,
      firstName: "Demo",
      lastName: "WeChat",
      userEmail: email,
      status: "ACTIVE",
      socialAccounts: {
        create: {
          provider,
          providerUserId,
          email,
        },
      },
    },
  });

  return user;
};

export const wechatDemoLogin = async (_req: Request, res: Response) => {
  try {
    const state = newState("wechat", "login");

    console.info("auth.wechat.demo.login", {
      result: "start",
      state,
    });

    const callbackPath = `/api/auth/wechat/demo/callback?state=${encodeURIComponent(state)}`;

    res
      .status(200)
      .type("html")
      .send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>WeChat Demo Login</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;margin:0;background:#0b1220;color:#e5e7eb}
      .wrap{max-width:720px;margin:0 auto;padding:32px}
      .card{background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px}
      .qr{display:flex;align-items:center;justify-content:center;width:240px;height:240px;margin:16px 0;background:#0f172a;border:1px dashed #334155;border-radius:12px;color:#94a3b8}
      .muted{color:#9ca3af;font-size:14px}
      .row{display:flex;gap:24px;flex-wrap:wrap}
      a{color:#60a5fa}
      code{background:#0f172a;padding:2px 6px;border-radius:6px}
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>WeChat Demo Login</h1>
      <div class="card">
        <div class="row">
          <div>
            <div class="qr">QR (demo)</div>
            <div class="muted">This is a simulated QR-style flow. No real WeChat integration.</div>
          </div>
          <div style="flex:1;min-width:260px">
            <p>Simulating scan + authorization…</p>
            <p class="muted">State: <code>${state}</code></p>
            <p class="muted">If you are not redirected automatically, click: <a href="${callbackPath}">Continue</a></p>
          </div>
        </div>
      </div>
    </div>
    <script>
      setTimeout(function(){ window.location.assign(${JSON.stringify(callbackPath)}); }, 1400);
    </script>
  </body>
</html>`);
  } catch (error) {
    console.error("auth.wechat.demo.login error:", error);
    redirectToFrontend(res, { error: "wechat_demo_login_failed" });
  }
};

export const wechatDemoCallback = async (req: Request, res: Response) => {
  const state = typeof req.query.state === "string" ? req.query.state : undefined;

  if (!state) {
    console.info("auth.wechat.demo.callback", { result: "missing_state" });
    redirectToFrontend(res, { error: "missing_state" });
    return;
  }

  if (!consumeState("wechat", state, "login")) {
    console.info("auth.wechat.demo.callback", { result: "invalid_state" });
    redirectToFrontend(res, { error: "invalid_state" });
    return;
  }

  try {
    const user = await linkOrCreateUserForWechatDemo();
    const token = issueJwt(user.id);

    console.info("auth.wechat.demo.callback", {
      result: "success",
      userId: user.id,
    });

    redirectToFrontend(res, { token });
  } catch (error) {
    console.error("auth.wechat.demo.callback error:", error);
    redirectToFrontend(res, { error: "wechat_demo_callback_failed" });
  }
};

export const oauthStart = (provider: OAuthProvider) => {
  return (req: Request, res: Response) => {
    if (!isOAuthProvider(provider)) {
      res.status(400).json({ status: "error", message: "Unsupported provider" });
      return;
    }

    if (provider === "wechat") {
      if (WECHAT_DEMO_MODE) {
        res.redirect(302, "/api/auth/wechat/demo/login");
        return;
      }
      res.status(501).json({ status: "not_implemented", provider });
      return;
    }

    try {
      const state = newState(provider, "login");

      console.info("auth.oauth.start", {
        provider,
        path: req.path,
      });

      if (provider === "google") {
        const clientId = getEnv("GOOGLE_CLIENT_ID");
        const redirectUri =
          getEnvOptional("GOOGLE_REDIRECT_URI") ||
          "http://localhost:5000/api/auth/google/callback";
        const scope = getEnvOptional("GOOGLE_SCOPES") || "openid,email,profile";

        const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", scope.split(",").join(" "));
        url.searchParams.set("state", state);
        url.searchParams.set("access_type", "online");
        url.searchParams.set("include_granted_scopes", "true");

        res.redirect(302, url.toString());
        return;
      }

      const appId = getEnv("FACEBOOK_APP_ID");
      const redirectUri =
        getEnvOptional("FACEBOOK_REDIRECT_URI") ||
        "http://localhost:5000/api/auth/facebook/callback";
      const scope = getEnvOptional("FACEBOOK_SCOPES") || "email,public_profile";

      const url = new URL("https://www.facebook.com/v19.0/dialog/oauth");
      url.searchParams.set("client_id", appId);
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", scope.split(",").join(","));
      url.searchParams.set("state", state);

      res.redirect(302, url.toString());
    } catch (error) {
      console.error("oauthStart error:", error);
      redirectToFrontend(res, { error: "oauth_start_failed" });
    }
  };
};

export const oauthCallback = (provider: OAuthProvider) => {
  return async (req: Request, res: Response) => {
    if (provider === "wechat") {
      res.status(501).json({ status: "not_implemented", provider });
      return;
    }

    const error = typeof req.query.error === "string" ? req.query.error : undefined;
    if (error) {
      console.info("auth.oauth.callback", { provider, result: "provider_error", error });
      redirectToFrontend(res, { error });
      return;
    }

    const code = typeof req.query.code === "string" ? req.query.code : undefined;
    const state = typeof req.query.state === "string" ? req.query.state : undefined;

    if (!code || !state) {
      console.info("auth.oauth.callback", { provider, result: "missing_code_or_state" });
      redirectToFrontend(res, { error: "missing_code_or_state" });
      return;
    }

    const stateRecord = consumeState(provider, state);
    if (!stateRecord) {
      console.info("auth.oauth.callback", { provider, result: "invalid_state" });
      redirectToFrontend(res, { error: "invalid_state" });
      return;
    }

    try {
      if (provider === "google") {
        const clientId = getEnv("GOOGLE_CLIENT_ID");
        const clientSecret = getEnv("GOOGLE_CLIENT_SECRET");
        const redirectUri =
          getEnvOptional("GOOGLE_REDIRECT_URI") ||
          "http://localhost:5000/api/auth/google/callback";

        const tokenRes = await axios.post(
          "https://oauth2.googleapis.com/token",
          new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }).toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const idToken =
          typeof tokenRes.data?.id_token === "string" ? tokenRes.data.id_token : null;

        if (!idToken) {
          console.info("auth.oauth.callback", { provider, result: "missing_id_token" });
          redirectToFrontend(res, { error: "missing_id_token" });
          return;
        }

        const tokenInfoRes = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
          params: { id_token: idToken },
        });

        const providerUserId =
          typeof tokenInfoRes.data?.sub === "string" ? tokenInfoRes.data.sub : null;
        const email =
          typeof tokenInfoRes.data?.email === "string" ? tokenInfoRes.data.email : undefined;
        const aud = typeof tokenInfoRes.data?.aud === "string" ? tokenInfoRes.data.aud : null;

        if (!providerUserId || !aud || aud !== clientId) {
          console.info("auth.oauth.callback", { provider, result: "invalid_google_token" });
          redirectToFrontend(res, { error: "invalid_google_token" });
          return;
        }

        if (stateRecord.flow === "link") {
          const userId = stateRecord.userId;
          if (!userId) {
            redirectToLinkedAccounts(res, { provider, error: "missing_user" });
            return;
          }

          const existing = await prisma.userSocialAccount.findFirst({
            where: { provider, providerUserId },
          });
          if (existing && existing.userId !== userId) {
            redirectToLinkedAccounts(res, { provider, error: "already_linked" });
            return;
          }

          if (existing && existing.userId === userId) {
            await prisma.userSocialAccount.update({
              where: { id: existing.id },
              data: { email },
            });
            await prisma.userSocialAccount.deleteMany({
              where: { userId, provider, id: { not: existing.id } },
            });
          } else {
            await prisma.userSocialAccount.deleteMany({
              where: { userId, provider },
            });
            await prisma.userSocialAccount.create({
              data: {
                provider,
                providerUserId,
                email,
                userId,
              },
            });
          }

          console.info("auth.oauth.link", { provider, result: "success", userId });
          redirectToLinkedAccounts(res, { provider, linked: "1" });
          return;
        }

        const user = await linkOrCreateUserForSocial({
          provider: "google",
          providerUserId,
          email,
        });

        console.info("auth.oauth.callback", {
          provider,
          result: "success",
          userId: user.id,
          hasEmail: Boolean(email),
        });
        const token = issueJwt(user.id);
        redirectToFrontend(res, { token });
        return;
      }

      // Facebook
      const appId = getEnv("FACEBOOK_APP_ID");
      const appSecret = getEnv("FACEBOOK_APP_SECRET");
      const redirectUri =
        getEnvOptional("FACEBOOK_REDIRECT_URI") ||
        "http://localhost:5000/api/auth/facebook/callback";

      const accessTokenRes = await axios.get(
        "https://graph.facebook.com/v19.0/oauth/access_token",
        {
          params: {
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
          },
        }
      );

      const accessToken =
        typeof accessTokenRes.data?.access_token === "string"
          ? accessTokenRes.data.access_token
          : null;

      if (!accessToken) {
        console.info("auth.oauth.callback", { provider, result: "missing_facebook_access_token" });
        redirectToFrontend(res, { error: "missing_facebook_access_token" });
        return;
      }

      const meRes = await axios.get("https://graph.facebook.com/me", {
        params: { fields: "id,email", access_token: accessToken },
      });

      const providerUserId = typeof meRes.data?.id === "string" ? meRes.data.id : null;
      const email = typeof meRes.data?.email === "string" ? meRes.data.email : undefined;

      if (!providerUserId) {
        console.info("auth.oauth.callback", { provider, result: "invalid_facebook_profile" });
        redirectToFrontend(res, { error: "invalid_facebook_profile" });
        return;
      }

      if (stateRecord.flow === "link") {
        const userId = stateRecord.userId;
        if (!userId) {
          redirectToLinkedAccounts(res, { provider, error: "missing_user" });
          return;
        }

        const existing = await prisma.userSocialAccount.findFirst({
          where: { provider, providerUserId },
        });
        if (existing && existing.userId !== userId) {
          redirectToLinkedAccounts(res, { provider, error: "already_linked" });
          return;
        }

        if (existing && existing.userId === userId) {
          await prisma.userSocialAccount.update({
            where: { id: existing.id },
            data: { email },
          });
          await prisma.userSocialAccount.deleteMany({
            where: { userId, provider, id: { not: existing.id } },
          });
        } else {
          await prisma.userSocialAccount.deleteMany({
            where: { userId, provider },
          });
          await prisma.userSocialAccount.create({
            data: {
              provider,
              providerUserId,
              email,
              userId,
            },
          });
        }

        console.info("auth.oauth.link", { provider, result: "success", userId });
        redirectToLinkedAccounts(res, { provider, linked: "1" });
        return;
      }

      const user = await linkOrCreateUserForSocial({
        provider: "facebook",
        providerUserId,
        email,
      });

      console.info("auth.oauth.callback", {
        provider,
        result: "success",
        userId: user.id,
        hasEmail: Boolean(email),
      });
      const token = issueJwt(user.id);
      redirectToFrontend(res, { token });
    } catch (error) {
      console.error("oauthCallback error:", error);
      console.info("auth.oauth.callback", { provider, result: "exception" });
      if (stateRecord.flow === "link") {
        redirectToLinkedAccounts(res, { provider, error: "oauth_link_failed" });
      } else {
        redirectToFrontend(res, { error: "oauth_callback_failed" });
      }
    }
  };
};

export const linkedAccounts = async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  const accounts = await prisma.userSocialAccount.findMany({
    where: { userId },
    select: { provider: true },
  });

  const linked = {
    google: accounts.some((a) => a.provider === "google"),
    facebook: accounts.some((a) => a.provider === "facebook"),
    wechat: accounts.some((a) => a.provider === "wechat"),
  };

  res.status(200).json({ status: "ok", linked });
};

export const oauthLinkStart = (provider: Exclude<OAuthProvider, "wechat">) => {
  return (req: Request, res: Response) => {
    const userId = req.auth?.userId;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    try {
      const state = newState(provider, "link", userId);
      console.info("auth.oauth.link.start", { provider, userId });

      if (provider === "google") {
        const clientId = getEnv("GOOGLE_CLIENT_ID");
        const redirectUri =
          getEnvOptional("GOOGLE_REDIRECT_URI") ||
          "http://localhost:5000/api/auth/google/callback";
        const scope = getEnvOptional("GOOGLE_SCOPES") || "openid,email,profile";

        const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", scope.split(",").join(" "));
        url.searchParams.set("state", state);
        url.searchParams.set("access_type", "online");
        url.searchParams.set("include_granted_scopes", "true");

        res.redirect(302, url.toString());
        return;
      }

      const appId = getEnv("FACEBOOK_APP_ID");
      const redirectUri =
        getEnvOptional("FACEBOOK_REDIRECT_URI") ||
        "http://localhost:5000/api/auth/facebook/callback";
      const scope = getEnvOptional("FACEBOOK_SCOPES") || "email,public_profile";

      const url = new URL("https://www.facebook.com/v19.0/dialog/oauth");
      url.searchParams.set("client_id", appId);
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", scope.split(",").join(","));
      url.searchParams.set("state", state);

      res.redirect(302, url.toString());
    } catch (error) {
      console.error("oauthLinkStart error:", error);
      res.status(503).json({ status: "error", message: "Provider unavailable" });
    }
  };
};

export const unlinkProvider = (provider: OAuthProvider) => {
  return async (req: Request, res: Response) => {
    const userId = req.auth?.userId;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    await prisma.userSocialAccount.deleteMany({
      where: { userId, provider },
    });

    res.status(200).json({ status: "ok" });
  };
};

export const wechatDemoLink = async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  if (!WECHAT_DEMO_MODE) {
    res.status(503).json({ status: "error", message: "Provider unavailable" });
    return;
  }

  const provider = "wechat";
  const providerUserId = `demo-${userId}`;

  await prisma.userSocialAccount.deleteMany({
    where: { userId, provider },
  });

  await prisma.userSocialAccount.create({
    data: {
      provider,
      providerUserId,
      userId,
      email: undefined,
    },
  });

  res.status(200).json({ status: "ok" });
};
