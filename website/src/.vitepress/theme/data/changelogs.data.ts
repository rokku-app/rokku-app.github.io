import type { Release } from '../../config/releaseData'
import { defineLoader } from 'vitepress'
import { getStableReleases } from '../../config/releaseData'

declare const data: Release[]
export { data }

export default defineLoader({
  async load(): Promise<Release[]> {
    return getStableReleases()
  },
})
