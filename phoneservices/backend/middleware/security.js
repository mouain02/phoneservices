const buildCsp = ({ allowedOrigins = [] }) => {
  const connectSrc = ["'self'", ...allowedOrigins].join(" ");
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `connect-src ${connectSrc}`,
  ].join("; ");
};

export const securityHeadersMiddleware = ({ isProduction, allowedOrigins = [] }) => {
  const csp = buildCsp({ allowedOrigins });

  return (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Content-Security-Policy", csp);

    if (isProduction) {
      // 6 months + includeSubDomains + preload
      res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains; preload");
    }

    next();
  };
};

export const createApiRateLimiter = ({
  windowMs = 60_000,
  max = 300,
  skip = () => false,
} = {}) => {
  const requestLog = new Map();

  const cleanupOldEntries = (now) => {
    for (const [key, entry] of requestLog.entries()) {
      if (entry.resetAt <= now) {
        requestLog.delete(key);
      }
    }
  };

  return (req, res, next) => {
    if (skip(req)) return next();

    const now = Date.now();
    cleanupOldEntries(now);

    const key = req.ip || req.socket.remoteAddress || "unknown";
    const current = requestLog.get(key);

    if (!current || current.resetAt <= now) {
      requestLog.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSeconds));
      res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
      return;
    }

    current.count += 1;
    requestLog.set(key, current);
    next();
  };
};