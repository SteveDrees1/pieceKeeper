const REBRICKABLE_BASE = "https://rebrickable.com/api/v3/lego";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const key = config.rebrickableApiKey;
  if (!key) {
    throw createError({ statusCode: 502, statusMessage: "Rebrickable API key not configured" });
  }

  const setNum = getRouterParam(event, "set_num");
  if (!setNum) {
    throw createError({ statusCode: 400, statusMessage: "Missing set_num" });
  }

  const url = `${REBRICKABLE_BASE}/sets/${encodeURIComponent(setNum)}/?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) {
    if (res.status === 404) {
      throw createError({ statusCode: 404, statusMessage: "Set not found" });
    }
    const text = await res.text();
    if (res.status === 429) {
      throw createError({ statusCode: 429, statusMessage: "Rate limited; try again in a moment." });
    }
    throw createError({ statusCode: res.status, statusMessage: text || res.statusText });
  }

  const data = (await res.json()) as Record<string, unknown>;
  setResponseHeaders(event, {
    "Cache-Control": "public, max-age=300, stale-while-revalidate=600"
  });
  return data;
});
