<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-y-auto space-y-4 sm:space-y-6">
    <div>
      <h1 class="pk-h1">My Collection</h1>
      <p class="pk-subtle">Owned items, quantities, condition, locations, notes.</p>
    </div>

    <div class="pk-card pk-card-pad space-y-4">
      <div class="flex flex-wrap gap-2 sm:gap-2">
        <button type="button" class="pk-btn-primary" title="Add a new item to your collection" @click="openAddItem">Add Item</button>
        <button type="button" class="pk-btn" title="Import items from file or external source" @click="openImport">Import</button>
        <button type="button" class="pk-btn" title="Export your collection" @click="openExport">Export</button>
      </div>
      <p class="pk-subtle">Wire this to Postgres once the API exists.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { openAddItem, openImport, openExport } = useActionModals();
</script>
