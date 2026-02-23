<template>
  <div class="p-6">
    <div class="flex items-start justify-between gap-4">
      <h2 id="add-item-title" class="font-display text-lg font-semibold text-text">
        Add item
      </h2>
      <button
        type="button"
        class="pk-btn-ghost -mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-0"
        aria-label="Close"
        title="Close"
        @click="$emit('close')"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <p class="pk-subtle mt-2">
      Search the catalog, choose a set or part, then add quantity, condition, and location. This flow will be wired to the API next.
    </p>
    <div class="mt-6 flex justify-end gap-2">
      <button type="button" class="pk-btn" title="Cancel" @click="$emit('close')">
        Cancel
      </button>
      <NuxtLink to="/catalog" class="pk-btn-primary" title="Go to catalog to search" @click="$emit('close')">
        Search catalog
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ close: [] }>();
</script>
