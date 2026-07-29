import type { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import process from 'node:process'
import { Octokit } from '@octokit/rest'
import { defineLoader } from 'vitepress'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

type GitHubReleaseList = GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.listReleases>

declare const data: GitHubReleaseList
export { data }

export default defineLoader({
  async load(): Promise<GitHubReleaseList> {
    const releases = await octokit.paginate(octokit.repos.listReleases, {
      owner: 'rokku-app',
      repo: 'rokku',
      per_page: 100,
    })

    return releases
  },
})
