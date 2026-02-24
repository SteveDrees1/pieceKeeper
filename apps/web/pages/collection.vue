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

      <!-- Inline Add Item form (hidden when DB not configured) -->
      <form
        v-show="!configError"
        class="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface-elevated/50 p-4"
        @submit.prevent="onAddSubmit"
      >
        <h2 class="w-full text-sm font-semibold text-text">Add item</h2>
        <div class="flex flex-col gap-1">
          <label for="add-type" class="pk-stat-label">Type</label>
          <select id="add-type" v-model="addForm.item_type" class="pk-input w-28" required>
            <option value="set">Set</option>
            <option value="part">Part</option>
            <option value="minifig">Minifig</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label for="add-item-id" class="pk-stat-label">Item ID</label>
          <input id="add-item-id" v-model.trim="addForm.item_id" type="text" class="pk-input w-36" placeholder="e.g. 10276-1" required />
        </div>
        <div class="flex flex-col gap-1">
          <label for="add-qty" class="pk-stat-label">Qty</label>
          <input id="add-qty" v-model.number="addForm.qty" type="number" min="0" class="pk-input w-20" required />
        </div>
        <div class="flex flex-col gap-1">
          <label for="add-condition" class="pk-stat-label">Condition</label>
          <select id="add-condition" v-model="addForm.condition" class="pk-input w-36">
            <option value="new_sealed">New sealed</option>
            <option value="new_opened">New opened</option>
            <option value="used_good">Used good</option>
            <option value="used_fair">Used fair</option>
            <option value="used_poor">Used poor</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label for="add-location" class="pk-stat-label">Location</label>
          <input id="add-location" v-model.trim="addForm.location" type="text" class="pk-input w-40" placeholder="e.g. Shelf A" />
        </div>
        <button type="submit" class="pk-btn-primary" :disabled="addSending">
          {{ addSending ? "Adding…" : "Add" }}
        </button>
      </form>

      <!-- Setup hint when DB or dev user not configured -->
      <div
        v-if="!loading && configError"
        class="pk-alert-warning rounded-lg border p-4 text-sm"
        role="alert"
      >
        <p class="font-medium">Inventory needs setup</p>
        <p class="mt-1 opacity-90">
          Set <code class="rounded bg-surface px-1 py-0.5">DEV_USER_EMAIL</code> and <code class="rounded bg-surface px-1 py-0.5">DATABASE_URL</code> in your <code class="rounded bg-surface px-1 py-0.5">.env</code>, and ensure Postgres is running (e.g. <code class="rounded bg-surface px-1 py-0.5">docker-compose up -d</code>). See <code class="rounded bg-surface px-1 py-0.5">.env.example</code> and <code class="rounded bg-surface px-1 py-0.5">docs/infra/local-dev.md</code>.
        </p>
      </div>

      <!-- Collection list -->
      <div class="space-y-2">
        <p v-if="loading" class="pk-subtle">Loading…</p>
        <p v-else-if="error && !configError" class="pk-alert-error text-sm">{{ error }}</p>
        <p v-else-if="items.length === 0 && !configError" class="pk-subtle">No items yet. Add one above.</p>
        <div v-else-if="items.length > 0" class="overflow-x-auto">
          <table class="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-border text-muted">
                <th scope="col" class="py-2 pr-4 font-medium">Type</th>
                <th scope="col" class="py-2 pr-4 font-medium">Item ID</th>
                <th scope="col" class="py-2 pr-4 font-medium">Qty</th>
                <th scope="col" class="py-2 pr-4 font-medium">Condition</th>
                <th scope="col" class="py-2 font-medium">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in items" :key="row.id" class="border-b border-border text-text">
                <td class="py-2 pr-4">{{ row.itemType }}</td>
                <td class="py-2 pr-4">{{ row.itemId }}</td>
                <td class="py-2 pr-4">{{ row.qty }}</td>
                <td class="py-2 pr-4">{{ row.condition }}</td>
                <td class="py-2">{{ row.location ?? "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { openAddItem, openImport, openExport } = useActionModals();
const { showToast } = useToaster();

interface CollectionItem {
  id: string;
  itemType: string;
  itemId: string;
  qty: number;
  condition: string;
  location: string | null;
}

const { data, pending: loading, error: fetchError, refresh } = useFetch<CollectionItem[]>("/api/collection", {
  key: "collection",
  default: () => [],
  retry: 0,
  dedupe: "defer",
});

const items = computed(() => data.value ?? []);

function getErrorMessage(e: unknown): string {
  if (!e || typeof e !== "object") return "Failed to load collection";
  const d = (e as { data?: unknown; message?: string }).data;
  const statusMsg = d && typeof d === "object" && "statusMessage" in d ? (d as { statusMessage?: string }).statusMessage : undefined;
  const msg = (e as { message?: string }).message;
  return statusMsg ?? (typeof d === "string" ? d : msg ?? "Failed to load collection");
}

const error = computed(() => {
  const e = addError.value ?? fetchError.value;
  if (!e) return null;
  return getErrorMessage(e);
});

const configError = computed(() => {
  const msg = error.value ?? "";
  return (
    /DEV_USER_EMAIL|DATABASE_URL|not set|missing|required for dev auth/i.test(msg) ||
    /database unavailable|connection refused/i.test(msg)
  );
});

watch(
  fetchError,
  (e) => {
    if (e) showToast(getErrorMessage(e), "error");
  },
  { immediate: true }
);

const addSending = ref(false);
const addError = ref<{ data?: unknown; message?: string } | null>(null);

const addForm = reactive({
  item_type: "set" as "set" | "part" | "minifig",
  item_id: "",
  qty: 1,
  condition: "unknown" as string,
  location: "",
});

async function onAddSubmit() {
  if (!addForm.item_id.trim()) return;
  addSending.value = true;
  addError.value = null;
  try {
    await $fetch("/api/collection", {
      method: "POST",
      body: {
        item_type: addForm.item_type,
        item_id: addForm.item_id.trim(),
        qty: addForm.qty,
        condition: addForm.condition,
        location: addForm.location.trim() || undefined,
      },
    });
    addForm.item_id = "";
    addForm.qty = 1;
    addForm.location = "";
    showToast("Added to collection", "success");
    await refresh();
  } catch (e: unknown) {
    const err = e as { data?: unknown; message?: string };
    const message =
      typeof err?.data === "string" ? err.data : err?.message ?? "Failed to add item";
    addError.value = err?.data != null ? { data: err.data } : { message };
    showToast(message, "error");
  } finally {
    addSending.value = false;
  }
}
</script>
