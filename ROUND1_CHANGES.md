# Round 1 Security Hardening: Summary of Changes

**Date:** November 11, 2026  
**Auditor / Engineer:** Senior Security-Minded Full-Stack Engineer  
**Status:** Completed & Verified  

---

## 1. Overview of Tasks Completed

### Task 1: Remove the Fake Login Fallback
- **File Modified:** [`src/services/authService.ts`](src/services/authService.ts)
- **Changes:**
  - Removed lines 115–148 in `login()` where a synthetic session (`jwt_prod_${Date.now()}`) and automatic `SUPER_ADMIN` role assignment were created upon request failure.
  - Replaced it with clean error handling that preserves explicit server error messages or throws `"Unable to sign in. Please check your details or try again later."`.
  - Removed lines 166–193 in `register()` where a synthetic `ORGANIZATION_ADMIN` session and token were manufactured on failure.
  - Confirmed that neither `login()` nor `register()` ever returns a token or user object unless the server explicitly returned an authenticated response.
  - Verified that UI forms ([`PortalAuthLayout.tsx`](src/pages/auth/PortalAuthLayout.tsx) and [`Login.tsx`](src/pages/auth/Login.tsx)) capture and display the rejection error cleanly via `toast.error()` without crashing.

### Task 2: Remove Hardcoded Secrets
- **Files Modified / Created:**
  - [`.gitignore`](.gitignore): Added `.env` and `.env*.local` so environment secrets are never tracked by version control.
  - [`.env.example`](.env.example): Created template documenting required variables (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`, `NODE_ENV`) using non-sensitive placeholders.
  - [`.env`](.env): Generated local configuration containing a cryptographically secure 96-hex-character `JWT_SECRET` (generated via Node `crypto.randomBytes(48).toString('hex')`) and strong random database credentials.
  - [`docker-compose.yml`](docker-compose.yml): Replaced hardcoded plaintext `SecureEnterprisePassword2026!` with `${POSTGRES_PASSWORD}` and `${DATABASE_URL}` variable expansions.
  - [`src/server/auth/tokens/jwt.service.ts`](src/server/auth/tokens/jwt.service.ts): Removed hardcoded fallback string `'examifypro_super_secret_jwt_key_32_chars_long!'`. Server now enforces `process.env.JWT_SECRET` with zero fallback; if missing or `< 32` characters, startup halts immediately with a fatal error.
  - [`vite.config.ts`](vite.config.ts): Added `loadEnv` integration so local `.env` variables populate `process.env` during test and build lifecycles.

### Task 3: Lock Down Admin and Portal Routes
- **Files Modified:**
  - [`src/guards/AuthGuard.tsx`](src/guards/AuthGuard.tsx): Strengthened guard to reject sessions where `accessToken` or `user` is missing or empty, ensuring manipulated `localStorage` flags without a token cannot bypass authentication.
  - [`src/guards/RoleGuard.tsx`](src/guards/RoleGuard.tsx): Added authentication and token existence validation. Unauthenticated users are redirected to `/auth`, while authenticated users lacking the required role are redirected to `/auth/access-denied`.
  - [`src/App.tsx`](src/App.tsx): Wrapped all administrative, operational, proctoring, and portal routes with strict `AuthGuard` and `RoleGuard` definitions matching codebase role names.

---

## 2. Route Protection Audit Matrix (Before vs. After)

| Route Path | Element / Component | Prior Security State | Round 1 Hardened State | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `LightLanding` | Public | **Public** | Any (Public Landing) |
| `/auth` | `PortalSelection` | Public | **Public** | Any (Public Gateway) |
| `/auth/*` (login, register, forgot-pw, etc.) | Auth Flow Pages | Public | **Public** | Any (Public Auth Flow) |
| `/admin` | `AdminLanding` | Public | **Public** | Any (Public Landing with Sign-in CTA) |
| `/admin/login`, `/super-admin/login` | `SuperAdminLogin` | Public | **Public** | Any (Public Login) |
| `/organization/login`, `/org-admin/login` | `OrgAdminLogin` | Public | **Public** | Any (Public Login) |
| `/faculty`, `/faculty/login` | `FacultyLanding`, `FacultyLogin` | Public | **Public** | Any (Public Landing / Login) |
| `/invigilator`, `/invigilator/login` | `InvigilatorLanding`, `Login` | Public | **Public** | Any (Public Landing / Login) |
| `/student`, `/student/login`, `/student/register` | Student Auth Suite | Public | **Public** | Any (Public Landing / Login) |
| `/student/exams/runner` | `StudentExamRunner` | AuthGuard Only | **AuthGuard + RoleGuard** | `STUDENT`, `SUPER_ADMIN` |
| `/operations` | `EnterpriseCommandCenter` | **UNPROTECTED (Public)** | **AuthGuard + RoleGuard** | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `INVIGILATOR` |
| `/proctoring` | `StudentExamRunner` | **UNPROTECTED (Public)** | **AuthGuard + RoleGuard** | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `INVIGILATOR` |
| `/proctoring/consent` | `StudentExamRunner` | **UNPROTECTED (Public)** | **AuthGuard + RoleGuard** | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `INVIGILATOR` |
| `/proctoring/camera` | `StudentExamRunner` | **UNPROTECTED (Public)** | **AuthGuard + RoleGuard** | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `INVIGILATOR` |
| `/proctoring/operations` | `EnterpriseCommandCenter` | **UNPROTECTED (Public)** | **AuthGuard + RoleGuard** | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `INVIGILATOR` |
| `/super-admin/*` (dashboard, security, etc.) | `SuperAdminLayout` + Sub-routes | AuthGuard Only | **AuthGuard + RoleGuard** | `SUPER_ADMIN` |
| `/org-admin/*` (dashboard, users, etc.) | `OrgAdminLayout` + Sub-routes | AuthGuard Only | **AuthGuard + RoleGuard** | `ORGANIZATION_ADMIN`, `SUPER_ADMIN` |
| `/faculty/*` (dashboard, question-bank, etc.)| `FacultyLayout` + Sub-routes | AuthGuard Only | **AuthGuard + RoleGuard** | `FACULTY`, `SUPER_ADMIN` |
| `/invigilator/*` (dashboard, live grid, etc.)| `InvigilatorLayout` + Sub-routes | AuthGuard Only | **AuthGuard + RoleGuard** | `INVIGILATOR`, `SUPER_ADMIN` |
| `/student/*` (dashboard, courses, results) | `StudentLayout` + Sub-routes | AuthGuard Only | **AuthGuard + RoleGuard** | `STUDENT`, `SUPER_ADMIN` |
| `/coding`, `/coding/dashboard` | `CodingDashboard` (in Tenant) | AuthGuard + TenantGuard | **AuthGuard + TenantGuard + RoleGuard** | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `FACULTY`, `EXAM_CREATOR`, `EVALUATOR` |
| `/admin/*` (in Tenant Workspace) | Admin Operations & Roles Pages | AuthGuard + TenantGuard | **AuthGuard + TenantGuard + RoleGuard** | `SUPER_ADMIN` |
| `/organization/*` (in Tenant Workspace) | Org Branding & Campuses Pages | AuthGuard + TenantGuard | **AuthGuard + TenantGuard + RoleGuard** | `ORGANIZATION_ADMIN`, `SUPER_ADMIN` |
| `/developer/*` (Integrations, Webhooks, Queues)| Developer Platform Pages | AuthGuard + TenantGuard | **AuthGuard + TenantGuard + RoleGuard** | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `PLATFORM_ADMIN` |

---

## 3. Secret Search Verification

A repository-wide verification search was performed across all code, configuration files, and build assets:
- **`SecureEnterprisePassword2026!`:** **0 results found** in source, configuration, and build output.
- **`examifypro_super_secret_jwt_key_32_chars_long!`:** **0 results found** in source, configuration, and build output.
- **`jwt_prod_`:** **0 results found** in source, configuration, and build output.

---

## 4. Mandatory Manual Actions for Operator / Administrator

1. **Rotate Compromised Secrets Immediately:**
   The password `SecureEnterprisePassword2026!` and the JWT key `examifypro_super_secret_jwt_key_32_chars_long!` were previously stored in plaintext in the codebase.
   - Any live database running with that password must have its password changed immediately.
   - Any previously issued JWT signed with the old fallback secret must be revoked.
2. **Purge Git History:**
   When this project is pushed to a remote repository (e.g. GitHub or GitLab), any previous git commits containing those strings must be expunged using tools like `git-filter-repo` or BFG Repo-Cleaner.
3. **Configure Deployment Environment Variables:**
   For CI/CD and container hosting (Docker Swarm, Kubernetes, AWS ECS), inject `POSTGRES_PASSWORD`, `DATABASE_URL`, and a cryptographically generated `JWT_SECRET` (at least 32 characters) via production secret managers (e.g., AWS Secrets Manager, HashiCorp Vault).

---

## 5. Items Discovered But Not Fixed in Round 1 (Scope Boundaries)

The following items were identified during analysis but were deliberately left untouched in Round 1 per task constraints:
1. **Frontend Answer Key Leakage:** `EXAM_QUESTIONS` in `src/portals/student/StudentExamRunner.tsx` contains `correct: <number>`. Server-side question retrieval and answer stripping are slated for subsequent rounds.
2. **Client-Side Timer & State:** Exam countdown timer and violation counts still save to `localStorage` in `StudentExamRunner.tsx`.
3. **Database Disconnect:** Express controllers still read and write from in-memory Maps (`mockUsersDB`); Prisma Client is not yet instantiated.
4. **Pre-existing Vitest DOM Errors:** 7 pre-existing Vitest test failures remain in `Phase2Modules.test.ts`, `MouseEngine.test.ts`, and `ClipboardEngine.test.ts` (unchanged from baseline).

