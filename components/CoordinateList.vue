<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update-items'): void
  (e: 'error'): void
}>()

const database = useDatabase()
const runtimeConfig = useRuntimeConfig()

const formWord = ref<string>('')
const formBrandName = ref<string>('')
const formCardPool = ref<string>('')
const formRarity = ref<number | null>(null)

/** しぼりこみを1つでも使っているか？ */
const filterUsing = computed<boolean>(() => {
  return formBrandName.value !== ''
    || formCardPool.value !== ''
    || formRarity.value !== null
})

/** しぼりこみをすべて解除する */
const clearFilter = () => {
  formBrandName.value = ''
  formCardPool.value = ''
  formRarity.value = null
}

/** けんさく＆しぼりこみを適用したコーデリスト */
const filteredCoordinates = computed<VerseCoordinate[]>(() => {
  return database.value.allCoordinates.filter((coordinate) => {
    let flag = true
    // けんさくワード
    if (flag && formWord.value !== '') {
      flag = coordinate.name.includes(formWord.value)
    }
    // ブランド
    if (flag && formBrandName.value !== '') {
      flag = coordinate.brandName === formBrandName.value
    }
    // バージョン
    if (flag && formCardPool.value !== '') {
      flag = coordinate.pool.includes(formCardPool.value)
    }
    // レアリティ
    if (flag && formRarity.value !== null) {
      flag = coordinate.rarity === formRarity.value
    }

    return flag
  })
})
</script>

<template>
  <div class="form">
    <UInput
      v-model="formWord"
      variant="outline"
      size="xl"
      icon="solar:magnifer-linear"
      placeholder="けんさくワード"
    >
      <template
        v-if="formWord.length > 0"
        #trailing
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="solar:close-circle-linear"
          @click="formWord = ''"
        />
      </template>
    </UInput>

    <!-- しぼりこみ -->
    <UCollapsible>
      <UButton
        class="group"
        label="しぼりこみ"
        variant="soft"
        block
        :icon="filterUsing ? 'solar:filter-bold' : 'solar:filter-linear'"
        trailing-icon="i-heroicons-chevron-down-20-solid"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
        }"
      />

      <template #content>
        <UCard>
          <div class="filter-form">
            <label>ブランド</label>
            <USelect
              v-model="formBrandName"
              :items="runtimeConfig.public.brandNameList"
            />
            <UButton
              icon="solar:close-circle-linear"
              variant="ghost"
              color="neutral"
              :disabled="formBrandName === ''"
              @click="formBrandName = ''"
            />
            <label>バージョン</label>
            <USelect
              v-model="formCardPool"
              :items="runtimeConfig.public.cardPoolList"
            />
            <UButton
              icon="solar:close-circle-linear"
              variant="ghost"
              color="neutral"
              :disabled="formCardPool === ''"
              @click="formCardPool = ''"
            />
            <label>レアリティ</label>
            <USelect
              v-model.number="formRarity"
              :items="[1, 2, 3, 4]"
            />
            <UButton
              icon="solar:close-circle-linear"
              variant="ghost"
              color="neutral"
              :disabled="formRarity === null"
              @click="formRarity = null"
            />
          </div>
          <UButton
            variant="outline"
            block
            :disabled="!filterUsing"
            @click="clearFilter"
          >
            しぼりこみを解除する
          </UButton>
        </UCard>
      </template>
    </UCollapsible>
  </div>

  <div class="item-list">
    <CoordinateDetail
      v-for="coordinate in filteredCoordinates"
      :key="coordinate.name"
      :coordinate="coordinate"
      @update-items="emit('update-items')"
      @error="emit('error')"
    />

    <UAlert
      v-if="filteredCoordinates.length === 0"
      variant="outline"
      title="ひとつもありません"
    />
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;

  .filter-form {
    display: grid;
    align-items: center;
    grid-template-columns: 5rem 1fr 2rem;
    gap: 0.5rem;
    margin-bottom: 1rem;

    label {
      font-size: 0.8rem;
    }
  }
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
</style>
