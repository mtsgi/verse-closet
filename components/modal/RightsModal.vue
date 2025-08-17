<script setup lang="ts">
import licenseNuxt from '../node_modules/nuxt/LICENSE?raw'
import licenseVue from '../node_modules/vue/LICENSE?raw'
import licenseNuxtUI from '../node_modules/@nuxt/ui/LICENSE.md?raw'
// import licenseNuxtESLint from '../node_modules/@nuxt/eslint/LICENSE?raw'
import licenseVitePWANuxt from '../node_modules/@vite-pwa/nuxt/LICENSE?raw'
// import licenseSass from '../node_modules/sass/LICENSE?raw'

const model = defineModel<boolean>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const rights = [
  { name: 'Nuxt', text: licenseNuxt },
  { name: 'Vue', text: licenseVue },
  { name: 'Nuxt UI', text: licenseNuxtUI },
  // { name: 'Nuxt ESLint', text: licenseNuxtESLint },
  { name: '@vite-pwa/nuxt', text: licenseVitePWANuxt },
  // { name: 'Dart Sass', text: licenseSass },
] as const
</script>

<template>
  <UModal
    v-model:open="model"
    title="権利表記"
    class="modal"
    :ui="{ footer: 'justify-end' }"
  >
    <UButton
      block
      variant="outline"
    >
      権利表記
    </UButton>

    <template #body>
      <div
        v-for="right in rights"
        :key="`right-${right.name}`"
      >
        <h3 class="text-l font-semibold mb-2">
          {{ right.name }}
        </h3>
        <div>
          <p
            v-for="(line, i) in right.text.split('\n')"
            :key="`right-${right.name}-line${i}`"
          >
            {{ line }}
          </p>
        </div>
        <USeparator class="my-4" />
      </div>
      権利表記ここまで
    </template>

    <template #footer>
      <UButton
        label="とじる"
        color="neutral"
        variant="outline"
        block
        @click="emit('update:modelValue', false)"
      />
    </template>
  </UModal>
</template>
