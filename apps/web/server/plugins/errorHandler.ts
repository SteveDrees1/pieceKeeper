const logged = new Map<string, { count: number; at: number }>();
const LOG_SUPPRESS_MS = 60_000;

function logKey(path: string, message: string) {
  return `${path}\n${message}`;
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("error", (error, { event }) => {
    const path = event?.path ?? event?.node?.req?.url ?? "";
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "An unexpected error occurred";
    const key = logKey(path, message);
    const now = Date.now();
    const entry = logged.get(key);
    if (entry) {
      entry.count++;
      if (now - entry.at < LOG_SUPPRESS_MS) return;
      console.error("[server error]", path, message, `(repeated ${entry.count} times)`);
      entry.count = 0;
      entry.at = now;
    } else {
      logged.set(key, { count: 1, at: now });
      console.error("[server error]", path, message);
    }
  });
});
