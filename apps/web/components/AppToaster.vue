<template>
  <div
    class="fixed bottom-0 right-0 z-[100] flex max-h-[50vh] w-full max-w-sm flex-col gap-2 p-4 pointer-events-none"
    role="region"
    aria-label="Notifications"
  >
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg"
        :class="toastClass(t.type)"
        role="alert"
      >
        <span class="min-w-0 flex-1 text-sm font-medium">{{ t.message }}</span>
        <button
          type="button"
          class="shrink-0 rounded p-1 transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          :class="t.type === 'error' ? 'text-error/90 focus-visible:ring-error' : 'text-muted focus-visible:ring-brand-accent'"
          aria-label="Dismiss"
          @click="dismiss(t.id)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from "~/composables/useToaster";

const { toasts, dismiss } = useToaster();

function toastClass(type: ToastType): string {
  const base = "border-l-4";
  switch (type) {
    case "error":
      return `${base} border-error bg-error/20 text-text`;
    case "success":
      return `${base} border-success bg-success/20 text-text`;
    case "info":
      return `${base} border-brand-accent bg-surface text-text`;
    default:
      return `${base} border-border bg-surface text-text`;
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
.toast-move {
  transition: transform 0.2s ease;
}
</style>
