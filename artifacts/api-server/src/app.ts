import express, { type Express } from "express";
import cors from "cors";
import { createHash, timingSafeEqual } from "node:crypto";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
app.disable("x-powered-by");

const allowedOrigins = new Set(
  (process.env.TEST_API_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function hasValidTestKey(presented: string): boolean {
  const expected = process.env.TEST_API_KEY ?? "";
  if (!presented || expected.length < 32) return false;
  const digestExpected = createHash("sha256").update(expected).digest();
  const digestPresented = createHash("sha256").update(presented).digest();
  return timingSafeEqual(digestExpected, digestPresented);
}


app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// CORS is opt-in. Browsers can still make same-origin requests normally.
app.use(cors({
  origin: (origin, callback) => callback(null, Boolean(origin && allowedOrigins.has(origin))),
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Test data routes are disabled by default, and require a server-side secret
// when deliberately enabled. The health endpoint stays public.
app.use("/api", (req, res, next) => {
  if ((req.method === "GET" || req.method === "HEAD") && req.path === "/healthz") {
    return next();
  }
  if (!process.env.TEST_API_KEY || process.env.TEST_API_KEY.length < 32) {
    res.status(503).json({ error: "Test API disabled. Set a strong TEST_API_KEY server-side." });
    return;
  }
  if (!hasValidTestKey(req.get("x-test-api-key") ?? "")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
});

app.use("/api", router);

export default app;
