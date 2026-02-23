<template>
  <AppModal
    :model-value="modelValue"
    labelledby="catalog-preview-title"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="catalog-preview">
      <!-- Header: accent bar + type badge + title -->
      <header class="catalog-preview__header">
        <span class="catalog-preview__badge" :data-type="detailType ?? 'none'">
          {{ typeLabel }}
        </span>
        <h2 id="catalog-preview-title" class="catalog-preview__title">
          {{ detailName || title }}
        </h2>
      </header>

      <div class="catalog-preview__body">
        <template v-if="!detailType || !detailId">
          <p class="pk-subtle">Select an item to preview.</p>
        </template>
        <template v-else>
          <!-- Loading: skeleton record -->
          <div v-if="pending" class="catalog-preview__skeleton" aria-busy="true">
            <div class="catalog-preview__skeleton-image" />
            <div class="catalog-preview__skeleton-fields">
              <div class="catalog-preview__skeleton-line w-3/4" />
              <div class="catalog-preview__skeleton-line w-1/2" />
              <div class="catalog-preview__skeleton-line w-2/3" />
            </div>
          </div>

          <p v-else-if="detailError" class="catalog-preview__error">
            {{ detailError.message }}
          </p>

          <template v-else-if="detail">
            <!-- Primary record block: image + key fields -->
            <div class="catalog-preview__record">
              <div class="catalog-preview__media">
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  :alt="detailName"
                  class="catalog-preview__img"
                  loading="lazy"
                />
                <div v-else class="catalog-preview__no-img">No image</div>
              </div>
              <div class="catalog-preview__primary">
                <div v-if="displayId" class="catalog-preview__id">
                  <span class="pk-stat-label">ID</span>
                  <code class="catalog-preview__id-value">{{ displayId }}</code>
                </div>
                <div v-if="detailName" class="catalog-preview__name">
                  <span class="pk-stat-label">Name</span>
                  <span class="catalog-preview__name-value">{{ detailName }}</span>
                </div>
              </div>
            </div>

            <!-- Data grid: type-specific attributes -->
            <div v-if="hasAttributes" class="catalog-preview__grid">
              <template v-if="detailType === 'sets'">
                <div v-if="(detail as SetDetail).year != null" class="catalog-preview__row">
                  <dt class="pk-stat-label">Year</dt>
                  <dd class="catalog-preview__value tabular-nums">{{ (detail as SetDetail).year }}</dd>
                </div>
                <div v-if="(detail as SetDetail).num_parts != null" class="catalog-preview__row">
                  <dt class="pk-stat-label">Parts</dt>
                  <dd class="catalog-preview__value tabular-nums">{{ (detail as SetDetail).num_parts }}</dd>
                </div>
                <div v-if="(detail as SetDetail).theme_id != null" class="catalog-preview__row">
                  <dt class="pk-stat-label">Theme ID</dt>
                  <dd class="catalog-preview__value tabular-nums">{{ (detail as SetDetail).theme_id }}</dd>
                </div>
              </template>
              <template v-else-if="detailType === 'parts'">
                <div v-if="(detail as PartDetail).part_cat_id != null" class="catalog-preview__row">
                  <dt class="pk-stat-label">Category ID</dt>
                  <dd class="catalog-preview__value tabular-nums">{{ (detail as PartDetail).part_cat_id }}</dd>
                </div>
                <div v-if="(detail as PartDetail).part_material != null" class="catalog-preview__row">
                  <dt class="pk-stat-label">Material</dt>
                  <dd class="catalog-preview__value tabular-nums">{{ (detail as PartDetail).part_material }}</dd>
                </div>
              </template>
              <template v-else-if="detailType === 'minifigs'">
                <div v-if="(detail as MinifigDetail).num_parts != null" class="catalog-preview__row">
                  <dt class="pk-stat-label">Parts</dt>
                  <dd class="catalog-preview__value tabular-nums">{{ (detail as MinifigDetail).num_parts }}</dd>
                </div>
              </template>
            </div>

            <p class="catalog-preview__source pk-subtle">Catalog data from Rebrickable</p>
          </template>
        </template>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import type { CatalogType } from "~/composables/useCatalogSearch";

interface SetDetail {
  set_num?: string;
  name?: string;
  year?: number;
  num_parts?: number;
  set_img_url?: string | null;
  theme_id?: number;
}

interface PartDetail {
  part_num?: string;
  name?: string;
  part_img_url?: string | null;
  part_cat_id?: number;
  part_material?: number;
}

interface MinifigDetail {
  set_num?: string;
  name?: string;
  num_parts?: number;
  set_img_url?: string | null;
}

type DetailRecord = SetDetail | PartDetail | MinifigDetail;

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    detailType: CatalogType | null;
    detailId: string | null;
  }>(),
  { detailType: null, detailId: null }
);

defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const detail = ref<DetailRecord | null>(null);
const pending = ref(false);
const detailError = ref<{ message?: string } | null>(null);

watch(
  () => [props.detailType, props.detailId] as const,
  async ([type, id]: [CatalogType | null, string | null]) => {
    if (!type || !id) {
      detail.value = null;
      detailError.value = null;
      return;
    }
    pending.value = true;
    detailError.value = null;
    try {
      detail.value = (await $fetch<DetailRecord>(
        `/api/catalog/${type}/${encodeURIComponent(id)}`
      )) as DetailRecord;
    } catch (e) {
      detailError.value = e as { message?: string };
      detail.value = null;
    } finally {
      pending.value = false;
    }
  },
  { immediate: true }
);

const title = computed(() => {
  if (!props.detailType) return "Catalog preview";
  const t = props.detailType;
  return t === "sets" ? "Set" : t === "parts" ? "Part" : "Minifig";
});

const typeLabel = computed(() => {
  if (!props.detailType) return "Record";
  const t = props.detailType;
  return t === "sets" ? "Set" : t === "parts" ? "Part" : "Minifig";
});

const detailName = computed(() => {
  const d = detail.value;
  return d && typeof d === "object" && "name" in d ? String((d as { name?: string }).name ?? "") : "";
});

const displayId = computed(() => {
  const d = detail.value;
  if (!d || typeof d !== "object") return "";
  if ("set_num" in d) return (d as SetDetail).set_num ?? "";
  if ("part_num" in d) return (d as PartDetail).part_num ?? "";
  return "";
});

const imageUrl = computed(() => {
  const d = detail.value;
  if (!d || typeof d !== "object") return null;
  if ("set_img_url" in d) return (d as SetDetail | MinifigDetail).set_img_url ?? null;
  if ("part_img_url" in d) return (d as PartDetail).part_img_url ?? null;
  return null;
});

const hasAttributes = computed(() => {
  const d = detail.value;
  if (!d || !props.detailType) return false;
  if (props.detailType === "sets") return (d as SetDetail).year != null || (d as SetDetail).num_parts != null || (d as SetDetail).theme_id != null;
  if (props.detailType === "parts") return (d as PartDetail).part_cat_id != null || (d as PartDetail).part_material != null;
  if (props.detailType === "minifigs") return (d as MinifigDetail).num_parts != null;
  return false;
});
</script>

<style scoped>
.catalog-preview {
  --preview-accent: rgb(var(--brand-accent));
  --preview-border: rgb(var(--border));
  --preview-muted: rgb(var(--muted));
  --preview-surface: rgb(var(--surface));
  --preview-bg: rgb(var(--bg));
}

/* Header: accent strip + badge + title */
.catalog-preview__header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--preview-border);
  background: linear-gradient(180deg, rgb(var(--bg) / 0.5) 0%, var(--preview-surface) 100%);
  border-radius: 1rem 1rem 0 0;
}

.catalog-preview__header::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--preview-accent);
  border-radius: 1rem 0 0 0;
}

.catalog-preview__badge {
  flex-shrink: 0;
  font-family: "Space Grotesk", Inter, system-ui, sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--preview-border);
  background: var(--preview-surface);
  color: var(--preview-muted);
}

.catalog-preview__badge[data-type="sets"] {
  color: var(--preview-accent);
  border-color: rgb(var(--brand-accent) / 0.4);
  background: rgb(var(--brand-accent) / 0.08);
}

.catalog-preview__badge[data-type="parts"] {
  color: rgb(var(--brand-primary));
  border-color: rgb(var(--brand-primary) / 0.35);
  background: rgb(var(--brand-primary) / 0.06);
}

.catalog-preview__badge[data-type="minifigs"] {
  color: rgb(34 197 94);
  border-color: rgb(34 197 94 / 0.4);
  background: rgb(34 197 94 / 0.08);
}

.catalog-preview__title {
  font-family: "Space Grotesk", Inter, system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--text));
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 640px) {
  .catalog-preview__title {
    font-size: 1.125rem;
  }
}

/* Body */
.catalog-preview__body {
  padding: 1.25rem 1.25rem 1.5rem;
}

/* Skeleton */
.catalog-preview__skeleton {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.catalog-preview__skeleton-image {
  width: 7rem;
  height: 7rem;
  flex-shrink: 0;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, var(--preview-bg) 25%, rgb(var(--border) / 0.6) 50%, var(--preview-bg) 75%);
  background-size: 200% 100%;
  animation: catalog-preview-shimmer 1.2s ease-in-out infinite;
}

.catalog-preview__skeleton-fields {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.catalog-preview__skeleton-line {
  height: 0.875rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, var(--preview-bg) 25%, rgb(var(--border) / 0.6) 50%, var(--preview-bg) 75%);
  background-size: 200% 100%;
  animation: catalog-preview-shimmer 1.2s ease-in-out infinite;
}

.catalog-preview__skeleton-line:nth-child(2) {
  animation-delay: 0.15s;
}

.catalog-preview__skeleton-line:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes catalog-preview-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Error */
.catalog-preview__error {
  font-size: 0.875rem;
  color: rgb(var(--brand-primary));
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--brand-primary) / 0.25);
  background: rgb(var(--brand-primary) / 0.06);
}

/* Record block: image + primary fields */
.catalog-preview__record {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--preview-border);
  margin-bottom: 1.25rem;
}

.catalog-preview__media {
  flex-shrink: 0;
  width: 7rem;
  height: 7rem;
  border-radius: 0.75rem;
  border: 1px solid var(--preview-border);
  background: var(--preview-bg);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

@media (min-width: 640px) {
  .catalog-preview__media {
    width: 8.5rem;
    height: 8.5rem;
  }
}

.catalog-preview__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.catalog-preview__no-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--preview-muted);
}

.catalog-preview__primary {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.catalog-preview__id,
.catalog-preview__name {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.catalog-preview__id-value {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(var(--text));
  background: rgb(var(--bg) / 0.8);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--preview-border);
  width: fit-content;
}

.catalog-preview__name-value {
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgb(var(--text));
}

/* Data grid */
.catalog-preview__grid {
  display: grid;
  gap: 0;
  border-radius: 0.75rem;
  border: 1px solid var(--preview-border);
  background: rgb(var(--bg) / 0.4);
  overflow: hidden;
}

.catalog-preview__row {
  display: grid;
  grid-template-columns: 8rem 1fr;
  align-items: baseline;
  gap: 1rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--preview-border);
}

.catalog-preview__row:last-child {
  border-bottom: none;
}

.catalog-preview__row dt {
  margin: 0;
  font-size: 0.6875rem;
}

.catalog-preview__row dd {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--text));
}

.catalog-preview__value {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}

.catalog-preview__source {
  margin: 0.75rem 0 0;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
