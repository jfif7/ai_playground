---
name: Document Management
description: Standards for file naming, folder structure, and document organization for the project.
---

# Document Organization Rules

All agents and workflows must adhere to the following directory structure:

## 1. Requirements (Phase 1)
- **Path:** `docs/requirements.md`
- **Purpose:** High-level feature definitions and user stories.
- **Single Source of Truth:** Do not create duplicate requirement files.

## 2. System Design (Phase 2)
- **Path:** `docs/design.md`
- **Purpose:** Technical architecture, data models, and API definitions.

## 3. Specifications (Phase 2 Output)
- **Root Directory:** `docs/specs/`
- **Naming Convention:** `uc_[number]_[short_name].md`
- **Examples:**
  - `docs/specs/uc_01_user_login.md`
  - `docs/specs/uc_02_add_to_cart.md`
- **Content:** Each file must define *one* testable user flow.

## 4. Tests (Phase 3)
- **Root Directory:** `tests/`
- **Correlation:** Test files must map to specs.
- **Naming:** `tests/test_[spec_name].py`
