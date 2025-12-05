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

// scripts/red_team_attack.js
// Dependency: npm install @actions/core @actions/github @google/generative-ai

const core = require("@actions/core");
const github = require("@actions/github");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;
    const systemPrompt = process.env.RED_TEAM_PROMPT;

    // 1. Initialize AI & GitHub
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const octokit = github.getOctokit(githubToken);
    const context = github.context;

    console.log("😈 RED TEAM AGENT ACTIVATED...");

    // 2. Generate Attack Plan
    console.log("🧠 Planning Attack Vector...");
    const result = await model.generateContent([
      systemPrompt,
      "Generate a random attack vector now. Output JSON only.",
    ]);
    const response = result.response;
    const text = response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const attack = JSON.parse(text);

    console.log(`⚔️  Vector Selected: ${attack.vector}`);
    console.log(`📝 Target: ${attack.file_path} (${attack.action})`);

    // 3. Execute GitHub Operations
    const timestamp = new Date().getTime();
    const branchName = `attack/simulation-${timestamp}`;
    const baseBranch = "main";

    // Get Base SHA
    const { data: refData } = await octokit.rest.git.getRef({
      ...context.repo,
      ref: `heads/${baseBranch}`,
    });
    const baseSha = refData.object.sha;

    // Create Branch
    await octokit.rest.git.createRef({
      ...context.repo,
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });

    // Prepare File Content (Base64)
    let blobSha;
    if (attack.action !== "delete") {
      const contentEncoded = Buffer.from(
        attack.file_content || "// Malicious payload",
      ).toString("base64");
      const { data: blobData } = await octokit.rest.git.createBlob({
        ...context.repo,
        content: contentEncoded,
        encoding: "base64",
      });
      blobSha = blobData.sha;
    }

    // Update Tree (File Change/Delete)
    const { data: treeData } = await octokit.rest.git.createTree({
      ...context.repo,
      base_tree: baseSha,
      tree: [
        {
          path: attack.file_path,
          mode: "100644",
          type: "blob",
          sha: attack.action === "delete" ? null : blobSha, // null sha deletes the file
        },
      ],
    });

    // Commit
    const { data: commitData } = await octokit.rest.git.createCommit({
      ...context.repo,
      message: `chore(simulation): ${attack.vector}`,
      tree: treeData.sha,
      parents: [baseSha],
    });

    // Update Branch Ref
    await octokit.rest.git.updateRef({
      ...context.repo,
      ref: `heads/${branchName}`,
      sha: commitData.sha,
    });

    // 4. Open Pull Request
    const { data: pr } = await octokit.rest.pulls.create({
      ...context.repo,
      title: `[WAR GAME] ${attack.pr_title}`,
      body:
        attack.pr_body + "\n\n> ⚠️ **THIS IS A SIMULATED ATTACK BY RED TEAM.**",
      head: branchName,
      base: baseBranch,
    });

    console.log(`🚀 Attack Launched! PR #${pr.number} created.`);
    console.log("Waiting for Gatekeeper to react...");
  } catch (error) {
    core.setFailed(`Red Team Failed to Attack: ${error.message}`);
  }
}

run();
