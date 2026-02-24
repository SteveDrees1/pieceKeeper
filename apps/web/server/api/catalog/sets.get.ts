const REBRICKABLE_BASE = "https://rebrickable.com/api/v3/lego";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const key = config.rebrickableApiKey;
  if (!key) {
    throw createError({ statusCode: 502, statusMessage: "Rebrickable API key not configured" });
  }

  const query = getQuery(event);
  const search = (query.search as string)?.trim() || "";
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(query.page_size) || 20));

  const params = new URLSearchParams({
    key,
    page: String(page),
    page_size: String(pageSize),
  });
  if (search) params.set("search", search);
  const themeId = query.theme_id != null && query.theme_id !== "" ? String(query.theme_id) : null;
  if (themeId) params.set("theme_id", themeId);
  const minYear = query.min_year != null && query.min_year !== "" ? Number(query.min_year) : NaN;
  if (!Number.isNaN(minYear)) params.set("min_year", String(minYear));
  const maxYear = query.max_year != null && query.max_year !== "" ? Number(query.max_year) : NaN;
  if (!Number.isNaN(maxYear)) params.set("max_year", String(maxYear));
  const minParts = query.min_parts != null && query.min_parts !== "" ? Number(query.min_parts) : NaN;
  if (!Number.isNaN(minParts)) params.set("min_parts", String(minParts));
  const maxParts = query.max_parts != null && query.max_parts !== "" ? Number(query.max_parts) : NaN;
  if (!Number.isNaN(maxParts)) params.set("max_parts", String(maxParts));

  const url = `${REBRICKABLE_BASE}/sets/?${params.toString()}`;
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
    "Cache-Control": "public, max-age=60, stale-while-revalidate=120"
  });
  return data;
});
