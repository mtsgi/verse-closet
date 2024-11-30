<template>
  <div class="loading px-4">
    <UProgress :model-value="null" />

    <div
      v-for="n in 3"
      :key="`loading-skeleton-${n}`"
      class="flex items-center gap-4 mt-4"
    >
      <USkeleton class="h-16 w-16" />

      <div class="grid gap-2">
        <USkeleton class="h-4 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
      </div>
    </div>
  </div>
</template>
