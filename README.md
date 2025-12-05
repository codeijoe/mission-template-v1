# Codeijoe™ Mission Template (v1)

> **Identity:** The Engineering Audit Authority
> **Status:** Template / Scaffold
> **License:** CC BY-NC-ND 4.0 (Strictly Enforced)

## 🛑 Legal & Licensing Notice (READ THIS)

This repository is a **Template** for creating Codeijoe Audit Missions.
It is governed by the **Codeijoe Governance Constitution**.

### 1. Restricted License (Content & Traps)
All "Mission Content" (The Trap, The Story, The Defect Pattern, and The Hidden Tests) is licensed under **CC BY-NC-ND 4.0**.
*   **No Commercial Use:** You cannot use this template to build paid training courses or corporate hiring tests without a license.
*   **No Derivatives:** You cannot fork this, change the branding, and release it as your own challenge.

### 2. Liability Waiver (The "AS-IS" Clause)
By using this template or interacting with the Codeijoe ecosystem, you acknowledge:
*   **No Warranty:** This material is provided "AS IS".
*   **Simulation Only:** This is a role-playing audit simulation.
*   **Indemnification:** Codeijoe (Indra Wahyudi) is not liable for any damages, data loss, or career impact resulting from the use of this code.

---

## How to Use This Template

1.  **Fork** this repository.
2.  **Define the Trap:** Edit `src/` to include a subtle bug.
3.  **Define the Truth:** Edit `tests/` to assert the correct behavior (which the current code fails).
4.  **Write the Brief:** Update `README.md` with the mission context.

### Structure
```tree
.
├── .github/
│   └── workflows/    # The Gatekeeper (Apache 2.0)
├── src/              # The Broken Code (The Trap)
├── tests/            # The Truth (Hidden Tests)
├── LICENSE           # CC BY-NC-ND 4.0
└── README.md         # The Brief
```

---
*Codeijoe™ is a trademark of Indra Wahyudi. Est. 2024.*
