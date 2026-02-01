---
name: Git Standards
description: Rules for writing git commit messages using Conventional Commits and Gitmoji.
---

# Git Commit Standards

All agents must follow this format for git commits:

` <emoji> <type>(<scope>): <subject>`

## 1. Types & Emojis

| Type | Emoji | Code | Description |
| :--- | :--- | :--- | :--- |
| **New Feature** | ✨ | `:sparkles:` | introducing new features |
| **Bug Fix** | 🐛 | `:bug:` | fixing a bug |
| **Documentation** | 📝 | `:memo:` | writing docs |
| **Style** | 🎨 | `:art:` | improving structure/format of the code |
| **Refactor** | ♻️ | `:recycle:` | refactoring code |
| **Tests** | ✅ | `:white_check_mark:` | adding tests |
| **Performance** | ⚡️ | `:zap:` | improving performance |
| **CI/CD** | 👷 | `:construction_worker:` | CI related changes |

## 2. Rules
1. **Scope is optional** but recommended (e.g., `auth`, `ui`, `api`).
2. **Subject** must be imperative, lowercase, and no period at the end.
   - Good: `add login button`
   - Bad: `Added login button.`
3. **Body** (optional) guidelines:
   - Use **markdown unordered list** notation.
   - Emphasize the **reason** for the change, not the implementation details.

## 3. Examples

### Feature
```text
:sparkles: feat(auth): implement jwt login flow

- support both HS256 and RS256 algorithms
- add unit tests for token validation
```

### Bug Fix
```text
:bug: fix(api): resolve race condition in job processing

- use mutex lock when accessing shared resource
- prevent data corruption during high concurrency
```

### Refactor
```text
:recycle: refactor(ui): modernize button component

- improve accessibility compliance for screen readers
- align visual style with new design system
```

### Bad Examples (Avoid these)
```text
# Bad: Vague body
:bug: fix(api): fix login bug

- fixed it

# Bad: Implementation details instead of reason
:sparkles: feat(ui): add button

- added <button> tag with class 'btn-primary'
- set onclick handler to call login()
```
