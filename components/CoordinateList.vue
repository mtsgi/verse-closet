<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update-items'): void
  (e: 'error'): void
}>()

const database = useDatabase()
const runtimeConfig = useRuntimeConfig()

const dispType = ref<'default' | 'compact' | 'gallery'>('default')
/** フィルターのブランド/タイプ切り替え（デフォルト：タイプ） */
const formFilterBrandType = ref<'brand' | 'type'>('type')

const {
  formWord,
  formBrandName,
  formTypeName,
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
  { brandNameList: runtimeConfig.public.brandNameList, typeNameList: runtimeConfig.public.typeNameList, cardPoolList: runtimeConfig.public.cardPoolList },
)

/** フィルターラジオ切り替え時に使わない側をクリアする */
watch(formFilterBrandType, (value) => {
  if (value === 'brand') {
    formTypeName.value = ''
  }
  else {
    formBrandName.value = ''
  }
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
        <div class="filter-form">
          <label>
            {{ formFilterBrandType === 'brand' ? 'ブランド' : 'タイプ' }}
          </label>
          <div class="filter-radio-group">
            <URadioGroup
              v-model="formFilterBrandType"
              orientation="horizontal"
              :items="[
                { label: 'ブランド', value: 'brand' },
                { label: 'タイプ', value: 'type' },
              ]"
            />
          </div>

          <template v-if="formFilterBrandType === 'brand'">
            <label />
            <USelect
              v-model="formBrandName"
              :items="runtimeConfig.public.brandNameList"
              placeholder="えらんでね"
            />
            <UButton
              icon="solar:close-circle-linear"
              variant="ghost"
              color="neutral"
              :disabled="formBrandName === ''"
              @click="formBrandName = ''"
            />
          </template>

          <template v-else>
            <label />
            <USelect
              v-model="formTypeName"
              :items="runtimeConfig.public.typeNameList"
              placeholder="えらんでね"
            />
            <UButton
              icon="solar:close-circle-linear"
              variant="ghost"
              color="neutral"
              :disabled="formTypeName === ''"
              @click="formTypeName = ''"
            />
          </template>

          <label>バージョン</label>
          <USelect
            v-model="formCardPool"
            :items="runtimeConfig.public.cardPoolList"
            placeholder="えらんでね"
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
            :items="[-1, 1, 2, 3, 4]"
            placeholder="えらんでね"
          >
            <!-- 選択肢の星 -->
            <template #item-label="{ item }">
              <div class="form-rarity flex">
                <template v-if="item === -1">
                  <UBadge
                    label="スペシャル"
                    color="warning"
                  />
                </template>
                <template v-else>
                  <img
                    v-for="i in item"
                    :key="`list-rarity-${item}-star-${i}`"
                    src="/star_icon.png"
                    alt="★"
                    class="w-5 h-5"
                  >
                </template>
              </div>
            </template>
            <template #default>
              <div class="form-rarity flex">
                <template v-if="formRarity === -1">
                  <UBadge
                    label="スペシャル"
                    color="warning"
                  />
                </template>
                <template v-else>
                  <img
                    v-for="i in formRarity"
                    :key="`list-rarity-${formRarity}-star-${i}`"
                    src="/star_icon.png"
                    alt="★"
                    class="w-5 h-5"
                  >
                  <span
                    v-if="formRarity === undefined"
                    class="text-sm text-dimmed"
                  >
                    えらんでね
                  </span>
                </template>
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
            placeholder="えらんでね"
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
            { label: 'タイプ', value: 'type' },
            { label: 'レアリティ', value: 'rarity' },
            { label: 'バージョン', value: 'pool' },
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

    .filter-radio-group {
      grid-column: span 2;
    }
  }

  :deep(.form-rarity) {
    display: flex;

    img {
      flex-shrink: 0;

      &:not(:last-child) {
        margin-right: -0.4rem;
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
