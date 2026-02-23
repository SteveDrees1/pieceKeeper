<template>
  <div class="flex h-screen flex-col overflow-hidden bg-bg font-sans antialiased">
    <header class="shrink-0 border-b border-border bg-surface/98 shadow-soft backdrop-blur-md safe-area-pad-x z-50" style="box-shadow: 0 1px 0 0 rgba(96, 165, 250, 0.08);">
      <div class="pk-container flex flex-wrap items-center justify-between gap-3 py-3 sm:gap-4 sm:py-3">
        <div class="flex min-w-0 flex-1 items-center gap-3 sm:flex-initial">
          <NuxtLink to="/" class="flex items-center gap-3" title="Go to Dashboard">
            <LogoMark />
            <div class="min-w-0">
              <span class="font-display text-base font-semibold tracking-tight text-text sm:text-lg">{{ appName }}</span>
              <p class="pk-subtle mt-0.5 hidden tracking-wide sm:block">Track. Value. Trade.</p>
            </div>
          </NuxtLink>
        </div>

        <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
          <NuxtLink to="/" class="pk-nav-pill" title="View dashboard and quick actions">Dashboard</NuxtLink>
          <NuxtLink to="/catalog" class="pk-nav-pill" title="Search sets, parts, and minifigs">Catalog</NuxtLink>
          <NuxtLink to="/collection" class="pk-nav-pill" title="View and manage your collection">My Collection</NuxtLink>
          <NuxtLink to="/lists" class="pk-nav-pill" title="Wanted list, trade pile, build queue">Lists</NuxtLink>
        </nav>

        <div class="flex flex-shrink-0 items-center gap-2">
          <div class="hidden md:flex md:items-center md:gap-2">
            <button type="button" class="pk-btn-ghost" title="Import items from file or external source" @click="openImport">Import</button>
            <button type="button" class="pk-btn-primary" title="Add a new item to your collection" @click="openAddItem">Add Item</button>
          </div>
          <button
            type="button"
            class="pk-btn-ghost -mr-2 flex h-10 w-10 items-center justify-center rounded-lg p-0 md:hidden"
            aria-label="Open menu"
            title="Open main menu"
            :aria-expanded="mobileMenuOpen"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        aria-hidden="true"
        @click="mobileMenuOpen = false"
      />
      <aside
        v-if="mobileMenuOpen"
        class="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface shadow-elevated safe-area-pad-r md:hidden"
        style="box-shadow: -4px 0 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(96, 165, 250, 0.06);"
        role="dialog"
        aria-label="Main menu"
      >
        <div class="flex items-center justify-between border-b border-border p-4">
          <span class="font-display font-semibold text-text">Menu</span>
          <button
            type="button"
            class="pk-btn-ghost -mr-2 flex h-10 w-10 items-center justify-center rounded-lg p-0"
            aria-label="Close menu"
            title="Close menu"
            @click="mobileMenuOpen = false"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="flex flex-1 flex-col gap-1 overflow-auto p-4" aria-label="Main">
          <NuxtLink to="/" class="pk-nav-pill pk-nav-pill-mobile" title="View dashboard" @click="mobileMenuOpen = false">Dashboard</NuxtLink>
          <NuxtLink to="/catalog" class="pk-nav-pill pk-nav-pill-mobile" title="Search catalog" @click="mobileMenuOpen = false">Catalog</NuxtLink>
          <NuxtLink to="/collection" class="pk-nav-pill pk-nav-pill-mobile" title="My collection" @click="mobileMenuOpen = false">My Collection</NuxtLink>
          <NuxtLink to="/lists" class="pk-nav-pill pk-nav-pill-mobile" title="Lists" @click="mobileMenuOpen = false">Lists</NuxtLink>
        </nav>
        <div class="border-t border-border p-4">
          <div class="flex flex-col gap-2">
            <button type="button" class="pk-btn w-full justify-center" title="Import from file" @click="openImport(); mobileMenuOpen = false">Import</button>
            <button type="button" class="pk-btn-primary w-full justify-center" title="Add item to collection" @click="openAddItem(); mobileMenuOpen = false">Add Item</button>
          </div>
        </div>
      </aside>
    </header>

    <main class="relative flex min-h-0 flex-1 flex-col overflow-hidden pk-container safe-area-pad-x py-6 sm:py-8">
      <Transition name="route-loading">
        <div
          v-if="isRouteChanging"
          class="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-bg/80 backdrop-blur-sm"
          aria-live="polite"
          aria-busy="true"
          role="status"
        >
          <span class="pk-spinner" aria-hidden="true" />
          <span class="sr-only">Loading page…</span>
        </div>
      </Transition>
      <ClientOnly>
        <div class="flex min-h-full min-w-0 flex-1 flex-col">
          <NuxtPage :key="route.fullPath" />
        </div>
        <template #fallback>
          <div class="animate-pulse space-y-6" role="status" aria-label="Loading">
            <div class="h-8 w-48 rounded bg-border" />
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <div class="h-24 rounded-xl bg-border" />
              <div class="h-24 rounded-xl bg-border" />
              <div class="h-24 rounded-xl bg-border" />
              <div class="h-24 rounded-xl bg-border" />
            </div>
          </div>
        </template>
      </ClientOnly>
    </main>

    <footer class="shrink-0 border-t border-border bg-surface safe-area-pad-x" role="contentinfo" style="box-shadow: 0 -1px 0 0 rgba(96, 165, 250, 0.06);">
      <div class="pk-container py-4 sm:py-5">
        <div class="flex flex-nowrap items-center justify-between gap-4 text-sm">
          <div class="flex min-w-0 shrink items-center gap-4">
            <p class="pk-subtle shrink-0 whitespace-nowrap text-xs sm:text-sm">
              © {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.
            </p>
            <nav class="flex shrink-0 items-center gap-3 text-xs sm:text-sm" aria-label="Footer">
              <NuxtLink to="/privacy" class="pk-subtle hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded px-1 py-0.5 transition whitespace-nowrap" title="Privacy policy">
                Privacy
              </NuxtLink>
              <NuxtLink to="/terms" class="pk-subtle hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded px-1 py-0.5 transition whitespace-nowrap" title="Terms of use">
                Terms
              </NuxtLink>
            </nav>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span class="pk-subtle whitespace-nowrap text-xs font-medium uppercase tracking-wider">Follow us</span>
            <div class="flex items-center gap-0.5" aria-label="Social links">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label="Twitter (opens in new window)"
                title="Follow us on Twitter"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label="GitHub (opens in new window)"
                title="View our GitHub"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label="Instagram (opens in new window)"
                title="Follow us on Instagram"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.682.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <AppModal v-model="addItemOpen" labelledby="add-item-title">
      <AddItemModalContent @close="closeAddItem" />
    </AppModal>
    <AppModal v-model="importOpen" labelledby="import-title">
      <ImportModalContent @close="closeImport" />
    </AppModal>
    <AppModal v-model="exportOpen" labelledby="export-title">
      <ExportModalContent @close="closeExport" />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
const appName = useRuntimeConfig().public.appName;
const route = useRoute();
const router = useRouter();
const mobileMenuOpen = ref(false);
const isRouteChanging = ref(false);
const { addItemOpen, importOpen, exportOpen, openAddItem, openImport, openExport, closeAddItem, closeImport, closeExport } = useActionModals();

router.beforeEach((_to, from) => {
  if (from.matched.length > 0) isRouteChanging.value = true;
});

router.afterEach(() => {
  isRouteChanging.value = false;
});

router.onError(() => {
  isRouteChanging.value = false;
});

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false;
});
</script>

<style scoped>
.route-loading-enter-active,
.route-loading-leave-active {
  transition: opacity 0.15s ease;
}
.route-loading-enter-from,
.route-loading-leave-to {
  opacity: 0;
}
</style>
