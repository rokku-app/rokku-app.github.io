import type { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import process from 'node:process'
import { Octokit } from '@octokit/rest'
import { defineLoader } from 'vitepress'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

type GitHubRelease = GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.getLatestRelease>

export interface AppRelease {
  stable: GitHubRelease
  nightly: GitHubRelease
}

declare const data: AppRelease
export { data }

export default defineLoader({
  async load(): Promise<AppRelease> {
    const { data: stable } = await octokit.repos.getLatestRelease({
      owner: 'rokku-app',
      repo: 'rokku',
    })

    // Nightly releases are always prerelease:true, and getLatestRelease excludes
    // prereleases, so the most recent nightly has to be pulled from the list instead.
    const { data: nightlyReleases } = await octokit.repos.listReleases({
      owner: 'rokku-app',
      repo: 'rokku-nightly',
      per_page: 1,
    })

    return { stable, nightly: nightlyReleases[0] }
  },
})
