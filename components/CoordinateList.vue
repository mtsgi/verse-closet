<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update-items'): void
  (e: 'error'): void
}>()

const database = useDatabase()
const runtimeConfig = useRuntimeConfig()

const dispType = ref<'default' | 'compact' | 'gallery'>('default')

const {
  formWord,
  formBrandName,
  formCardPool,
  formRarity,
  formCompleted,
  sortType,
  sortOrder,
  filterUsing,
  clearFilter,
  filteredCoordinates,
} = useCoordinateFilter(
  computed(() => database.value.coordinates),
  { brandNameList: runtimeConfig.public.brandNameList },
)
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
          >
            <template #item-label="{ item }">
              <div class="form-rarity flex">
                <img
                  v-for="i in item"
                  :key="`list-rarity-${item}-star-${i}`"
                  src="/star_icon.png"
                  alt="★"
                  class="w-5 h-5"
                >
              </div>
            </template>
          </USelect>
          <UButton
            icon="solar:close-circle-linear"
            variant="ghost"
            color="neutral"
            :disabled="formRarity === undefined"
            @click="formRarity = undefined"
          />

          <label>フルコーデ</label>
          <USelect
            v-model="formCompleted"
            :items="[{
              label: 'そろってる',
              value: true,
            }, {
              label: 'そろってない',
              value: false,
            }]"
          />
          <UButton
            icon="solar:close-circle-linear"
            variant="ghost"
            color="neutral"
            :disabled="formCompleted === undefined"
            @click="formCompleted = undefined"
          />
        </div>
        <UButton
          variant="outline"
          block
          :disabled="!filterUsing"
          @click="clearFilter"
        >
          しぼりこみをかいじょする
        </UButton>
      </template>
    </UCollapsible>

    <!-- ならびかえと表示タイプ -->
    <div class="disp-menu">
      <UFieldGroup>
        <UButton
          color="neutral"
          variant="outline"
          :icon="sortOrder === 'asc' ? 'icon-park-solid:up-two' : 'icon-park-solid:down-two'"
          @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
        />
        <USelect
          v-model="sortType"
          :items="[
            { label: 'コーデのなまえ', value: 'name' },
            { label: 'ブランド', value: 'brand' },
            { label: 'レアリティ', value: 'rarity' },
          ]"
        />
      </UFieldGroup>

      <div class="separator" />

      <UFieldGroup>
        <UButton
          :variant="dispType === 'default' ? 'solid' : 'outline'"
          icon="material-symbols:lists"
          @click="dispType = 'default'"
        />
        <UButton
          :variant="dispType === 'compact' ? 'solid' : 'outline'"
          icon="material-symbols:menu"
          @click="dispType = 'compact'"
        />
        <UButton
          :variant="dispType === 'gallery' ? 'solid' : 'outline'"
          icon="material-symbols:grid-view-outline"
          @click="dispType = 'gallery'"
        />
      </UFieldGroup>
    </div>
  </div>

  <div
    class="item-list"
    :class="`--${dispType}`"
  >
    <CoordinateDetail
      v-for="coordinate in filteredCoordinates"
      :key="coordinate.name"
      :coordinate="coordinate"
      :disp-type="dispType"
      @update-items="emit('update-items')"
      @error="emit('error')"
    />
  </div>

  <div
    v-if="database.db !== null"
    class="alerts"
  >
    <UAlert
      v-if="database.coordinates.length === 0"
      title="Verse Closetへようこそ！"
      variant="outline"
      color="info"
      icon="solar:lightbulb-outline"
      :ui="{
        root: 'bg-white shadow-md',
        icon: 'size-8',
      }"
    >
      <template #description>
        <div class="mt-2">
          右上の
          <UIcon
            name="solar:add-square-bold"
            :size="20"
            style="vertical-align: bottom"
          />
          からコーデをとうろくしてね
        </div>
        <div class="mt-2">
          「ホーム画面に追加」または「インストール」がおすすめです
        </div>
      </template>
    </UAlert>

    <UAlert
      v-else-if="filteredCoordinates.length === 0"
      variant="outline"
      title="ひとつもありません"
    />
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;

  .filter-form {
    display: grid;
    align-items: center;
    grid-template-columns: 5rem 1fr 2rem;
    gap: 0.5rem;
    margin: 1rem 0;

    label {
      font-size: 0.8rem;
    }
  }

  :deep(.form-rarity) {
    display: flex;

    img {
      flex-shrink: 0;

      &:not(:last-child) {
        margin-right: -0.5rem;
      }
    }
  }

  .disp-menu {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .separator {
      flex-grow: 1;
    }

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

  &.--gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    grid-auto-flow: row dense;
  }
}

.alerts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
}
</style>
