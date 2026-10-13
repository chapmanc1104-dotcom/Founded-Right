import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";
import { securityHeaders } from "./middlewares/securityHeaders";

const app: Express = express();

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
const ALLOWED_ORIGIN = /^https:\/\/(([a-z0-9-]+\.)*foundedright\.co|[a-z0-9-]+(\.[a-z0-9-]+)*\.replit\.(app|dev))$|^http:\/\/localhost(:\d+)?$/i;
app.disable("x-powered-by");
app.use(securityHeaders);
// Auth is a Bearer token, so credentialed cross-origin cookies are not needed.
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || ALLOWED_ORIGIN.test(origin)),
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

export default app;
