const REBRICKABLE_BASE = "https://rebrickable.com/api/v3/lego";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const key = config.rebrickableApiKey;
  if (!key) {
    throw createError({ statusCode: 502, statusMessage: "Rebrickable API key not configured" });
  }

  const query = getQuery(event);
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(1000, Math.max(1, Number(query.page_size) || 500));

  const params = new URLSearchParams({
    key,
    page: String(page),
    page_size: String(pageSize),
  });

  const url = `${REBRICKABLE_BASE}/themes/?${params.toString()}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) {
      throw createError({ statusCode: 429, statusMessage: "Rate limited; try again in a moment." });
    }
    throw createError({ statusCode: res.status, statusMessage: text || res.statusText });
  }

  const data = (await res.json()) as { results?: unknown[]; count?: number; next?: string; previous?: string };
  setResponseHeaders(event, {
    "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
  });
  return data;
});
