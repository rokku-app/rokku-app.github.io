<script setup lang="ts">
import type { AppRelease } from '../data/release.data'
import { DateTime } from 'luxon'
import { computed, onMounted, ref, toRefs } from 'vue'
import { data as release } from '../data/release.data'

const props = defineProps<{ type: keyof AppRelease }>()
const { type } = toRefs(props)

const dateInfo = computed(() => {
  const date = DateTime.fromISO(release[type.value].published_at ?? '', { zone: 'utc' }).setLocale('en')
  return {
    relative: date.isValid ? date.toRelative() ?? '' : '',
    exact: date.isValid ? date.toLocaleString(DateTime.DATETIME_FULL) : '',
    iso: release[type.value].published_at ?? undefined,
  }
})

// Mimic the <ClientOnly /> behavior to show custom text while rendering.
const show = ref(false)

onMounted(() => {
  show.value = true
})
</script>

<template>
  <time v-if="show" :datetime="dateInfo.iso" :title="dateInfo.exact">
    {{ dateInfo.relative }}
  </time>
  <time v-else :datetime="dateInfo.iso">
    {{ dateInfo.exact }}
  </time>
</template>
