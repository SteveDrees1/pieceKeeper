const endpoints = [
  { name: "Postgres", type: "tcp", port: 5432 },
  { name: "Redis", type: "tcp", port: 6379 },
  { name: "Meilisearch", type: "http", url: "http://localhost:7700/health" },
  { name: "MinIO", type: "http", url: "http://localhost:9000/minio/health/live" },
];

const net = await import("node:net");

async function checkTcp(name, port) {
  return new Promise((resolve) => {
    const s = net.createConnection({ host: "localhost", port }, () => {
      s.end(); resolve({ name, ok: true });
    });
    s.on("error", () => resolve({ name, ok: false }));
    s.setTimeout(1500, () => { s.destroy(); resolve({ name, ok: false }); });
  });
}

async function checkHttp(name, url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return { name, ok: res.ok };
  } catch {
    return { name, ok: false };
  }
}

const results = [];
for (const e of endpoints) {
  if (e.type === "tcp") results.push(await checkTcp(e.name, e.port));
  else results.push(await checkHttp(e.name, e.url));
}

const pad = (s, n) => (s + " ".repeat(n)).slice(0, n);
for (const r of results) console.log(`${pad(r.name, 12)} ${r.ok ? "OK" : "FAIL"}`);
process.exit(results.every(r => r.ok) ? 0 : 1);
