# Rules of Engagement: The Audit Protocol

**Welcome to the Authority.**
You are here to validate your Engineering Judgment, not just your syntax.

## 1. The "Human-Only" Workflow
1. **Fork** the Mission Repository.
2. **Audit** the codebase. Find the trap (Logic Error, Security Hole, or Performance Bomb).
3. **Fix** the issue locally.
4. **Submit PR** to the `main` branch.

## 2. The Voight-Kampff Rule (CRITICAL)
Codeijoe uses an automated **Reasoning Check**.
* We do not care if your code works. We care if you know **WHY** it works.
* **Mandatory:** In your Pull Request description, you MUST fill out the **"Trade-off Analysis"** section.
* **Warning:** If you provide a generic AI summary (e.g., "I fixed the bug"), our Gatekeeper Bot will **Auto-Reject** your submission as "AI Slop". Write like an Engineer.

## 3. The "Zero-Touch" Policy
We utilize aggressive automation.
* **Fail Fast:** If your PR fails the CI/CD Pipeline (Tests/Linter), it is ignored.
* **No Spoon-feeding:** Do not open Issues asking "Why did this fail?". Read the logs. Debugging is the test.

## 4. Legal & IP Rights
By submitting a Pull Request:
1.  You certify that the logic is your own.
2.  You grant Codeijoe a license to use your submission for data analysis.
3.  You retain moral rights to use this work in your portfolio.
