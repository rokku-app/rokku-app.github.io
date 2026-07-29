import process from 'node:process'
import { Octokit } from '@octokit/rest'

export default {
  async paths() {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
    const releases = await octokit.paginate(octokit.repos.listReleases, {
      owner: 'rokku-app',
      repo: 'rokku',
      per_page: 100,
    })

    return releases
      .filter(r => !!r.tag_name)
      .map(r => ({ params: { tag: r.tag_name } }))
  },
}
