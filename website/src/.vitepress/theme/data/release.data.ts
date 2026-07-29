import type { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import process from 'node:process'
import { Octokit } from '@octokit/rest'
import { defineLoader } from 'vitepress'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

type GitHubRelease = GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.getLatestRelease>

export interface AppRelease {
  stable: GitHubRelease
  beta: GitHubRelease
}

declare const data: AppRelease
export { data }

export default defineLoader({
  async load(): Promise<AppRelease> {
    const { data: stable } = await octokit.repos.getLatestRelease({
      owner: 'rokku-app',
      repo: 'rokku',
    })

    const { data: releases } = await octokit.repos.listReleases({
      owner: 'rokku-app',
      repo: 'rokku',
      per_page: 10,
    })
    const beta = releases.find(r => r.prerelease) ?? stable

    return { stable, beta: beta as GitHubRelease }
  },
})
