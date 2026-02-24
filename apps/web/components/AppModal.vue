<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelledby"
      aria-label="Dialog"
      @keydown.escape="close"
    >
      <div
        class="absolute inset-0 bg-bg/80 backdrop-blur-md"
        aria-hidden="true"
        @click="close"
      />
      <div
        ref="dialogRef"
        class="relative z-10 w-full rounded-xl border border-border bg-surface focus:outline-none"
        :class="size === 'lg' ? 'max-w-xl' : 'max-w-lg'"
        style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(96, 165, 250, 0.1), 0 0 40px -12px rgba(96, 165, 250, 0.15);"
        tabindex="-1"
        @click.stop
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    labelledby?: string;
    size?: "default" | "lg";
  }>(),
  { labelledby: undefined, size: "default" }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const dialogRef = ref<HTMLElement | null>(null);

function close() {
  emit("update:modelValue", false);
}

watch(
  () => props.modelValue,
  (open: boolean) => {
    if (open) {
      nextTick(() => {
        dialogRef.value?.focus();
      });
    }
  }
);
</script>
