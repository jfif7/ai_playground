---
description: Auto-generate git commit messages based on staged changes
---

> **Note:** This workflow uses the `git_standards` skill.

1. **Check Staged Changes**
   - Run `git diff --cached` to see what is staged.
   - **Critical:** If nothing is staged, **STOP** and ask the user to stage files first.

2. **Generate Message**
   - Analyze the diff from step 1.
   - Consult `.agent/skills/git_standards/SKILL.md` for the correct emoji and type.
   - Draft a message following: `<emoji> <type>(<scope>): <subject>`.

3. **Commit**
   - Run the command: `git commit -m "YOUR_MESSAGE"`.
   - **Note:** The user will be prompted to approve this command. This acts as the approval step.
