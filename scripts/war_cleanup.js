// Copyright 2024 Codeijoe
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// scripts/war_cleanup.js
// Dependency: npm install @actions/core @actions/github

const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(githubToken);
    const context = github.context;

    console.log("🧹 CLEANUP CREW ACTIVATED...");

    // 1. Cari PR yang Open dari Red Team (Prefix: [WAR GAME])
    const { data: pullRequests } = await octokit.rest.pulls.list({
      ...context.repo,
      state: "open",
      per_page: 100,
    });

    const warGamePRs = pullRequests.filter((pr) =>
      pr.title.startsWith("[WAR GAME]"),
    );

    console.log(`🔍 Found ${warGamePRs.length} active War Game PRs.`);

    for (const pr of warGamePRs) {
      console.log(`💀 Terminating PR #${pr.number}: ${pr.title}`);

      // Step A: Close PR (jika Gatekeeper belum menutupnya)
      await octokit.rest.pulls.update({
        ...context.repo,
        pull_number: pr.number,
        state: "closed",
      });

      // Step B: Comment (Log penghapusan)
      await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pr.number,
        body: "🗑️ **SIMULATION ENDED.** Artifacts purged by Cleanup Crew.",
      });
    }

    // 2. Cari & Hapus Branch Sampah (Prefix: attack/simulation-)
    // API listBranches bisa pagination, kita ambil 100 terakhir
    const { data: branches } = await octokit.rest.repos.listBranches({
      ...context.repo,
      per_page: 100,
    });

    const attackBranches = branches.filter((b) =>
      b.name.startsWith("attack/simulation-"),
    );
    console.log(`🔍 Found ${attackBranches.length} stale attack branches.`);

    for (const branch of attackBranches) {
      console.log(`🔥 Burning branch: ${branch.name}`);
      try {
        await octokit.rest.git.deleteRef({
          ...context.repo,
          ref: `heads/${branch.name}`,
        });
      } catch (e) {
        console.log(`⚠️ Failed to delete ${branch.name}: ${e.message}`);
      }
    }

    console.log("✅ Battlefield Cleaned.");
  } catch (error) {
    core.setFailed(`Cleanup Failed: ${error.message}`);
  }
}

run();
