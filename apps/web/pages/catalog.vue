<template>
  <section class="space-y-4 sm:space-y-6">
    <div>
      <h1 class="pk-h1">Catalog</h1>
      <p class="pk-subtle">Search sets, parts, and minifigs.</p>
    </div>

    <div class="pk-card pk-card-pad space-y-2">
      <label class="text-sm font-medium text-text">Search</label>
      <input class="pk-input" placeholder="10276, Millennium Falcon, minifig..." />
      <div class="flex flex-wrap gap-2">
        <span class="pk-chip">Sets</span>
        <span class="pk-chip">Parts</span>
        <span class="pk-chip">Minifigs</span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="pk-card pk-card-pad lg:col-span-2">
        <div class="font-display font-medium text-text mb-1">Results</div>
        <p class="pk-subtle">Wire to search API later.</p>
      </div>

      <div class="pk-card pk-card-pad">
        <div class="font-display font-medium text-text mb-1">Filters</div>
        <p class="pk-subtle">Theme, year, type.</p>
      </div>
    </div>
  </section>
</template>