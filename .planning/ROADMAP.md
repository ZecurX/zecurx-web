# ROADMAP: v1.0 Academy & Navigation Fixes

**Milestone:** v1.0 Academy & Navigation Fixes
**Created:** 2026-02-20
**Phase Count:** 3
**Depth:** Minimal (focused bug fix milestone)

## Overview

This milestone addresses two critical issues on the academy page:
1. **UI/Navigation bug**: Floating capsule navigation component is confusing and redundant
2. **Data bug**: Course prices are hardcoded and don't reflect admin changes

The roadmap delivers these fixes in sequence: remove old navigation → add new navigation → connect to dynamic data.

## Phases

- [ ] **Phase 1: Remove Capsule Navigation** - Remove floating pill navigation from academy page and AcademyClient component
- [ ] **Phase 2: Add Left-Side Shop/Cart Links** - Implement Shop and Cart as standard navigation items on the left side
- [ ] **Phase 3: Connect Academy to Database** - Fetch course prices from PostgreSQL and ensure admin changes are reflected

## Phase Details

### Phase 1: Remove Capsule Navigation

**Goal:** Clean up the confusing floating capsule component from the academy page experience

**Depends on:** Nothing (can start immediately)

**Requirements:** NAV-01

**Success Criteria** (what must be TRUE when done):
1. User visiting academy page does NOT see the floating capsule/pill component
2. No console errors or broken imports after capsule removal
3. Existing course display (cards, layout) remains intact and functioning

**Plans:** TBD

---

### Phase 2: Add Left-Side Shop/Cart Links

**Goal:** Provide proper navigation for users to access Shop and Cart from the academy page

**Depends on:** Phase 1 (capsule removed, cleared way for new nav)

**Requirements:** NAV-02, NAV-03

**Success Criteria** (what must be TRUE when done):
1. User can click on "Shop" link on the left side to navigate to `/shop`
2. User can click on "Cart" link on the left side to navigate to `/cart`
3. Shop and Cart links are styled consistently with other navigation items
4. Links work from any page within the academy section

**Plans:** TBD

---

### Phase 3: Connect Academy to Database

**Goal:** Make course prices dynamic by fetching from database instead of hardcoded arrays

**Depends on:** Phase 2 (navigation completed, focus on data layer)

**Requirements:** ACAD-01, ACAD-02, ACAD-03, ACAD-04

**Success Criteria** (what must be TRUE when done):
1. Academy page fetches course data (name, description, price) from PostgreSQL database
2. When admin updates a course price in the dashboard, that change appears on the academy page on next page load (no code deployment required)
3. Hardcoded course array in `src/app/academy/AcademyClient.tsx` is removed and replaced with database fetch
4. Existing checkout and payment flows continue to work without breaking (prices come from same database source)

**Plans:** TBD

---

## Progress Table

| Phase | Goal | Requirements | Success Criteria | Plans Complete | Status | Completed |
|-------|------|--------------|------------------|-----------------|--------|-----------|
| 1 | Remove capsule nav | NAV-01 | 3 criteria | 0/1 | Not started | — |
| 2 | Add left-side links | NAV-02, NAV-03 | 4 criteria | 0/1 | Not started | — |
| 3 | Connect to database | ACAD-01, ACAD-02, ACAD-03, ACAD-04 | 4 criteria | 0/1 | Not started | — |

## Coverage Summary

✓ **All 7 v1.0 requirements mapped to phases**

| Category | Requirements | Mapped | Phase |
|----------|--------------|--------|-------|
| Navigation | NAV-01, NAV-02, NAV-03 | 3/3 | 1, 2, 2 |
| Academy Data | ACAD-01, ACAD-02, ACAD-03, ACAD-04 | 4/4 | 3, 3, 3, 3 |
| **Total** | **7** | **7/7** | ✓ |

---

*Roadmap created: 2026-02-20*
*Ready for planning: `/gsd-plan-phase 1`*
