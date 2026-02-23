<template>
  <span class="pk-tooltip-root relative inline-flex">
    <span
      :id="triggerId"
      ref="triggerRef"
      class="inline-flex"
      :aria-describedby="visible ? `tooltip-${triggerId}` : undefined"
      @mouseenter="show"
      @mouseleave="hide"
      @focus="show"
      @blur="hide"
    >
      <slot />
    </span>
    <span
      v-show="visible"
      :id="`tooltip-${triggerId}`"
      role="tooltip"
      class="pk-tooltip-bubble"
      :class="placementClass"
    >
      {{ content }}
    </span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    content: string;
    placement?: "top" | "bottom";
  }>(),
  { placement: "top" }
);

const triggerId = `tooltip-trigger-${Math.random().toString(36).slice(2, 9)}`;
const triggerRef = ref<HTMLElement | null>(null);
const visible = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;
const delay = 400;

const placementClass = computed(() =>
  props.placement === "bottom" ? "pk-tooltip-bubble--bottom" : "pk-tooltip-bubble--top"
);

function show() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    visible.value = true;
  }, delay);
}

function hide() {
  if (timeout) clearTimeout(timeout);
  timeout = null;
  visible.value = false;
}

onUnmounted(() => {
  if (timeout) clearTimeout(timeout);
});
</script>

<style scoped>
.pk-tooltip-root {
  display: inline-flex;
}

.pk-tooltip-bubble {
  position: absolute;
  z-index: 9999;
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
  color: rgb(var(--surface));
  background-color: rgb(var(--text));
  border-radius: 0.375rem;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.pk-tooltip-bubble--top {
  bottom: 100%;
  left: 50%;
  margin-bottom: 0.25rem;
  transform: translateX(-50%);
}

.pk-tooltip-bubble--bottom {
  top: 100%;
  left: 50%;
  margin-top: 0.25rem;
  transform: translateX(-50%);
}
</style>
