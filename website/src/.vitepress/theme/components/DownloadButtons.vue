<script setup lang="ts">
/// <reference types="@types/gtag.js" />

import {
  IconAlertOutline,
  IconAndroid,
  IconCalendarOutline,
  IconTagOutline,
} from '@iconify-prerendered/vue-mdi'
import { computed, onMounted, ref } from 'vue'
import { data as release } from '../data/release.data'
import ReleaseDate from './ReleaseDate.vue'

const downloadInformation = computed(() => ({
  nightly: {
    tagName: release.nightly.tag_name ?? 'r0000',
    asset: (release.nightly.assets ?? [])
      .find(a => /^rokku-r\d{4,}.apk/.test(a.name)),
  },
  stable: {
    tagName: release.stable.tag_name ?? 'v0.00.0',
    asset: (release.stable.assets ?? [])
      .find(a => /^rokku-v\d+\.\d+\.\d+.apk/.test(a.name)),
  },
}))

const isAndroid = ref(true)

onMounted(() => {
  isAndroid.value = !!navigator.userAgent.match(/android/i)
})

function handleAnalytics(type: 'nightly' | 'stable') {
  window.gtag?.('event', 'Download', {
    event_category: 'App',
    event_label: type === 'stable' ? 'Stable' : 'Beta',
    version: type === 'stable'
      ? release.stable.tag_name
      : release.nightly.tag_name,
  })
}
</script>

<template>
  <div>
    <div v-if="!isAndroid" class="custom-block danger">
      <p class="custom-block-title">
        Unsupported operating system
      </p>
      <p>
        <strong>Rokku</strong> is only available on Android. Any non-Android app named <strong>Rokku</strong> is unaffiliated with this project.
      </p>
      <p>
        Read the <a href="/docs/faq/general">General FAQ</a> for more information.
      </p>
    </div>
    <section class="release-selector" aria-label="Choose your release">
      <div class="release-cards">
        <article class="release-card stable">
          <div class="release-card-header">
            <span class="release-icon" aria-hidden="true"><img src="/img/logo-128px.png" alt=""></span>
            <div>
              <h3>Stable</h3>
              <p>Recommended for most users</p>
            </div>
          </div>
          <dl class="release-details">
            <div>
              <IconTagOutline aria-hidden="true" />
              <div class="release-detail-copy">
                <dt>Latest release:</dt>
                <dd>{{ downloadInformation.stable.tagName }}</dd>
              </div>
            </div>
            <div>
              <IconCalendarOutline aria-hidden="true" />
              <div class="release-detail-copy">
                <dt>Released:</dt>
                <dd><ReleaseDate type="stable" /></dd>
              </div>
            </div>
          </dl>
          <div class="release-actions">
            <a
              class="download-button primary"
              :download="downloadInformation.stable.asset?.name"
              :href="downloadInformation.stable.asset?.browser_download_url"
              @click="handleAnalytics('stable')"
            >
              <IconDownload />
              <span class="text">Rokku</span>
              <span class="version">{{ downloadInformation.stable.tagName }}</span>
            </a>
            <span class="release-action-note">
              <IconAndroid aria-hidden="true" />
              <span>Requires <strong>Android 8.0</strong> or higher.</span>
            </span>
          </div>
        </article>
        <article class="release-card beta">
          <div class="release-card-header">
            <span class="release-icon" aria-hidden="true"><IconBugReport /></span>
            <div>
              <h3>Beta</h3>
              <p>Preview upcoming changes</p>
            </div>
          </div>
          <dl class="release-details">
            <div>
              <IconTagOutline aria-hidden="true" />
              <div class="release-detail-copy">
                <dt>Latest release:</dt>
                <dd>{{ downloadInformation.nightly.tagName }}</dd>
              </div>
            </div>
            <div>
              <IconCalendarOutline aria-hidden="true" />
              <div class="release-detail-copy">
                <dt>Released:</dt>
                <dd><ReleaseDate type="nightly" /></dd>
              </div>
            </div>
          </dl>
          <div class="release-actions">
            <a
              class="download-button secondary"
              :download="downloadInformation.nightly.asset?.name"
              :href="downloadInformation.nightly.asset?.browser_download_url"
              @click="handleAnalytics('nightly')"
            >
              <IconDownload />
              <span class="text">Rokku Beta</span>
              <span class="version">{{ downloadInformation.nightly.tagName }}</span>
            </a>
            <span class="release-action-note">
              <IconAlertOutline aria-hidden="true" />
              <span>May contain unfinished features or stability issues.</span>
            </span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style lang="stylus">
.release-selector {
  margin: 1.5rem auto 0
}

.release-cards {
  display: grid
  grid-template-columns: repeat(2, minmax(0, 1fr))
  gap: 1.5rem
}

.release-card {
  display: flex
  min-width: 0
  flex-direction: column
  border: 1px solid var(--vp-c-divider)
  border-radius: 14px
  padding: 1.5rem
  background: var(--vp-c-bg-soft)

  &.stable {
    border-color: var(--vp-c-brand-border)
    background: var(--vp-c-brand-dimm)
  }
}

.release-card-header {
  display: flex
  align-items: center
  gap: 1rem
  padding-bottom: 0.75rem

  h3 {
    margin: 0
    font-size: 1.5rem
  }

  p {
    margin: 0.15rem 0 0
    color: var(--vp-c-text-2)
    font-size: 1rem
  }
}

.release-icon {
  display: grid
  width: 4rem
  height: 4rem
  flex: 0 0 auto
  place-items: center
  border-radius: 50%
  overflow: hidden
  color: var(--vp-c-text-1)
  background: var(--vp-c-default-soft)

  svg {
    font-size: 2rem
  }

  img {
    width: 100%
    height: 100%
    object-fit: cover
  }

  .stable & {
    background: var(--vp-c-brand-soft)
  }
}

.release-details {
  display: grid
  gap: 0.5rem
  margin: 0.75rem 0

  div {
    display: flex
    align-items: center
    gap: 0.75rem
  }

  .release-detail-copy {
    display: inline-flex
    align-items: baseline
    gap: 0.5rem
    min-width: 0
  }

  svg {
    width: 2rem
    height: 2rem
    flex: 0 0 auto
    padding: 0.5rem
    border-radius: 50%
    color: var(--vp-c-text-2)
    background: var(--vp-c-default-soft)

    .stable & {
      color: var(--vp-c-brand-darker)
      background: var(--vp-c-brand-dimm)
    }
  }

  dt,
  dd {
    margin: 0
    font-size: 1rem
  }

  dt {
    color: var(--vp-c-text-2)
  }

  dd {
    color: var(--vp-c-text-1)
    font-weight: 600
  }
}

.release-action-note {
  display: flex
  align-items: flex-start
  gap: 0.5rem
  margin: 0.75rem 0 0
  color: var(--vp-c-text-2)
  font-size: 0.9rem
  line-height: 1.5

  svg {
    margin-top: 0.1rem
    flex: 0 0 auto
    font-size: 1.2rem
  }
}

.release-actions {
  margin-top: auto
  padding-top: 0.75rem
}

.download-button {
  display: block
  width: 100%
  text-align: center
  font-weight: 600
  white-space: nowrap
  cursor: pointer
  transition: color 0.25s, border-color 0.25s, background-color 0.25s
  border-radius: 9px
  padding: 0 16px
  line-height: 3.75rem
  font-size: 1rem

  &:hover {
    text-decoration: none !important
  }

  &.primary {
    color: var(--vp-button-brand-text)
    background-color: var(--vp-button-brand-bg)

    &:hover {
      color: var(--vp-button-brand-hover-text)
      background-color: var(--vp-button-brand-hover-bg)
    }

    &:active {
      color: var(--vp-button-brand-active-text)
      background-color: var(--vp-button-brand-active-bg)
    }
  }

  &.secondary {
    color: var(--vp-button-alt-text)
    background-color: var(--vp-button-alt-bg)

    &:hover {
      color: var(--vp-button-alt-hover-text)
      background-color: var(--vp-button-alt-hover-bg)
    }

    &:active {
      color: var(--vp-button-alt-active-text)
      background-color: var(--vp-button-alt-active-bg)
    }
  }

  svg {
    display: inline-block
    vertical-align: middle
    margin-right: 0.5em
    font-size: 1.25em
  }

  .text {
    margin-right: 0.5rem
  }

  .version {
    font-size: 0.8em
  }
}

@media (max-width 640px) {
  .release-cards {
    grid-template-columns: 1fr
  }

  .release-card {
    padding: 1.25rem
  }
}
</style>
