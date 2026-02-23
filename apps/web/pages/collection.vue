<template>
  <section class="space-y-4 sm:space-y-6">
    <div>
      <h1 class="pk-h1">My Collection</h1>
      <p class="pk-subtle">Owned items, quantities, condition, locations, notes.</p>
    </div>

    <div class="pk-card pk-card-pad space-y-4">
      <div class="flex flex-wrap gap-2 sm:gap-2">
        <button type="button" class="pk-btn-primary">Add Item</button>
        <button type="button" class="pk-btn">Import</button>
        <button type="button" class="pk-btn">Export</button>
      </div>
      <p class="pk-subtle">Wire this to Postgres once the API exists.</p>
    </div>
  </section>
</template>
