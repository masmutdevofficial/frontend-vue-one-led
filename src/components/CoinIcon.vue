<template>
  <!-- URL-based icon (PNG / SVG / WebP from CDN or absolute URL) -->
  <img
    v-if="isUrl"
    :src="resolvedSrc"
    :alt="symbol ?? ''"
    :class="[imgClass, 'object-contain']"
    @error="onImgError"
  />
  <!-- Iconify mdi: or similar icon name -->
  <Icon v-else :icon="resolvedIcon" :class="iconClass" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { cdnUrl } from '@/utils/cdn'

const props = defineProps<{
  /** 'mdi:bitcoin'  OR  'https://cdn.../btc.png'  OR  'coin-icons/btc.png'  OR  undefined */
  icon?: string
  /** coin symbol for alt text */
  symbol?: string
  /** class applied to the <Icon> */
  iconClass?: string
  /** class applied to the <img> */
  imgClass?: string
}>()

const imgFailed = ref(false)

// Iconify names contain ':' (e.g. 'mdi:bitcoin'); everything else is treated as an image path
const isIconName = computed(() =>
  !!props.icon && props.icon.includes(':') && !props.icon.startsWith('http')
)

const isUrl = computed(() =>
  !imgFailed.value && !!props.icon && !isIconName.value
)

// Resolve relative R2 paths → full CDN URL
const resolvedSrc = computed(() => cdnUrl(props.icon))

const resolvedIcon = computed(() =>
  props.icon && isIconName.value ? props.icon : 'mdi:currency-usd'
)

function onImgError() {
  imgFailed.value = true
}
</script>
