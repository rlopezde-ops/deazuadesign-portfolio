# QA Review: Password Modal & Toggle

**Date:** 2025-02-26  
**Reviewer:** Lead QA Engineer  
**Scope:** Password protection modal on case study pages (Expert Workspace, Next-Gen Portal, Disney Guest Service Suite)

---

## Summary

| Issue | Severity | Reproducible | Status |
|-------|----------|--------------|--------|
| Custom cursor hidden behind password overlay | **High** | Yes | Tasks created |
| Text caret may be low-contrast in password input | Medium | Yes | Tasks created |
| Password visibility toggle | — | Works as designed | No action |

---

## Issue 1: Cursor Not Visible (REPRODUCED)

### User Report
> "I also don't see the cursor"

### Root Cause
The custom cursor is rendered **behind** the password overlay due to z-index stacking:

| Element | z-index | File |
|---------|---------|------|
| Custom cursor (`.cursor`) | 9999 | `css/main.css` |
| Password overlay (`.password-overlay`) | 10001 | `css/case-study.css` |

The overlay sits above the cursor, so the custom cursor is not visible when the password modal is shown. Additionally, the site hides the default system cursor with `cursor: none !important` on `*` when the custom cursor is active (`main.css` lines 106–110). Result: **no visible cursor at all** when the password modal is displayed.

### Reproduction Steps
1. Open a protected case study (e.g. `projects/case-study-nextgen-portal.html`).
2. Password modal appears.
3. Move the mouse over the modal.
4. **Expected:** Cursor visible (custom or system).
5. **Actual:** No cursor visible.

### Affected Pages
- `case-study-expert-workspace.html`
- `case-study-nextgen-portal.html`
- `case-study-disney-guest-service.html`

---

## Issue 2: Text Caret Visibility (POTENTIAL)

### User Report
> "I also don't see the cursor" (may refer to text caret in input)

### Analysis
The password input (`.password-input`) has no explicit `caret-color`. The caret inherits from `color: var(--text-primary)` (#ffffff). The input background is `rgba(255, 255, 255, 0.08)` (light gray on dark). White caret on light gray can have low contrast on some displays.

### Recommendation
Add explicit `caret-color` to `.password-input` for reliable visibility (e.g. `caret-color: var(--primary)` or `caret-color: var(--text-primary)` with sufficient contrast).

---

## Password Visibility Toggle (NO BUG)

### User Report
> "I see that the password text show when I click the icon"

### Analysis
This matches intended behavior:
- **Click eye (closed → open):** Password becomes visible (`type="text"`).
- **Click eye (open → closed):** Password is masked (`type="password"`).

The toggle uses `iconoir-eye` / `iconoir-eye-closed` correctly. The duplicate padding bug from the original plan has been fixed (no duplicate `padding` in `.password-input`).

---

## Fixes Applied

1. **Custom cursor z-index** (`css/main.css`): Increased `.cursor` z-index from 9999 to 10002 so it renders above the password overlay (10001). The custom cursor is now visible when the modal is shown.
2. **Text caret visibility** (`css/case-study.css`): Added `caret-color: var(--primary)` to `.password-input` so the blinking caret is clearly visible when typing.
3. **System cursor fallback**: Not needed—the z-index fix makes the custom cursor visible, so no fallback is required.
