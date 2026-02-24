<template>
  <div class="p-6">
    <div class="flex items-start justify-between gap-4">
      <h2 id="add-item-title" class="font-display text-lg font-semibold text-text">
        Add to collection
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
      Add a set, part, or minifig by ID. It will be saved to your collection in the database.
    </p>

    <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-1">
        <label for="modal-add-type" class="pk-stat-label">Type</label>
        <select id="modal-add-type" v-model="form.item_type" class="pk-input" required>
          <option value="set">Set</option>
          <option value="part">Part</option>
          <option value="minifig">Minifig</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label for="modal-add-item-id" class="pk-stat-label">Item ID</label>
        <input
          id="modal-add-item-id"
          v-model.trim="form.item_id"
          type="text"
          class="pk-input"
          placeholder="e.g. 10276-1"
          required
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="modal-add-qty" class="pk-stat-label">Qty</label>
        <input
          id="modal-add-qty"
          v-model.number="form.qty"
          type="number"
          min="0"
          class="pk-input w-24"
          required
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="modal-add-condition" class="pk-stat-label">Condition</label>
        <select id="modal-add-condition" v-model="form.condition" class="pk-input">
          <option value="new_sealed">New sealed</option>
          <option value="new_opened">New opened</option>
          <option value="used_good">Used good</option>
          <option value="used_fair">Used fair</option>
          <option value="used_poor">Used poor</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label for="modal-add-location" class="pk-stat-label">Location (optional)</label>
        <input
          id="modal-add-location"
          v-model.trim="form.location"
          type="text"
          class="pk-input"
          placeholder="e.g. Shelf A"
        />
      </div>
      <div class="flex flex-wrap gap-2 pt-2">
        <button type="submit" class="pk-btn-primary" :disabled="sending">
          {{ sending ? "Adding…" : "Add to collection" }}
        </button>
        <button type="button" class="pk-btn" title="Cancel" @click="$emit('close')">
          Cancel
        </button>
        <NuxtLink to="/catalog" class="pk-btn-ghost" title="Search catalog for set/part IDs" @click="$emit('close')">
          Search catalog
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();
const { showToast } = useToaster();

const form = reactive({
  item_type: "set" as "set" | "part" | "minifig",
  item_id: "",
  qty: 1,
  condition: "unknown" as string,
  location: "",
});

const sending = ref(false);

async function onSubmit() {
  if (!form.item_id.trim()) return;
  sending.value = true;
  try {
    await $fetch("/api/collection", {
      method: "POST",
      body: {
        item_type: form.item_type,
        item_id: form.item_id.trim(),
        qty: form.qty,
        condition: form.condition,
        location: form.location.trim() || undefined,
      },
    });
    showToast("Added to collection", "success");
    const { refresh } = useFetch<unknown[]>("/api/collection", { key: "collection" });
    await refresh();
    form.item_id = "";
    form.qty = 1;
    form.location = "";
    emit("close");
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }; message?: string };
    const msg = err?.data?.statusMessage ?? err?.message ?? "Failed to add item";
    showToast(msg, "error");
  } finally {
    sending.value = false;
  }
}
</script>
