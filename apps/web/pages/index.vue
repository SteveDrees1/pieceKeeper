<template>
  <section class="space-y-6 sm:space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="pk-h1">Dashboard</h1>
          <span class="pk-chip text-[10px] font-medium uppercase tracking-wider">Live</span>
        </div>
        <p class="pk-subtle mt-1">Collection totals, recent adds, alerts. Keep it fast.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      <div class="pk-panel pk-panel-accent pk-card-pad">
        <div class="pk-stat-label">Sets</div>
        <div class="pk-stat-value mt-1">—</div>
        <p class="pk-subtle mt-1">Total in collection</p>
      </div>
      <div class="pk-panel pk-panel-accent pk-card-pad">
        <div class="pk-stat-label">Parts</div>
        <div class="pk-stat-value mt-1">—</div>
        <p class="pk-subtle mt-1">Unique part count</p>
      </div>
      <div class="pk-panel pk-panel-accent pk-card-pad">
        <div class="pk-stat-label">Minifigs</div>
        <div class="pk-stat-value mt-1">—</div>
        <p class="pk-subtle mt-1">Figures tracked</p>
      </div>
      <div class="pk-panel pk-panel-accent pk-card-pad">
        <div class="pk-stat-label">Est. value</div>
        <div class="pk-stat-value mt-1">—</div>
        <p class="pk-subtle mt-1">Market reference</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      <div class="pk-panel pk-card-pad lg:col-span-2">
        <h2 class="font-display text-sm font-semibold uppercase tracking-wider text-text">Recent activity</h2>
        <p class="pk-subtle mt-2">No recent activity. Add items or import to see updates here.</p>
        <ul class="mt-4 space-y-2" aria-label="Recent activity list">
          <li class="flex items-center gap-3 rounded-lg border border-border bg-bg/50 px-3 py-2 text-sm">
            <span class="h-2 w-2 rounded-full bg-muted" aria-hidden="true" />
            <span class="text-muted">Activity feed will appear here</span>
          </li>
        </ul>
      </div>
      <div class="pk-panel pk-card-pad">
        <h2 class="font-display text-sm font-semibold uppercase tracking-wider text-text">Quick actions</h2>
        <div class="mt-4 flex flex-col gap-2">
          <NuxtLink to="/catalog" class="pk-btn w-full justify-center" title="Search sets, parts, and minifigs">Search catalog</NuxtLink>
          <button type="button" class="pk-btn-primary w-full justify-center" title="Add a new item to your collection" @click="openAddItem">Add item</button>
          <button type="button" class="pk-btn-ghost w-full justify-center" title="Import items from a file" @click="openImport">Import from file</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { openAddItem, openImport } = useActionModals();
</script>
