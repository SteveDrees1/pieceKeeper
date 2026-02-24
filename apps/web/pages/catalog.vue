<template>
  <section class="flex min-h-0 flex-1 flex-col gap-4 sm:gap-6">
    <div class="shrink-0">
      <h1 class="pk-h1">Catalog</h1>
      <p class="pk-subtle">Search sets, parts, and minifigs via Rebrickable.</p>
    </div>

    <div class="shrink-0 pk-card pk-card-pad space-y-2">
      <label for="catalog-search" class="text-sm font-medium text-text">Search</label>
      <input
        id="catalog-search"
        v-model="searchQuery"
        type="search"
        class="pk-input"
        placeholder="10276, Millennium Falcon, minifig..."
        title="Search by set number, name, or minifig"
        autocomplete="off"
        @input="onSearchInput"
      />
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="pk-chip"
          :class="{ 'border-brand-accent bg-brand-accent/10 text-brand-accent': catalogType === 'sets' }"
          title="Search LEGO sets"
          @click="setType('sets')"
        >
          Sets
        </button>
        <button
          type="button"
          class="pk-chip"
          :class="{ 'border-brand-accent bg-brand-accent/10 text-brand-accent': catalogType === 'parts' }"
          title="Search LEGO parts"
          @click="setType('parts')"
        >
          Parts
        </button>
        <button
          type="button"
          class="pk-chip"
          :class="{ 'border-brand-accent bg-brand-accent/10 text-brand-accent': catalogType === 'minifigs' }"
          title="Search minifigs"
          @click="setType('minifigs')"
        >
          Minifigs
        </button>
      </div>
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="flex min-h-0 flex-col pk-card pk-card-pad lg:col-span-2">
        <div class="shrink-0 font-display font-medium text-text mb-1">Results</div>
        <p v-if="!rebrickableConfigured" class="pk-subtle shrink-0">
          Add <code class="rounded bg-border px-1 py-0.5 text-xs">REBRICKABLE_API_KEY</code> to your <code class="rounded bg-border px-1 py-0.5 text-xs">.env</code> and restart. Get a key at
          <a href="https://rebrickable.com/api/v3/docs/" target="_blank" rel="noopener noreferrer" class="text-brand-accent underline">Rebrickable</a>.
        </p>
        <p v-else-if="error" class="shrink-0 text-brand-primary text-sm">{{ error.message }}</p>
        <div v-else-if="pending && results.length === 0" class="pk-subtle shrink-0 py-4">Searching…</div>
        <div v-else-if="results.length === 0" class="pk-subtle shrink-0 py-4">
          {{ searchQuery ? "No results. Try a different search or type." : "Enter a search or browse by type." }}
        </div>
        <ul
          v-else
          class="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto"
          aria-label="Catalog results"
        >
          <li
            v-for="(item, i) in results"
            :key="itemKey(item, i)"
            role="button"
            tabindex="0"
            class="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface/50 p-3 transition hover:border-brand-accent/40 hover:shadow-glow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 focus:ring-offset-bg"
            @click="openPreview(item)"
            @keydown.enter="openPreview(item)"
            @keydown.space.prevent="openPreview(item)"
          >
            <img
              v-if="itemImage(item)"
              :src="itemImage(item)"
              :alt="itemName(item)"
              class="h-14 w-14 shrink-0 rounded object-contain bg-surface"
              loading="lazy"
            />
            <span v-else class="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-border text-muted text-xs">—</span>
            <div class="min-w-0 flex-1">
              <div class="font-medium text-text truncate">{{ itemName(item) }}</div>
              <div class="pk-subtle text-xs">{{ itemId(item) }}</div>
            </div>
          </li>
        </ul>
        <div v-if="results.length > 0" class="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <span class="pk-subtle text-sm">{{ totalCount }} result{{ totalCount !== 1 ? 's' : '' }}</span>
          <nav
            class="flex w-full min-w-0 max-w-sm items-center justify-between gap-1 sm:w-auto sm:max-w-none sm:gap-2"
            aria-label="Pagination"
          >
            <button
              type="button"
              class="pk-btn-ghost inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text disabled:pointer-events-none disabled:opacity-50"
              :disabled="!canFirst"
              :aria-disabled="!canFirst"
              title="First page"
              aria-label="First page"
              @click="firstPage"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              class="pk-btn-ghost inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text disabled:pointer-events-none disabled:opacity-50"
              :disabled="!hasPrev"
              :aria-disabled="!hasPrev"
              title="Previous page"
              aria-label="Previous page"
              @click="prevPage"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="min-w-[5.5rem] shrink-0 text-center text-sm text-text" aria-live="polite">
              <span class="font-medium tabular-nums">{{ page }}</span>
              <span class="text-muted"> of </span>
              <span class="font-medium tabular-nums">{{ totalPages }}</span>
            </span>
            <button
              type="button"
              class="pk-btn-ghost inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text disabled:pointer-events-none disabled:opacity-50"
              :disabled="!hasNext"
              :aria-disabled="!hasNext"
              title="Next page"
              aria-label="Next page"
              @click="nextPage"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              type="button"
              class="pk-btn-ghost inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text disabled:pointer-events-none disabled:opacity-50"
              :disabled="!canLast"
              :aria-disabled="!canLast"
              title="Last page"
              aria-label="Last page"
              @click="lastPage"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </div>

      <div class="pk-card pk-card-pad">
        <div class="font-display font-medium text-text mb-1">Filters</div>
        <p class="pk-subtle">Theme, year, and part count filters can be added later.</p>
      </div>
    </div>

    <LazyCatalogPreviewModal
      v-model="previewOpen"
      :detail-type="previewType"
      :detail-id="previewId"
    />
  </section>
</template>

<script setup lang="ts">
import type { CatalogResult, CatalogType, RebrickableSet, RebrickablePart, RebrickableMinifig } from "~/composables/useCatalogSearch";

const searchQuery = ref("");
const catalogType = ref<CatalogType>("sets");

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    resetPage();
  }, 300);
}

function setType(type: CatalogType) {
  catalogType.value = type;
  resetPage();
}

const {
  results,
  totalCount,
  totalPages,
  pending,
  error,
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
} = useCatalogSearch(searchQuery, catalogType);

const rebrickableConfigured = computed(() => !error.value?.message?.includes("API key not configured"));

const { showToast } = useToaster();
watch(error, (err) => {
  if (err?.message) showToast(err.message, "error");
});

const previewOpen = ref(false);
const previewType = ref<CatalogType | null>(null);
const previewId = ref<string | null>(null);

function openPreview(item: CatalogResult) {
  if ("set_num" in item) {
    previewType.value = catalogType.value === "minifigs" ? "minifigs" : "sets";
    previewId.value = item.set_num;
  } else if ("part_num" in item) {
    previewType.value = "parts";
    previewId.value = item.part_num;
  } else {
    return;
  }
  previewOpen.value = true;
}

function itemKey(item: CatalogResult, i: number) {
  if ("set_num" in item) return `${item.set_num}-${i}`;
  if ("part_num" in item) return `${item.part_num}-${i}`;
  return `item-${i}`;
}

function itemName(item: CatalogResult) {
  return "name" in item ? item.name : "";
}

function itemId(item: CatalogResult) {
  if ("set_num" in item) return item.set_num;
  if ("part_num" in item) return item.part_num;
  return "";
}

function itemImage(item: CatalogResult): string | null | undefined {
  if ("set_img_url" in item) return (item as RebrickableSet | RebrickableMinifig).set_img_url;
  if ("part_img_url" in item) return (item as RebrickablePart).part_img_url;
  return null;
}
</script>
