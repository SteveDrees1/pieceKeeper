export type CatalogType = "sets" | "parts" | "minifigs";

export interface RebrickableSet {
  set_num: string;
  name: string;
  year?: number;
  num_parts?: number;
  set_img_url?: string | null;
  theme_id?: number;
}

export interface RebrickablePart {
  part_num: string;
  name: string;
  part_img_url?: string | null;
  part_cat_id?: number;
}

export interface RebrickableMinifig {
  set_num: string;
  name: string;
  num_parts?: number;
  set_img_url?: string | null;
}

export type CatalogResult = RebrickableSet | RebrickablePart | RebrickableMinifig;

export interface CatalogResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: CatalogResult[];
}

export function useCatalogSearch(searchQuery: Ref<string>, catalogType: Ref<CatalogType>) {
  const page = ref(1);
  const pageSize = 20;

  const { data, pending, error, refresh } = useFetch<CatalogResponse>(
    () => `/api/catalog/${catalogType.value}`,
    {
      query: {
        search: searchQuery,
        page,
        page_size: pageSize,
      },
      watch: [searchQuery, catalogType, page],
      immediate: true,
    }
  );

  const results = computed(() => data.value?.results ?? []);
  const totalCount = computed(() => data.value?.count ?? 0);
  const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)));
  const hasNext = computed(() => Boolean(data.value?.next));
  const hasPrev = computed(() => Boolean(data.value?.previous));

  function nextPage() {
    if (hasNext.value) page.value += 1;
  }

  function prevPage() {
    if (hasPrev.value) page.value = Math.max(1, page.value - 1);
  }

  function firstPage() {
    page.value = 1;
  }

  function lastPage() {
    page.value = totalPages.value;
  }

  function resetPage() {
    page.value = 1;
  }

  const canFirst = computed(() => page.value > 1);
  const canLast = computed(() => page.value < totalPages.value);

  return {
    results,
    totalCount,
    totalPages,
    pending,
    error,
    refresh,
    page,
    hasNext,
    hasPrev,
    canFirst,
    canLast,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    resetPage,
  };
}
