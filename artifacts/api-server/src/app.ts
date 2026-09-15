import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";

const app: Express = express();

// Replit terminates TLS ahead of us, so req.ip must come from X-Forwarded-For
// for rate limiting to key on the real client rather than the proxy.
app.set("trust proxy", 1);

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
// Browser callers are restricted to our own origins. ALLOWED_ORIGINS is a
// comma-separated list; in development we fall back to reflecting the origin
// so local Vite ports keep working.
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // Same-origin and non-browser clients (curl, health checks) send no Origin.
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        if (process.env.NODE_ENV !== "production") return callback(null, true);
        logger.warn("ALLOWED_ORIGINS is not set; rejecting cross-origin request");
        return callback(null, false);
      }
      return callback(null, allowedOrigins.includes(origin));
    },
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

export default app;
