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
  const colorId = query.color_id != null && query.color_id !== "" ? String(query.color_id) : null;
  if (colorId) params.set("color_id", colorId);
  const partCatId = query.part_cat_id != null && query.part_cat_id !== "" ? String(query.part_cat_id) : null;
  if (partCatId) params.set("part_cat_id", partCatId);

  const url = `${REBRICKABLE_BASE}/parts/?${params.toString()}`;
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
