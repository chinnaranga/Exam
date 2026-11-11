# Architectural Restructure Mapping & Migration Plan (RESTRUCTURE_MAP.md)

> **AssessIQ / Examify Portal Architecture Modernization**  
> **Branch:** `restructure-portals` | **Status:** Step 1 Completed (Awaiting User Approval Before Moving Files)

---

## 1. Executive Summary & Restructure Objectives

The goal of this restructuring is to modularize the codebase so that every user role owns a self-contained, isolated portal directory, while maintaining 100% functional, visual, and behavioral parity with zero runtime regressions:

- **Self-Contained Role Portals (`src/portals/<role>/`):** `public`, `student`, `faculty`, `invigilator`, `org-admin`, `super-admin`, `coding`, and `operations`. Each role contains its own `routes.tsx`, `layout/`, `pages/`, `components/`, `hooks/`, `services/`, and `index.ts`.
- **Domain Engines (`src/engines/`):** Heavyweight evaluation & proctoring subsystems shared across workflows (`exam-security`, `browser-integrity`, and `proctoring`).
- **Shared Foundation (`src/shared/`):** Reusable UI primitives (`components/ui`), global shell layout (`components/layout`), route guards (`guards/`), client services (`services/`), global state stores (`stores/`), utilities (`lib/`, `utils/`), and type definitions (`types/`).
- **Independent Server Service (`/server/` at project root):** Express backend extracted from `src/server` to `/server/` with independent `tsconfig.server.json`, keeping `prisma/` at the project root and updating build/container scripts.
- **Clean Application Core (`src/app/`):** `App.tsx` and core providers mounted cleanly with React lazy-loading per portal.

---

## 2. Baseline Quality Verification (Step 0 Safety Metrics)

Prior to mapping and staging moves, full baseline verification was executed on branch `restructure-portals` from commit `b18de89`:

| Metric | Baseline Result | Requirement for Completion |
| :--- | :--- | :--- |
| **Git Status** | Clean working tree on `restructure-portals` | Retain complete file history using `git mv` |
| **Vite Build (`npm run build`)** | **SUCCESS** (Exit Code 0, ~3.0s) | Must succeed with Exit Code 0 |
| **ESLint (`npm run lint`)** | 253 problems (214 errors, 39 warnings) | Error/warning count must NOT increase (<= 253) |
| **Vitest (`npx vitest run`)** | **88 passed**, 7 failed across 18 test files | Passed count must be >= 88, failed count <= 7 |

*(Note: Pre-existing test failures in Phase2Modules, MouseEngine, ClipboardEngine, and auth.test.ts are due to Node environment limitations and are cataloged to prevent regressions).*

---

## 3. Target Layout Architecture

```
exam-portal-main/
├── prisma/                                  # Database schema and migrations (remains at root)
├── server/                                  # Backend API server (extracted from src/server)
│   ├── auth/                                # Authentication, JWT, RBAC controllers & services
│   ├── confidence-pipeline/                 # Real-time WebSocket confidence scoring pipeline
│   ├── integrity/                           # Telemetry gateway & behavior analytics
│   ├── operations/                          # Enterprise operations controllers & services
│   ├── organization/                        # Multi-tenant hierarchy & invitation services
│   ├── student/                             # Student dashboard & profile controllers
│   ├── index.ts                             # Express server entrypoint
│   └── tsconfig.server.json                 # Dedicated TypeScript config for backend
├── src/
│   ├── main.tsx                             # Vite entry point
│   ├── index.css                            # Global CSS theme & Tailwind directives
│   ├── vite-env.d.ts                        # Vite client environment types
│   ├── app/                                 # Application shell
│   │   ├── App.tsx                          # Root router mounting portal routes via lazy/Suspense
│   │   └── App.css                          # App-level styling
│   ├── shared/                              # Shared foundation across all roles
│   │   ├── components/                      # Shared layout & UI components
│   │   │   ├── ui/                          # Radix / Shadcn UI primitive library
│   │   │   └── layout/                      # Global navbar, sidebar, logo, auth layout
│   │   ├── guards/                          # AuthGuard, RoleGuard, TenantGuard, PermissionGuard, Can
│   │   ├── hooks/                           # Shared utility hooks (use-toast, use-mobile, useApiQueries)
│   │   ├── lib/                             # Shared utility helpers (cn, apiClient, tokens)
│   │   ├── pages/                           # Shared error and account pages (404, AccessDenied, Sessions)
│   │   │   └── me/                          # Authenticated user self-profile & API key pages
│   │   ├── services/                        # Shared client authentication service
│   │   ├── stores/                          # Zustand global stores (auth, tenant, org, question)
│   │   ├── types/                           # Shared TypeScript models (auth, user, role)
│   │   ├── utils/                           # Shared RBAC utilities
│   │   └── integrations/                    # Supabase integration client & types
│   ├── engines/                             # Domain engines
│   │   ├── exam-security/                   # Anomaly detection, lockdown, event telemetry
│   │   ├── browser-integrity/               # DevTools, DOM overlay, blur, keyboard/mouse monitors
│   │   └── proctoring/                      # Multi-modal AI proctoring (camera, face, gaze, audio)
│   └── portals/                             # Self-contained user role portals
│       ├── public/                          # Public landing pages, marketing, and unified auth flow
│       ├── student/                         # Student exam runner, dashboard, profile, scheduled exams
│       ├── faculty/                         # Faculty question bank, exam builder, analytics, dashboard
│       ├── invigilator/                     # Invigilator live grid, incidents, and dashboard
│       ├── org-admin/                       # Organization admin hierarchy, campuses, depts, users
│       ├── super-admin/                     # Super admin governance, platform, tenants, policies
│       ├── coding/                          # Coding assessment hub, sandbox, problem repository
│       └── operations/                      # Enterprise operations command center
```

---

## 4. File-by-File Classification & Target Mapping Table

Below is the complete inventory of all 570 files currently in `src/`, categorized by target domain with path mapping and architectural rationale:

### 4.1 Public Portal (`src/portals/public/`) — 48 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/pages/Index.tsx` | `src/portals/public/pages/Index.tsx` | Public marketing landing page |
| 2 | `src/pages/auth/ForgotPassword.tsx` | `src/portals/public/pages/auth/ForgotPassword.tsx` | Public authentication / onboarding entrypoint |
| 3 | `src/pages/auth/InvitationAccept.tsx` | `src/portals/public/pages/auth/InvitationAccept.tsx` | Public authentication / onboarding entrypoint |
| 4 | `src/pages/auth/Login.tsx` | `src/portals/public/pages/auth/Login.tsx` | Public authentication / onboarding entrypoint |
| 5 | `src/pages/auth/OrgDiscovery.tsx` | `src/portals/public/pages/auth/OrgDiscovery.tsx` | Public authentication / onboarding entrypoint |
| 6 | `src/pages/auth/PortalSelection.tsx` | `src/portals/public/pages/auth/PortalSelection.tsx` | Public authentication / onboarding entrypoint |
| 7 | `src/pages/auth/Register.tsx` | `src/portals/public/pages/auth/Register.tsx` | Public authentication / onboarding entrypoint |
| 8 | `src/pages/auth/ResetPassword.tsx` | `src/portals/public/pages/auth/ResetPassword.tsx` | Public authentication / onboarding entrypoint |
| 9 | `src/pages/auth/SelectTenant.tsx` | `src/portals/public/pages/auth/SelectTenant.tsx` | Public authentication / onboarding entrypoint |
| 10 | `src/pages/auth/VerifyEmail.tsx` | `src/portals/public/pages/auth/VerifyEmail.tsx` | Public authentication / onboarding entrypoint |
| 11 | `src/pages/auth/VerifyOTP.tsx` | `src/portals/public/pages/auth/VerifyOTP.tsx` | Public authentication / onboarding entrypoint |
| 12 | `src/pages/auth/Welcome.tsx` | `src/portals/public/pages/auth/Welcome.tsx` | Public authentication / onboarding entrypoint |
| 13 | `src/pages/healthcare/HealthcareLanding.tsx` | `src/portals/public/pages/HealthcareLanding.tsx` | Public healthcare industry vertical landing page and sections |
| 14 | `src/pages/healthcare/components/AIWorkflow.tsx` | `src/portals/public/components/healthcare/AIWorkflow.tsx` | Public healthcare industry vertical landing page and sections |
| 15 | `src/pages/healthcare/components/CommandCenterPreview.tsx` | `src/portals/public/components/healthcare/CommandCenterPreview.tsx` | Public healthcare industry vertical landing page and sections |
| 16 | `src/pages/healthcare/components/ExecutiveAnalytics.tsx` | `src/portals/public/components/healthcare/ExecutiveAnalytics.tsx` | Public healthcare industry vertical landing page and sections |
| 17 | `src/pages/healthcare/components/ExecutiveTestimonials.tsx` | `src/portals/public/components/healthcare/ExecutiveTestimonials.tsx` | Public healthcare industry vertical landing page and sections |
| 18 | `src/pages/healthcare/components/FinalCTA.tsx` | `src/portals/public/components/healthcare/FinalCTA.tsx` | Public healthcare industry vertical landing page and sections |
| 19 | `src/pages/healthcare/components/Footer.tsx` | `src/portals/public/components/healthcare/Footer.tsx` | Public healthcare industry vertical landing page and sections |
| 20 | `src/pages/healthcare/components/Hero.tsx` | `src/portals/public/components/healthcare/Hero.tsx` | Public healthcare industry vertical landing page and sections |
| 21 | `src/pages/healthcare/components/IndustrySolutions.tsx` | `src/portals/public/components/healthcare/IndustrySolutions.tsx` | Public healthcare industry vertical landing page and sections |
| 22 | `src/pages/healthcare/components/Navbar.tsx` | `src/portals/public/components/healthcare/Navbar.tsx` | Public healthcare industry vertical landing page and sections |
| 23 | `src/pages/healthcare/components/PlatformCapabilities.tsx` | `src/portals/public/components/healthcare/PlatformCapabilities.tsx` | Public healthcare industry vertical landing page and sections |
| 24 | `src/pages/healthcare/components/SecurityCompliance.tsx` | `src/portals/public/components/healthcare/SecurityCompliance.tsx` | Public healthcare industry vertical landing page and sections |
| 25 | `src/pages/healthcare/components/StatsGrid.tsx` | `src/portals/public/components/healthcare/StatsGrid.tsx` | Public healthcare industry vertical landing page and sections |
| 26 | `src/pages/landing/EnterpriseLanding.tsx` | `src/portals/public/pages/EnterpriseLanding.tsx` | Public enterprise landing page and section components |
| 27 | `src/pages/landing/components/AIShowcase.tsx` | `src/portals/public/components/landing/AIShowcase.tsx` | Public enterprise landing page and section components |
| 28 | `src/pages/landing/components/AnalyticsSection.tsx` | `src/portals/public/components/landing/AnalyticsSection.tsx` | Public enterprise landing page and section components |
| 29 | `src/pages/landing/components/EnterpriseFeatures.tsx` | `src/portals/public/components/landing/EnterpriseFeatures.tsx` | Public enterprise landing page and section components |
| 30 | `src/pages/landing/components/FAQAccordion.tsx` | `src/portals/public/components/landing/FAQAccordion.tsx` | Public enterprise landing page and section components |
| 31 | `src/pages/landing/components/FinalCTA.tsx` | `src/portals/public/components/landing/FinalCTA.tsx` | Public enterprise landing page and section components |
| 32 | `src/pages/landing/components/Footer.tsx` | `src/portals/public/components/landing/Footer.tsx` | Public enterprise landing page and section components |
| 33 | `src/pages/landing/components/Hero.tsx` | `src/portals/public/components/landing/Hero.tsx` | Public enterprise landing page and section components |
| 34 | `src/pages/landing/components/IndustrySolutions.tsx` | `src/portals/public/components/landing/IndustrySolutions.tsx` | Public enterprise landing page and section components |
| 35 | `src/pages/landing/components/Navbar.tsx` | `src/portals/public/components/landing/Navbar.tsx` | Public enterprise landing page and section components |
| 36 | `src/pages/landing/components/PlatformModules.tsx` | `src/portals/public/components/landing/PlatformModules.tsx` | Public enterprise landing page and section components |
| 37 | `src/pages/landing/components/PricingSection.tsx` | `src/portals/public/components/landing/PricingSection.tsx` | Public enterprise landing page and section components |
| 38 | `src/pages/landing/components/ResourcesSection.tsx` | `src/portals/public/components/landing/ResourcesSection.tsx` | Public enterprise landing page and section components |
| 39 | `src/pages/landing/components/SecurityArchitecture.tsx` | `src/portals/public/components/landing/SecurityArchitecture.tsx` | Public enterprise landing page and section components |
| 40 | `src/pages/landing/components/Testimonials.tsx` | `src/portals/public/components/landing/Testimonials.tsx` | Public enterprise landing page and section components |
| 41 | `src/pages/landing/components/TrustStats.tsx` | `src/portals/public/components/landing/TrustStats.tsx` | Public enterprise landing page and section components |
| 42 | `src/pages/light/LightLanding.tsx` | `src/portals/public/pages/LightLanding.tsx` | Public marketing landing page |
| 43 | `src/pages/onboarding/FirstLoginWizard.tsx` | `src/portals/public/pages/auth/FirstLoginWizard.tsx` | Public authentication / onboarding entrypoint |
| 44 | `src/pages/phase1/Phase1Landing.tsx` | `src/portals/public/pages/Phase1Landing.tsx` | Public executive showcase landing page and components |
| 45 | `src/pages/phase1/components/AzureNavbar.tsx` | `src/portals/public/components/phase1/AzureNavbar.tsx` | Public executive showcase landing page and components |
| 46 | `src/pages/phase1/components/EnterpriseTrustBar.tsx` | `src/portals/public/components/phase1/EnterpriseTrustBar.tsx` | Public executive showcase landing page and components |
| 47 | `src/pages/phase1/components/EnterpriseValueCards.tsx` | `src/portals/public/components/phase1/EnterpriseValueCards.tsx` | Public executive showcase landing page and components |
| 48 | `src/pages/phase1/components/HeroExecutive.tsx` | `src/portals/public/components/phase1/HeroExecutive.tsx` | Public executive showcase landing page and components |

### 4.2 Student Portal (`src/portals/student/`) — 32 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/portals/student/StudentCertificates.tsx` | `src/portals/student/pages/StudentCertificates.tsx` | Student portal exam runner, results, practice, and profile |
| 2 | `src/portals/student/StudentCourses.tsx` | `src/portals/student/pages/StudentCourses.tsx` | Student portal exam runner, results, practice, and profile |
| 3 | `src/portals/student/StudentDashboard.tsx` | `src/portals/student/pages/StudentDashboard.tsx` | Student portal exam runner, results, practice, and profile |
| 4 | `src/portals/student/StudentExamRunner.tsx` | `src/portals/student/pages/StudentExamRunner.tsx` | Student portal exam runner, results, practice, and profile |
| 5 | `src/portals/student/StudentLanding.tsx` | `src/portals/student/pages/StudentLanding.tsx` | Student portal exam runner, results, practice, and profile |
| 6 | `src/portals/student/StudentPlacement.tsx` | `src/portals/student/pages/StudentPlacement.tsx` | Student portal exam runner, results, practice, and profile |
| 7 | `src/portals/student/StudentPractice.tsx` | `src/portals/student/pages/StudentPractice.tsx` | Student portal exam runner, results, practice, and profile |
| 8 | `src/portals/student/StudentResults.tsx` | `src/portals/student/pages/StudentResults.tsx` | Student portal exam runner, results, practice, and profile |
| 9 | `src/portals/student/StudentScheduledExams.tsx` | `src/portals/student/pages/StudentScheduledExams.tsx` | Student portal exam runner, results, practice, and profile |
| 10 | `src/portals/student/StudentSettings.tsx` | `src/portals/student/pages/StudentSettings.tsx` | Student portal exam runner, results, practice, and profile |
| 11 | `src/portals/student/auth/StudentAccountRecovery.tsx` | `src/portals/student/pages/auth/StudentAccountRecovery.tsx` | Student portal exam runner, results, practice, and profile |
| 12 | `src/portals/student/auth/StudentAuthLayout.tsx` | `src/portals/student/layout/StudentAuthLayout.tsx` | Student portal exam runner, results, practice, and profile |
| 13 | `src/portals/student/auth/StudentForgotPassword.tsx` | `src/portals/student/pages/auth/StudentForgotPassword.tsx` | Student portal exam runner, results, practice, and profile |
| 14 | `src/portals/student/auth/StudentLogin.tsx` | `src/portals/student/pages/auth/StudentLogin.tsx` | Student portal exam runner, results, practice, and profile |
| 15 | `src/portals/student/auth/StudentMFA.tsx` | `src/portals/student/pages/auth/StudentMFA.tsx` | Student portal exam runner, results, practice, and profile |
| 16 | `src/portals/student/auth/StudentRegister.tsx` | `src/portals/student/pages/auth/StudentRegister.tsx` | Student portal exam runner, results, practice, and profile |
| 17 | `src/portals/student/auth/StudentResetPassword.tsx` | `src/portals/student/pages/auth/StudentResetPassword.tsx` | Student portal exam runner, results, practice, and profile |
| 18 | `src/portals/student/auth/StudentVerifyEmail.tsx` | `src/portals/student/pages/auth/StudentVerifyEmail.tsx` | Student portal exam runner, results, practice, and profile |
| 19 | `src/portals/student/profile/StudentProfileAcademic.tsx` | `src/portals/student/pages/profile/StudentProfileAcademic.tsx` | Student portal exam runner, results, practice, and profile |
| 20 | `src/portals/student/profile/StudentProfileContact.tsx` | `src/portals/student/pages/profile/StudentProfileContact.tsx` | Student portal exam runner, results, practice, and profile |
| 21 | `src/portals/student/profile/StudentProfileEdit.tsx` | `src/portals/student/pages/profile/StudentProfileEdit.tsx` | Student portal exam runner, results, practice, and profile |
| 22 | `src/portals/student/profile/StudentProfileEmergency.tsx` | `src/portals/student/pages/profile/StudentProfileEmergency.tsx` | Student portal exam runner, results, practice, and profile |
| 23 | `src/portals/student/profile/StudentProfileGuardian.tsx` | `src/portals/student/pages/profile/StudentProfileGuardian.tsx` | Student portal exam runner, results, practice, and profile |
| 24 | `src/portals/student/profile/StudentProfileOverview.tsx` | `src/portals/student/pages/profile/StudentProfileOverview.tsx` | Student portal exam runner, results, practice, and profile |
| 25 | `src/portals/student/profile/StudentProfilePersonal.tsx` | `src/portals/student/pages/profile/StudentProfilePersonal.tsx` | Student portal exam runner, results, practice, and profile |
| 26 | `src/portals/student/profile/StudentProfilePreferences.tsx` | `src/portals/student/pages/profile/StudentProfilePreferences.tsx` | Student portal exam runner, results, practice, and profile |
| 27 | `src/portals/student/profile/StudentProfilePrivacy.tsx` | `src/portals/student/pages/profile/StudentProfilePrivacy.tsx` | Student portal exam runner, results, practice, and profile |
| 28 | `src/portals/student/shell/StudentCommandPalette.tsx` | `src/portals/student/components/StudentCommandPalette.tsx` | Student portal exam runner, results, practice, and profile |
| 29 | `src/portals/student/shell/StudentFooter.tsx` | `src/portals/student/layout/StudentFooter.tsx` | Student portal exam runner, results, practice, and profile |
| 30 | `src/portals/student/shell/StudentHeader.tsx` | `src/portals/student/layout/StudentHeader.tsx` | Student portal exam runner, results, practice, and profile |
| 31 | `src/portals/student/shell/StudentLayout.tsx` | `src/portals/student/layout/StudentLayout.tsx` | Student portal exam runner, results, practice, and profile |
| 32 | `src/portals/student/shell/StudentSidebar.tsx` | `src/portals/student/layout/StudentSidebar.tsx` | Student portal exam runner, results, practice, and profile |

### 4.3 Faculty Portal (`src/portals/faculty/`) — 7 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/portals/faculty/FacultyAnalytics.tsx` | `src/portals/faculty/pages/FacultyAnalytics.tsx` | Faculty exam authoring, question bank, and grading analytics |
| 2 | `src/portals/faculty/FacultyDashboard.tsx` | `src/portals/faculty/pages/FacultyDashboard.tsx` | Faculty exam authoring, question bank, and grading analytics |
| 3 | `src/portals/faculty/FacultyExamBuilder.tsx` | `src/portals/faculty/pages/FacultyExamBuilder.tsx` | Faculty exam authoring, question bank, and grading analytics |
| 4 | `src/portals/faculty/FacultyLanding.tsx` | `src/portals/faculty/pages/FacultyLanding.tsx` | Faculty exam authoring, question bank, and grading analytics |
| 5 | `src/portals/faculty/FacultyQuestionBank.tsx` | `src/portals/faculty/pages/FacultyQuestionBank.tsx` | Faculty exam authoring, question bank, and grading analytics |
| 6 | `src/portals/faculty/auth/FacultyLogin.tsx` | `src/portals/faculty/pages/auth/FacultyLogin.tsx` | Faculty exam authoring, question bank, and grading analytics |
| 7 | `src/portals/faculty/shell/FacultyLayout.tsx` | `src/portals/faculty/layout/FacultyLayout.tsx` | Faculty exam authoring, question bank, and grading analytics |

### 4.4 Invigilator Portal (`src/portals/invigilator/`) — 6 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/portals/invigilator/InvigilatorDashboard.tsx` | `src/portals/invigilator/pages/InvigilatorDashboard.tsx` | Invigilator live exam proctoring grid and incident room |
| 2 | `src/portals/invigilator/InvigilatorIncidents.tsx` | `src/portals/invigilator/pages/InvigilatorIncidents.tsx` | Invigilator live exam proctoring grid and incident room |
| 3 | `src/portals/invigilator/InvigilatorLanding.tsx` | `src/portals/invigilator/pages/InvigilatorLanding.tsx` | Invigilator live exam proctoring grid and incident room |
| 4 | `src/portals/invigilator/InvigilatorLiveGrid.tsx` | `src/portals/invigilator/pages/InvigilatorLiveGrid.tsx` | Invigilator live exam proctoring grid and incident room |
| 5 | `src/portals/invigilator/auth/InvigilatorLogin.tsx` | `src/portals/invigilator/pages/auth/InvigilatorLogin.tsx` | Invigilator live exam proctoring grid and incident room |
| 6 | `src/portals/invigilator/shell/InvigilatorLayout.tsx` | `src/portals/invigilator/layout/InvigilatorLayout.tsx` | Invigilator live exam proctoring grid and incident room |

### 4.5 Organization Admin Portal (`src/portals/org-admin/`) — 16 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/components/organization/HierarchyExplorer.tsx` | `src/portals/org-admin/components/HierarchyExplorer.tsx` | Organization admin hierarchy explorer and invite modal |
| 2 | `src/components/organization/InvitationModal.tsx` | `src/portals/org-admin/components/InvitationModal.tsx` | Organization admin hierarchy explorer and invite modal |
| 3 | `src/pages/Users.tsx` | `src/portals/org-admin/pages/Users.tsx` | Organization user management and RBAC directory |
| 4 | `src/pages/organization/BrandingSettings.tsx` | `src/portals/org-admin/pages/BrandingSettings.tsx` | Organization admin campus, department, and workspace management |
| 5 | `src/pages/organization/CampusManagement.tsx` | `src/portals/org-admin/pages/CampusManagement.tsx` | Organization admin campus, department, and workspace management |
| 6 | `src/pages/organization/DepartmentManagement.tsx` | `src/portals/org-admin/pages/DepartmentManagement.tsx` | Organization admin campus, department, and workspace management |
| 7 | `src/pages/organization/InvitationCenter.tsx` | `src/portals/org-admin/pages/InvitationCenter.tsx` | Organization admin campus, department, and workspace management |
| 8 | `src/pages/organization/OrganizationDashboard.tsx` | `src/portals/org-admin/pages/OrganizationDashboard.tsx` | Organization admin campus, department, and workspace management |
| 9 | `src/pages/organization/ProgramManagement.tsx` | `src/portals/org-admin/pages/ProgramManagement.tsx` | Organization admin campus, department, and workspace management |
| 10 | `src/pages/organization/WorkspaceManagement.tsx` | `src/portals/org-admin/pages/WorkspaceManagement.tsx` | Organization admin campus, department, and workspace management |
| 11 | `src/pages/organization/WorkspaceSettings.tsx` | `src/portals/org-admin/pages/WorkspaceSettings.tsx` | Organization admin campus, department, and workspace management |
| 12 | `src/portals/org-admin/OrgAdminAssessments.tsx` | `src/portals/org-admin/pages/OrgAdminAssessments.tsx` | Organization admin portal layout, structure, and users |
| 13 | `src/portals/org-admin/OrgAdminStructure.tsx` | `src/portals/org-admin/pages/OrgAdminStructure.tsx` | Organization admin portal layout, structure, and users |
| 14 | `src/portals/org-admin/OrgAdminUsers.tsx` | `src/portals/org-admin/pages/OrgAdminUsers.tsx` | Organization admin portal layout, structure, and users |
| 15 | `src/portals/org-admin/auth/OrgAdminLogin.tsx` | `src/portals/org-admin/pages/auth/OrgAdminLogin.tsx` | Organization admin portal layout, structure, and users |
| 16 | `src/portals/org-admin/shell/OrgAdminLayout.tsx` | `src/portals/org-admin/layout/OrgAdminLayout.tsx` | Organization admin portal layout, structure, and users |

### 4.6 Super Admin Portal (`src/portals/super-admin/`) — 16 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/pages/admin/PermissionsPage.tsx` | `src/portals/super-admin/pages/PermissionsPage.tsx` | Super admin governance, roles, permissions, policies |
| 2 | `src/pages/admin/PoliciesPage.tsx` | `src/portals/super-admin/pages/PoliciesPage.tsx` | Super admin governance, roles, permissions, policies |
| 3 | `src/pages/admin/ProductionDashboard.tsx` | `src/portals/super-admin/pages/ProductionDashboard.tsx` | Super admin governance, roles, permissions, policies |
| 4 | `src/pages/admin/RolesPage.tsx` | `src/portals/super-admin/pages/RolesPage.tsx` | Super admin governance, roles, permissions, policies |
| 5 | `src/pages/developer/IntegrationsPage.tsx` | `src/portals/super-admin/pages/IntegrationsPage.tsx` | Super admin developer integrations, webhooks, job queues |
| 6 | `src/pages/developer/JobQueuePage.tsx` | `src/portals/super-admin/pages/JobQueuePage.tsx` | Super admin developer integrations, webhooks, job queues |
| 7 | `src/pages/developer/WebhooksPage.tsx` | `src/portals/super-admin/pages/WebhooksPage.tsx` | Super admin developer integrations, webhooks, job queues |
| 8 | `src/pages/security/CompliancePage.tsx` | `src/portals/super-admin/pages/CompliancePage.tsx` | Super admin security center & compliance audit |
| 9 | `src/pages/security/SecurityCenterPage.tsx` | `src/portals/super-admin/pages/SecurityCenterPage.tsx` | Super admin security center & compliance audit |
| 10 | `src/portals/admin/AdminDashboard.tsx` | `src/portals/super-admin/pages/AdminDashboard.tsx` | Super admin platform dashboard |
| 11 | `src/portals/admin/AdminLanding.tsx` | `src/portals/super-admin/pages/AdminLanding.tsx` | Super admin platform dashboard |
| 12 | `src/portals/super-admin/SuperAdminPlatform.tsx` | `src/portals/super-admin/pages/SuperAdminPlatform.tsx` | Super admin portal platform, tenants, and security |
| 13 | `src/portals/super-admin/SuperAdminSecurity.tsx` | `src/portals/super-admin/pages/SuperAdminSecurity.tsx` | Super admin portal platform, tenants, and security |
| 14 | `src/portals/super-admin/SuperAdminTenants.tsx` | `src/portals/super-admin/pages/SuperAdminTenants.tsx` | Super admin portal platform, tenants, and security |
| 15 | `src/portals/super-admin/auth/SuperAdminLogin.tsx` | `src/portals/super-admin/pages/auth/SuperAdminLogin.tsx` | Super admin portal platform, tenants, and security |
| 16 | `src/portals/super-admin/shell/SuperAdminLayout.tsx` | `src/portals/super-admin/layout/SuperAdminLayout.tsx` | Super admin portal platform, tenants, and security |

### 4.7 Coding Assessment Portal (`src/portals/coding/`) — 19 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/components/coding/CandidateActivityStream.tsx` | `src/portals/coding/components/CandidateActivityStream.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 2 | `src/components/coding/CodingDashboardHeader.tsx` | `src/portals/coding/components/CodingDashboardHeader.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 3 | `src/components/coding/CodingModals.tsx` | `src/portals/coding/components/CodingModals.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 4 | `src/components/coding/ExecutionInfrastructureCard.tsx` | `src/portals/coding/components/ExecutionInfrastructureCard.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 5 | `src/components/coding/ExecutionOverviewSection.tsx` | `src/portals/coding/components/ExecutionOverviewSection.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 6 | `src/components/coding/ExecutiveMetricsGrid.tsx` | `src/portals/coding/components/ExecutiveMetricsGrid.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 7 | `src/components/coding/GlobalSearchFilterBar.tsx` | `src/portals/coding/components/GlobalSearchFilterBar.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 8 | `src/components/coding/LanguageDistributionGrid.tsx` | `src/portals/coding/components/LanguageDistributionGrid.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 9 | `src/components/coding/ProblemRepositoryOverview.tsx` | `src/portals/coding/components/ProblemRepositoryOverview.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 10 | `src/components/coding/QuickActionsGrid.tsx` | `src/portals/coding/components/QuickActionsGrid.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 11 | `src/components/coding/RecentActivityTimeline.tsx` | `src/portals/coding/components/RecentActivityTimeline.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 12 | `src/components/coding/RecentCodingExamsTable.tsx` | `src/portals/coding/components/RecentCodingExamsTable.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 13 | `src/components/coding/RecentNotificationsPanel.tsx` | `src/portals/coding/components/RecentNotificationsPanel.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 14 | `src/components/coding/SubmissionAnalyticsSection.tsx` | `src/portals/coding/components/SubmissionAnalyticsSection.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 15 | `src/components/coding/SystemHealthMatrix.tsx` | `src/portals/coding/components/SystemHealthMatrix.tsx` | Coding portal component (metrics, problem bank, submissions) |
| 16 | `src/hooks/useCodingDashboard.ts` | `src/portals/coding/hooks/useCodingDashboard.ts` | Coding dashboard data query hook |
| 17 | `src/pages/coding/CodingDashboard.tsx` | `src/portals/coding/pages/CodingDashboard.tsx` | Coding assessment hub dashboard |
| 18 | `src/portals/coding/auth/CodingLogin.tsx` | `src/portals/coding/pages/auth/CodingLogin.tsx` | Dedicated coding assessment candidate login |
| 19 | `src/types/codingDashboard.ts` | `src/portals/coding/types/codingDashboard.ts` | Coding dashboard TypeScript interfaces |

### 4.8 Operations Portal (`src/portals/operations/`) — 1 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/modules/enterprise-operations/EnterpriseCommandCenter.tsx` | `src/portals/operations/pages/EnterpriseCommandCenter.tsx` | Enterprise command center operations dashboard |

### 4.9 Evaluation & Security Engines (`src/engines/`) — 263 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/components/proctoring/attention/AttentionContext.tsx` | `src/engines/proctoring/attention/AttentionContext.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 2 | `src/components/proctoring/attention/AttentionEngine.tsx` | `src/engines/proctoring/attention/AttentionEngine.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 3 | `src/components/proctoring/attention/AttentionStatusCard.tsx` | `src/engines/proctoring/attention/AttentionStatusCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 4 | `src/components/proctoring/attention/AttentionTimeline.tsx` | `src/engines/proctoring/attention/AttentionTimeline.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 5 | `src/components/proctoring/attention/BlinkMonitor.tsx` | `src/engines/proctoring/attention/BlinkMonitor.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 6 | `src/components/proctoring/attention/EyeTrackingPanel.tsx` | `src/engines/proctoring/attention/EyeTrackingPanel.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 7 | `src/components/proctoring/attention/GazeCompass.tsx` | `src/engines/proctoring/attention/GazeCompass.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 8 | `src/components/proctoring/attention/HeadMovementCard.tsx` | `src/engines/proctoring/attention/HeadMovementCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 9 | `src/components/proctoring/attention/HeadPosePanel.tsx` | `src/engines/proctoring/attention/HeadPosePanel.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 10 | `src/components/proctoring/attention/LookingAwayCard.tsx` | `src/engines/proctoring/attention/LookingAwayCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 11 | `src/components/proctoring/attention/constants/attention.constants.ts` | `src/engines/proctoring/attention/constants/attention.constants.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 12 | `src/components/proctoring/attention/hooks/useAttention.ts` | `src/engines/proctoring/attention/hooks/useAttention.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 13 | `src/components/proctoring/attention/hooks/useEyeTracking.ts` | `src/engines/proctoring/attention/hooks/useEyeTracking.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 14 | `src/components/proctoring/attention/hooks/useHeadPose.ts` | `src/engines/proctoring/attention/hooks/useHeadPose.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 15 | `src/components/proctoring/attention/services/attention.service.ts` | `src/engines/proctoring/attention/services/attention.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 16 | `src/components/proctoring/attention/services/eyeTracking.service.ts` | `src/engines/proctoring/attention/services/eyeTracking.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 17 | `src/components/proctoring/attention/services/headPose.service.ts` | `src/engines/proctoring/attention/services/headPose.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 18 | `src/components/proctoring/attention/tests/AttentionEngine.test.tsx` | `src/engines/proctoring/attention/tests/AttentionEngine.test.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 19 | `src/components/proctoring/attention/types/attention.types.ts` | `src/engines/proctoring/attention/types/attention.types.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 20 | `src/components/proctoring/audio/AudioContext.tsx` | `src/engines/proctoring/audio/AudioContext.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 21 | `src/components/proctoring/audio/AudioEngine.tsx` | `src/engines/proctoring/audio/AudioEngine.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 22 | `src/components/proctoring/audio/AudioHealthCard.tsx` | `src/engines/proctoring/audio/AudioHealthCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 23 | `src/components/proctoring/audio/AudioLevelMeter.tsx` | `src/engines/proctoring/audio/AudioLevelMeter.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 24 | `src/components/proctoring/audio/AudioStatusCard.tsx` | `src/engines/proctoring/audio/AudioStatusCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 25 | `src/components/proctoring/audio/AudioTimeline.tsx` | `src/engines/proctoring/audio/AudioTimeline.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 26 | `src/components/proctoring/audio/BackgroundNoiseCard.tsx` | `src/engines/proctoring/audio/BackgroundNoiseCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 27 | `src/components/proctoring/audio/MicrophoneSelector.tsx` | `src/engines/proctoring/audio/MicrophoneSelector.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 28 | `src/components/proctoring/audio/VoiceActivityPanel.tsx` | `src/engines/proctoring/audio/VoiceActivityPanel.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 29 | `src/components/proctoring/audio/constants/audio.constants.ts` | `src/engines/proctoring/audio/constants/audio.constants.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 30 | `src/components/proctoring/audio/hooks/useAudio.ts` | `src/engines/proctoring/audio/hooks/useAudio.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 31 | `src/components/proctoring/audio/hooks/useMicrophone.ts` | `src/engines/proctoring/audio/hooks/useMicrophone.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 32 | `src/components/proctoring/audio/services/audio.service.ts` | `src/engines/proctoring/audio/services/audio.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 33 | `src/components/proctoring/audio/services/noiseAnalysis.service.ts` | `src/engines/proctoring/audio/services/noiseAnalysis.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 34 | `src/components/proctoring/audio/services/voiceActivity.service.ts` | `src/engines/proctoring/audio/services/voiceActivity.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 35 | `src/components/proctoring/audio/tests/AudioEngine.test.tsx` | `src/engines/proctoring/audio/tests/AudioEngine.test.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 36 | `src/components/proctoring/audio/types/audio.types.ts` | `src/engines/proctoring/audio/types/audio.types.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 37 | `src/components/proctoring/camera/CameraContext.tsx` | `src/engines/proctoring/camera/CameraContext.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 38 | `src/components/proctoring/camera/CameraHealthCard.tsx` | `src/engines/proctoring/camera/CameraHealthCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 39 | `src/components/proctoring/camera/CameraManager.tsx` | `src/engines/proctoring/camera/CameraManager.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 40 | `src/components/proctoring/camera/CameraPreview.tsx` | `src/engines/proctoring/camera/CameraPreview.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 41 | `src/components/proctoring/camera/CameraSelector.tsx` | `src/engines/proctoring/camera/CameraSelector.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 42 | `src/components/proctoring/camera/CameraStatus.tsx` | `src/engines/proctoring/camera/CameraStatus.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 43 | `src/components/proctoring/camera/CameraVerificationWizard.tsx` | `src/engines/proctoring/camera/CameraVerificationWizard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 44 | `src/components/proctoring/camera/DeviceInformation.tsx` | `src/engines/proctoring/camera/DeviceInformation.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 45 | `src/components/proctoring/camera/PermissionBanner.tsx` | `src/engines/proctoring/camera/PermissionBanner.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 46 | `src/components/proctoring/camera/ResolutionCard.tsx` | `src/engines/proctoring/camera/ResolutionCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 47 | `src/components/proctoring/camera/VideoCanvas.tsx` | `src/engines/proctoring/camera/VideoCanvas.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 48 | `src/components/proctoring/camera/constants/camera.constants.ts` | `src/engines/proctoring/camera/constants/camera.constants.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 49 | `src/components/proctoring/camera/hooks/useCamera.ts` | `src/engines/proctoring/camera/hooks/useCamera.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 50 | `src/components/proctoring/camera/hooks/useCameraDevices.ts` | `src/engines/proctoring/camera/hooks/useCameraDevices.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 51 | `src/components/proctoring/camera/hooks/useVideoStream.ts` | `src/engines/proctoring/camera/hooks/useVideoStream.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 52 | `src/components/proctoring/camera/services/camera.service.ts` | `src/engines/proctoring/camera/services/camera.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 53 | `src/components/proctoring/camera/tests/CameraManager.test.tsx` | `src/engines/proctoring/camera/tests/CameraManager.test.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 54 | `src/components/proctoring/camera/types/camera.types.ts` | `src/engines/proctoring/camera/types/camera.types.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 55 | `src/components/proctoring/consent/ConsentCard.tsx` | `src/engines/proctoring/consent/ConsentCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 56 | `src/components/proctoring/consent/ConsentCheckbox.tsx` | `src/engines/proctoring/consent/ConsentCheckbox.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 57 | `src/components/proctoring/consent/ConsentContext.tsx` | `src/engines/proctoring/consent/ConsentContext.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 58 | `src/components/proctoring/consent/ConsentFooter.tsx` | `src/engines/proctoring/consent/ConsentFooter.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 59 | `src/components/proctoring/consent/ConsentManager.tsx` | `src/engines/proctoring/consent/ConsentManager.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 60 | `src/components/proctoring/consent/ConsentModal.tsx` | `src/engines/proctoring/consent/ConsentModal.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 61 | `src/components/proctoring/consent/ConsentSummary.tsx` | `src/engines/proctoring/consent/ConsentSummary.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 62 | `src/components/proctoring/consent/PermissionRequest.tsx` | `src/engines/proctoring/consent/PermissionRequest.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 63 | `src/components/proctoring/consent/PolicyAgreement.tsx` | `src/engines/proctoring/consent/PolicyAgreement.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 64 | `src/components/proctoring/consent/PreExamPermissionModal.tsx` | `src/engines/proctoring/consent/PreExamPermissionModal.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 65 | `src/components/proctoring/consent/PrivacyNotice.tsx` | `src/engines/proctoring/consent/PrivacyNotice.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 66 | `src/components/proctoring/consent/constants/consent.constants.ts` | `src/engines/proctoring/consent/constants/consent.constants.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 67 | `src/components/proctoring/consent/hooks/useConsent.ts` | `src/engines/proctoring/consent/hooks/useConsent.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 68 | `src/components/proctoring/consent/services/consent.service.ts` | `src/engines/proctoring/consent/services/consent.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 69 | `src/components/proctoring/consent/tests/ConsentManager.test.tsx` | `src/engines/proctoring/consent/tests/ConsentManager.test.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 70 | `src/components/proctoring/consent/types/consent.types.ts` | `src/engines/proctoring/consent/types/consent.types.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 71 | `src/components/proctoring/face/FaceBoundingBox.tsx` | `src/engines/proctoring/face/FaceBoundingBox.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 72 | `src/components/proctoring/face/FaceContext.tsx` | `src/engines/proctoring/face/FaceContext.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 73 | `src/components/proctoring/face/FaceDetectionPanel.tsx` | `src/engines/proctoring/face/FaceDetectionPanel.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 74 | `src/components/proctoring/face/FaceEngine.tsx` | `src/engines/proctoring/face/FaceEngine.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 75 | `src/components/proctoring/face/FacePresenceCard.tsx` | `src/engines/proctoring/face/FacePresenceCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 76 | `src/components/proctoring/face/FaceQualityCard.tsx` | `src/engines/proctoring/face/FaceQualityCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 77 | `src/components/proctoring/face/FaceStatus.tsx` | `src/engines/proctoring/face/FaceStatus.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 78 | `src/components/proctoring/face/FaceVerificationWizard.tsx` | `src/engines/proctoring/face/FaceVerificationWizard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 79 | `src/components/proctoring/face/MultipleFaceAlert.tsx` | `src/engines/proctoring/face/MultipleFaceAlert.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 80 | `src/components/proctoring/face/VerificationHistory.tsx` | `src/engines/proctoring/face/VerificationHistory.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 81 | `src/components/proctoring/face/constants/face.constants.ts` | `src/engines/proctoring/face/constants/face.constants.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 82 | `src/components/proctoring/face/hooks/useFace.ts` | `src/engines/proctoring/face/hooks/useFace.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 83 | `src/components/proctoring/face/hooks/useFaceDetection.ts` | `src/engines/proctoring/face/hooks/useFaceDetection.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 84 | `src/components/proctoring/face/hooks/useFacePresence.ts` | `src/engines/proctoring/face/hooks/useFacePresence.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 85 | `src/components/proctoring/face/hooks/useFaceVerification.ts` | `src/engines/proctoring/face/hooks/useFaceVerification.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 86 | `src/components/proctoring/face/services/face.service.ts` | `src/engines/proctoring/face/services/face.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 87 | `src/components/proctoring/face/services/faceVerification.service.ts` | `src/engines/proctoring/face/services/faceVerification.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 88 | `src/components/proctoring/face/tests/FaceEngine.test.tsx` | `src/engines/proctoring/face/tests/FaceEngine.test.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 89 | `src/components/proctoring/face/types/face.types.ts` | `src/engines/proctoring/face/types/face.types.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 90 | `src/components/proctoring/object-detection/DetectedObjectsCard.tsx` | `src/engines/proctoring/object-detection/DetectedObjectsCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 91 | `src/components/proctoring/object-detection/DetectionConfidenceCard.tsx` | `src/engines/proctoring/object-detection/DetectionConfidenceCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 92 | `src/components/proctoring/object-detection/DetectionOverlay.tsx` | `src/engines/proctoring/object-detection/DetectionOverlay.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 93 | `src/components/proctoring/object-detection/DetectionTimeline.tsx` | `src/engines/proctoring/object-detection/DetectionTimeline.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 94 | `src/components/proctoring/object-detection/ObjectDetectionContext.tsx` | `src/engines/proctoring/object-detection/ObjectDetectionContext.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 95 | `src/components/proctoring/object-detection/ObjectDetectionEngine.tsx` | `src/engines/proctoring/object-detection/ObjectDetectionEngine.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 96 | `src/components/proctoring/object-detection/ObjectDetectionPanel.tsx` | `src/engines/proctoring/object-detection/ObjectDetectionPanel.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 97 | `src/components/proctoring/object-detection/PolicyIndicator.tsx` | `src/engines/proctoring/object-detection/PolicyIndicator.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 98 | `src/components/proctoring/object-detection/constants/object.constants.ts` | `src/engines/proctoring/object-detection/constants/object.constants.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 99 | `src/components/proctoring/object-detection/hooks/useObjectDetection.ts` | `src/engines/proctoring/object-detection/hooks/useObjectDetection.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 100 | `src/components/proctoring/object-detection/hooks/useObjectDetectionEngine.ts` | `src/engines/proctoring/object-detection/hooks/useObjectDetectionEngine.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 101 | `src/components/proctoring/object-detection/hooks/useObjectTracker.ts` | `src/engines/proctoring/object-detection/hooks/useObjectTracker.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 102 | `src/components/proctoring/object-detection/services/objectDetection.service.ts` | `src/engines/proctoring/object-detection/services/objectDetection.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 103 | `src/components/proctoring/object-detection/services/objectTracking.service.ts` | `src/engines/proctoring/object-detection/services/objectTracking.service.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 104 | `src/components/proctoring/object-detection/tests/ObjectDetectionEngine.test.tsx` | `src/engines/proctoring/object-detection/tests/ObjectDetectionEngine.test.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 105 | `src/components/proctoring/object-detection/types/object.types.ts` | `src/engines/proctoring/object-detection/types/object.types.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 106 | `src/components/proctoring/pipeline/ActiveAlertsCard.tsx` | `src/engines/proctoring/pipeline/ActiveAlertsCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 107 | `src/components/proctoring/pipeline/LivePipelineFeed.tsx` | `src/engines/proctoring/pipeline/LivePipelineFeed.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 108 | `src/components/proctoring/pipeline/PipelineContext.tsx` | `src/engines/proctoring/pipeline/PipelineContext.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 109 | `src/components/proctoring/pipeline/PipelineDiagnosticsCard.tsx` | `src/engines/proctoring/pipeline/PipelineDiagnosticsCard.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 110 | `src/components/proctoring/pipeline/PipelineEngine.tsx` | `src/engines/proctoring/pipeline/PipelineEngine.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 111 | `src/components/proctoring/pipeline/RiskDimensionsGrid.tsx` | `src/engines/proctoring/pipeline/RiskDimensionsGrid.tsx` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 112 | `src/components/proctoring/pipeline/hooks/usePipeline.ts` | `src/engines/proctoring/pipeline/hooks/usePipeline.ts` | Multi-modal proctoring AI sensors (face, gaze, audio, head, consent, attention) |
| 113 | `src/modules/browser-integrity-engine/core/BaseModule.ts` | `src/engines/browser-integrity/core/BaseModule.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 114 | `src/modules/browser-integrity-engine/core/BrowserIntegrityEngine.ts` | `src/engines/browser-integrity/core/BrowserIntegrityEngine.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 115 | `src/modules/browser-integrity-engine/core/EventBus.ts` | `src/engines/browser-integrity/core/EventBus.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 116 | `src/modules/browser-integrity-engine/core/SessionManager.ts` | `src/engines/browser-integrity/core/SessionManager.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 117 | `src/modules/browser-integrity-engine/core/TelemetryManager.ts` | `src/engines/browser-integrity/core/TelemetryManager.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 118 | `src/modules/browser-integrity-engine/index.ts` | `src/engines/browser-integrity/index.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 119 | `src/modules/browser-integrity-engine/monitors/AnswerBehaviorMonitor.ts` | `src/engines/browser-integrity/monitors/AnswerBehaviorMonitor.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 120 | `src/modules/browser-integrity-engine/monitors/BrowserFingerprintMonitor.ts` | `src/engines/browser-integrity/monitors/BrowserFingerprintMonitor.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 121 | `src/modules/browser-integrity-engine/monitors/ClipboardMonitor.ts` | `src/engines/browser-integrity/monitors/ClipboardMonitor.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 122 | `src/modules/browser-integrity-engine/monitors/DOMOverlayScanner.ts` | `src/engines/browser-integrity/monitors/DOMOverlayScanner.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 123 | `src/modules/browser-integrity-engine/monitors/DevToolsMonitor.ts` | `src/engines/browser-integrity/monitors/DevToolsMonitor.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 124 | `src/modules/browser-integrity-engine/monitors/EnvironmentMonitor.ts` | `src/engines/browser-integrity/monitors/EnvironmentMonitor.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 125 | `src/modules/browser-integrity-engine/monitors/FocusMonitor.ts` | `src/engines/browser-integrity/monitors/FocusMonitor.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 126 | `src/modules/browser-integrity-engine/monitors/KeyboardAnalyzer.ts` | `src/engines/browser-integrity/monitors/KeyboardAnalyzer.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 127 | `src/modules/browser-integrity-engine/monitors/MouseAnalyzer.ts` | `src/engines/browser-integrity/monitors/MouseAnalyzer.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 128 | `src/modules/browser-integrity-engine/monitors/NetworkMonitor.ts` | `src/engines/browser-integrity/monitors/NetworkMonitor.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 129 | `src/modules/browser-integrity-engine/monitors/ScreenMonitor.ts` | `src/engines/browser-integrity/monitors/ScreenMonitor.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 130 | `src/modules/browser-integrity-engine/tests/Phase2Modules.test.ts` | `src/engines/browser-integrity/tests/Phase2Modules.test.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 131 | `src/modules/browser-integrity-engine/tests/Phase3Modules.test.ts` | `src/engines/browser-integrity/tests/Phase3Modules.test.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 132 | `src/modules/browser-integrity-engine/types/IntegrityEvent.ts` | `src/engines/browser-integrity/types/IntegrityEvent.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 133 | `src/modules/browser-integrity-engine/ui/DashboardUI.ts` | `src/engines/browser-integrity/ui/DashboardUI.ts` | Browser integrity monitor (DOM, DevTools, focus, keyboard, mouse) |
| 134 | `src/modules/exam-security/browser/BrowserEventContext.ts` | `src/engines/exam-security/browser/BrowserEventContext.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 135 | `src/modules/exam-security/browser/BrowserEventManager.ts` | `src/engines/exam-security/browser/BrowserEventManager.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 136 | `src/modules/exam-security/browser/BrowserEventProvider.tsx` | `src/engines/exam-security/browser/BrowserEventProvider.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 137 | `src/modules/exam-security/browser/events/BrowserEvents.ts` | `src/engines/exam-security/browser/events/BrowserEvents.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 138 | `src/modules/exam-security/browser/hooks/useBrowserEvents.ts` | `src/engines/exam-security/browser/hooks/useBrowserEvents.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 139 | `src/modules/exam-security/browser/services/BrowserEventDispatcher.ts` | `src/engines/exam-security/browser/services/BrowserEventDispatcher.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 140 | `src/modules/exam-security/browser/services/BrowserEventListener.ts` | `src/engines/exam-security/browser/services/BrowserEventListener.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 141 | `src/modules/exam-security/browser/tests/BrowserEventManager.test.ts` | `src/engines/exam-security/browser/tests/BrowserEventManager.test.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 142 | `src/modules/exam-security/browser/types/BrowserEvent.ts` | `src/engines/exam-security/browser/types/BrowserEvent.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 143 | `src/modules/exam-security/browser/types/BrowserEventType.ts` | `src/engines/exam-security/browser/types/BrowserEventType.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 144 | `src/modules/exam-security/browser/utils/EventNormalizer.ts` | `src/engines/exam-security/browser/utils/EventNormalizer.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 145 | `src/modules/exam-security/clipboard/ClipboardContext.ts` | `src/engines/exam-security/clipboard/ClipboardContext.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 146 | `src/modules/exam-security/clipboard/ClipboardProtectionEngine.ts` | `src/engines/exam-security/clipboard/ClipboardProtectionEngine.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 147 | `src/modules/exam-security/clipboard/ClipboardProvider.tsx` | `src/engines/exam-security/clipboard/ClipboardProvider.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 148 | `src/modules/exam-security/clipboard/constants/AllowedClipboardActions.ts` | `src/engines/exam-security/clipboard/constants/AllowedClipboardActions.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 149 | `src/modules/exam-security/clipboard/constants/RestrictedClipboardActions.ts` | `src/engines/exam-security/clipboard/constants/RestrictedClipboardActions.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 150 | `src/modules/exam-security/clipboard/events/ClipboardEvents.ts` | `src/engines/exam-security/clipboard/events/ClipboardEvents.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 151 | `src/modules/exam-security/clipboard/hooks/useClipboardProtection.ts` | `src/engines/exam-security/clipboard/hooks/useClipboardProtection.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 152 | `src/modules/exam-security/clipboard/index.ts` | `src/engines/exam-security/clipboard/index.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 153 | `src/modules/exam-security/clipboard/services/ClipboardAnalyticsService.ts` | `src/engines/exam-security/clipboard/services/ClipboardAnalyticsService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 154 | `src/modules/exam-security/clipboard/services/ClipboardDispatcher.ts` | `src/engines/exam-security/clipboard/services/ClipboardDispatcher.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 155 | `src/modules/exam-security/clipboard/services/ClipboardListener.ts` | `src/engines/exam-security/clipboard/services/ClipboardListener.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 156 | `src/modules/exam-security/clipboard/services/ClipboardPolicyService.ts` | `src/engines/exam-security/clipboard/services/ClipboardPolicyService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 157 | `src/modules/exam-security/clipboard/services/CopyProtectionService.ts` | `src/engines/exam-security/clipboard/services/CopyProtectionService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 158 | `src/modules/exam-security/clipboard/services/CutProtectionService.ts` | `src/engines/exam-security/clipboard/services/CutProtectionService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 159 | `src/modules/exam-security/clipboard/services/DragClipboardProtectionService.ts` | `src/engines/exam-security/clipboard/services/DragClipboardProtectionService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 160 | `src/modules/exam-security/clipboard/services/PasteProtectionService.ts` | `src/engines/exam-security/clipboard/services/PasteProtectionService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 161 | `src/modules/exam-security/clipboard/tests/ClipboardEngine.test.ts` | `src/engines/exam-security/clipboard/tests/ClipboardEngine.test.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 162 | `src/modules/exam-security/clipboard/types/ClipboardAction.ts` | `src/engines/exam-security/clipboard/types/ClipboardAction.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 163 | `src/modules/exam-security/clipboard/types/ClipboardEvent.ts` | `src/engines/exam-security/clipboard/types/ClipboardEvent.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 164 | `src/modules/exam-security/clipboard/types/ClipboardViolation.ts` | `src/engines/exam-security/clipboard/types/ClipboardViolation.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 165 | `src/modules/exam-security/clipboard/utils/ClipboardActionParser.ts` | `src/engines/exam-security/clipboard/utils/ClipboardActionParser.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 166 | `src/modules/exam-security/clipboard/utils/ClipboardNormalizer.ts` | `src/engines/exam-security/clipboard/utils/ClipboardNormalizer.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 167 | `src/modules/exam-security/constants/security.constants.ts` | `src/engines/exam-security/constants/security.constants.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 168 | `src/modules/exam-security/core/RestrictionManager.ts` | `src/engines/exam-security/core/RestrictionManager.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 169 | `src/modules/exam-security/events/SecurityEventBus.ts` | `src/engines/exam-security/events/SecurityEventBus.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 170 | `src/modules/exam-security/focus/FocusContext.ts` | `src/engines/exam-security/focus/FocusContext.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 171 | `src/modules/exam-security/focus/FocusEngine.ts` | `src/engines/exam-security/focus/FocusEngine.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 172 | `src/modules/exam-security/focus/FocusProvider.tsx` | `src/engines/exam-security/focus/FocusProvider.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 173 | `src/modules/exam-security/focus/constants/FocusEvents.ts` | `src/engines/exam-security/focus/constants/FocusEvents.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 174 | `src/modules/exam-security/focus/hooks/useFocus.ts` | `src/engines/exam-security/focus/hooks/useFocus.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 175 | `src/modules/exam-security/focus/index.ts` | `src/engines/exam-security/focus/index.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 176 | `src/modules/exam-security/focus/services/FocusAnalyticsService.ts` | `src/engines/exam-security/focus/services/FocusAnalyticsService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 177 | `src/modules/exam-security/focus/services/FocusDispatcher.ts` | `src/engines/exam-security/focus/services/FocusDispatcher.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 178 | `src/modules/exam-security/focus/services/FocusPolicyService.ts` | `src/engines/exam-security/focus/services/FocusPolicyService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 179 | `src/modules/exam-security/focus/services/FocusService.ts` | `src/engines/exam-security/focus/services/FocusService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 180 | `src/modules/exam-security/focus/types/FocusEvent.ts` | `src/engines/exam-security/focus/types/FocusEvent.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 181 | `src/modules/exam-security/focus/types/FocusState.ts` | `src/engines/exam-security/focus/types/FocusState.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 182 | `src/modules/exam-security/focus/utils/FocusNormalizer.ts` | `src/engines/exam-security/focus/utils/FocusNormalizer.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 183 | `src/modules/exam-security/fullscreen/FullscreenContext.ts` | `src/engines/exam-security/fullscreen/FullscreenContext.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 184 | `src/modules/exam-security/fullscreen/FullscreenEngine.ts` | `src/engines/exam-security/fullscreen/FullscreenEngine.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 185 | `src/modules/exam-security/fullscreen/FullscreenProvider.tsx` | `src/engines/exam-security/fullscreen/FullscreenProvider.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 186 | `src/modules/exam-security/fullscreen/components/BrowserSupportDialog.tsx` | `src/engines/exam-security/fullscreen/components/BrowserSupportDialog.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 187 | `src/modules/exam-security/fullscreen/components/FullscreenIndicator.tsx` | `src/engines/exam-security/fullscreen/components/FullscreenIndicator.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 188 | `src/modules/exam-security/fullscreen/components/FullscreenOverlay.tsx` | `src/engines/exam-security/fullscreen/components/FullscreenOverlay.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 189 | `src/modules/exam-security/fullscreen/components/FullscreenPrompt.tsx` | `src/engines/exam-security/fullscreen/components/FullscreenPrompt.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 190 | `src/modules/exam-security/fullscreen/components/FullscreenStatusBadge.tsx` | `src/engines/exam-security/fullscreen/components/FullscreenStatusBadge.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 191 | `src/modules/exam-security/fullscreen/components/RecoveryDialog.tsx` | `src/engines/exam-security/fullscreen/components/RecoveryDialog.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 192 | `src/modules/exam-security/fullscreen/constants/FullscreenEvents.ts` | `src/engines/exam-security/fullscreen/constants/FullscreenEvents.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 193 | `src/modules/exam-security/fullscreen/constants/FullscreenPolicies.ts` | `src/engines/exam-security/fullscreen/constants/FullscreenPolicies.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 194 | `src/modules/exam-security/fullscreen/hooks/useFullscreen.ts` | `src/engines/exam-security/fullscreen/hooks/useFullscreen.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 195 | `src/modules/exam-security/fullscreen/index.ts` | `src/engines/exam-security/fullscreen/index.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 196 | `src/modules/exam-security/fullscreen/services/FullscreenAnalyticsService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenAnalyticsService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 197 | `src/modules/exam-security/fullscreen/services/FullscreenDispatcher.ts` | `src/engines/exam-security/fullscreen/services/FullscreenDispatcher.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 198 | `src/modules/exam-security/fullscreen/services/FullscreenPolicyService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenPolicyService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 199 | `src/modules/exam-security/fullscreen/services/FullscreenRecoveryService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenRecoveryService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 200 | `src/modules/exam-security/fullscreen/services/FullscreenService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 201 | `src/modules/exam-security/fullscreen/services/FullscreenStateService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenStateService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 202 | `src/modules/exam-security/fullscreen/tests/FullscreenEngine.test.ts` | `src/engines/exam-security/fullscreen/tests/FullscreenEngine.test.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 203 | `src/modules/exam-security/fullscreen/types/FullscreenEvent.ts` | `src/engines/exam-security/fullscreen/types/FullscreenEvent.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 204 | `src/modules/exam-security/fullscreen/types/FullscreenPolicy.ts` | `src/engines/exam-security/fullscreen/types/FullscreenPolicy.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 205 | `src/modules/exam-security/fullscreen/types/FullscreenState.ts` | `src/engines/exam-security/fullscreen/types/FullscreenState.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 206 | `src/modules/exam-security/fullscreen/types/FullscreenViolation.ts` | `src/engines/exam-security/fullscreen/types/FullscreenViolation.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 207 | `src/modules/exam-security/fullscreen/utils/BrowserCompatibility.ts` | `src/engines/exam-security/fullscreen/utils/BrowserCompatibility.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 208 | `src/modules/exam-security/fullscreen/utils/FullscreenNormalizer.ts` | `src/engines/exam-security/fullscreen/utils/FullscreenNormalizer.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 209 | `src/modules/exam-security/hooks/useExamSecurity.ts` | `src/engines/exam-security/hooks/useExamSecurity.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 210 | `src/modules/exam-security/index.ts` | `src/engines/exam-security/index.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 211 | `src/modules/exam-security/keyboard/KeyboardContext.ts` | `src/engines/exam-security/keyboard/KeyboardContext.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 212 | `src/modules/exam-security/keyboard/KeyboardProvider.tsx` | `src/engines/exam-security/keyboard/KeyboardProvider.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 213 | `src/modules/exam-security/keyboard/KeyboardRestrictionEngine.ts` | `src/engines/exam-security/keyboard/KeyboardRestrictionEngine.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 214 | `src/modules/exam-security/keyboard/constants/AllowedKeys.ts` | `src/engines/exam-security/keyboard/constants/AllowedKeys.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 215 | `src/modules/exam-security/keyboard/constants/RestrictedKeys.ts` | `src/engines/exam-security/keyboard/constants/RestrictedKeys.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 216 | `src/modules/exam-security/keyboard/events/KeyboardEvents.ts` | `src/engines/exam-security/keyboard/events/KeyboardEvents.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 217 | `src/modules/exam-security/keyboard/hooks/useKeyboardRestrictions.ts` | `src/engines/exam-security/keyboard/hooks/useKeyboardRestrictions.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 218 | `src/modules/exam-security/keyboard/index.ts` | `src/engines/exam-security/keyboard/index.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 219 | `src/modules/exam-security/keyboard/services/KeyboardDispatcher.ts` | `src/engines/exam-security/keyboard/services/KeyboardDispatcher.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 220 | `src/modules/exam-security/keyboard/services/KeyboardListener.ts` | `src/engines/exam-security/keyboard/services/KeyboardListener.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 221 | `src/modules/exam-security/keyboard/services/KeyboardPolicyService.ts` | `src/engines/exam-security/keyboard/services/KeyboardPolicyService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 222 | `src/modules/exam-security/keyboard/tests/KeyboardEngine.test.ts` | `src/engines/exam-security/keyboard/tests/KeyboardEngine.test.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 223 | `src/modules/exam-security/keyboard/types/KeyboardEvent.ts` | `src/engines/exam-security/keyboard/types/KeyboardEvent.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 224 | `src/modules/exam-security/keyboard/types/KeyboardShortcut.ts` | `src/engines/exam-security/keyboard/types/KeyboardShortcut.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 225 | `src/modules/exam-security/keyboard/types/KeyboardViolation.ts` | `src/engines/exam-security/keyboard/types/KeyboardViolation.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 226 | `src/modules/exam-security/keyboard/utils/KeyCombinationParser.ts` | `src/engines/exam-security/keyboard/utils/KeyCombinationParser.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 227 | `src/modules/exam-security/keyboard/utils/ShortcutMatcher.ts` | `src/engines/exam-security/keyboard/utils/ShortcutMatcher.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 228 | `src/modules/exam-security/mouse/MouseContext.ts` | `src/engines/exam-security/mouse/MouseContext.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 229 | `src/modules/exam-security/mouse/MouseProvider.tsx` | `src/engines/exam-security/mouse/MouseProvider.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 230 | `src/modules/exam-security/mouse/MouseRestrictionEngine.ts` | `src/engines/exam-security/mouse/MouseRestrictionEngine.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 231 | `src/modules/exam-security/mouse/constants/AllowedMouseActions.ts` | `src/engines/exam-security/mouse/constants/AllowedMouseActions.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 232 | `src/modules/exam-security/mouse/constants/RestrictedMouseActions.ts` | `src/engines/exam-security/mouse/constants/RestrictedMouseActions.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 233 | `src/modules/exam-security/mouse/events/MouseEvents.ts` | `src/engines/exam-security/mouse/events/MouseEvents.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 234 | `src/modules/exam-security/mouse/hooks/useMouseRestrictions.ts` | `src/engines/exam-security/mouse/hooks/useMouseRestrictions.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 235 | `src/modules/exam-security/mouse/index.ts` | `src/engines/exam-security/mouse/index.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 236 | `src/modules/exam-security/mouse/services/ContextMenuProtectionService.ts` | `src/engines/exam-security/mouse/services/ContextMenuProtectionService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 237 | `src/modules/exam-security/mouse/services/DragDropProtectionService.ts` | `src/engines/exam-security/mouse/services/DragDropProtectionService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 238 | `src/modules/exam-security/mouse/services/MouseAnalyticsEngine.ts` | `src/engines/exam-security/mouse/services/MouseAnalyticsEngine.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 239 | `src/modules/exam-security/mouse/services/MouseDispatcher.ts` | `src/engines/exam-security/mouse/services/MouseDispatcher.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 240 | `src/modules/exam-security/mouse/services/MouseListener.ts` | `src/engines/exam-security/mouse/services/MouseListener.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 241 | `src/modules/exam-security/mouse/services/MousePolicyService.ts` | `src/engines/exam-security/mouse/services/MousePolicyService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 242 | `src/modules/exam-security/mouse/services/TextSelectionProtectionService.ts` | `src/engines/exam-security/mouse/services/TextSelectionProtectionService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 243 | `src/modules/exam-security/mouse/tests/MouseEngine.test.ts` | `src/engines/exam-security/mouse/tests/MouseEngine.test.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 244 | `src/modules/exam-security/mouse/types/MouseAction.ts` | `src/engines/exam-security/mouse/types/MouseAction.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 245 | `src/modules/exam-security/mouse/types/MouseEvent.ts` | `src/engines/exam-security/mouse/types/MouseEvent.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 246 | `src/modules/exam-security/mouse/types/MouseViolation.ts` | `src/engines/exam-security/mouse/types/MouseViolation.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 247 | `src/modules/exam-security/mouse/utils/MouseActionParser.ts` | `src/engines/exam-security/mouse/utils/MouseActionParser.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 248 | `src/modules/exam-security/mouse/utils/MouseEventNormalizer.ts` | `src/engines/exam-security/mouse/utils/MouseEventNormalizer.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 249 | `src/modules/exam-security/navigation/NavigationContext.ts` | `src/engines/exam-security/navigation/NavigationContext.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 250 | `src/modules/exam-security/navigation/NavigationEngine.ts` | `src/engines/exam-security/navigation/NavigationEngine.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 251 | `src/modules/exam-security/navigation/NavigationProvider.tsx` | `src/engines/exam-security/navigation/NavigationProvider.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 252 | `src/modules/exam-security/navigation/hooks/useNavigationSentinel.ts` | `src/engines/exam-security/navigation/hooks/useNavigationSentinel.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 253 | `src/modules/exam-security/navigation/index.ts` | `src/engines/exam-security/navigation/index.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 254 | `src/modules/exam-security/navigation/services/NavigationSentinelService.ts` | `src/engines/exam-security/navigation/services/NavigationSentinelService.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 255 | `src/modules/exam-security/navigation/types/NavigationEvent.ts` | `src/engines/exam-security/navigation/types/NavigationEvent.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 256 | `src/modules/exam-security/providers/ExamSecurityContext.ts` | `src/engines/exam-security/providers/ExamSecurityContext.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 257 | `src/modules/exam-security/providers/ExamSecurityProvider.tsx` | `src/engines/exam-security/providers/ExamSecurityProvider.tsx` | Core exam security engine, anomaly detection, telemetry pipeline |
| 258 | `src/modules/exam-security/services/ExamLockManager.ts` | `src/engines/exam-security/services/ExamLockManager.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 259 | `src/modules/exam-security/services/RestrictionRegistry.ts` | `src/engines/exam-security/services/RestrictionRegistry.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 260 | `src/modules/exam-security/services/ViolationRegistry.ts` | `src/engines/exam-security/services/ViolationRegistry.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 261 | `src/modules/exam-security/services/WarningManager.ts` | `src/engines/exam-security/services/WarningManager.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 262 | `src/modules/exam-security/types/security.types.ts` | `src/engines/exam-security/types/security.types.ts` | Core exam security engine, anomaly detection, telemetry pipeline |
| 263 | `src/pages/proctoring/ProctoringSuitePage.tsx` | `src/engines/proctoring/pages/ProctoringSuitePage.tsx` | Proctoring suite diagnostic & monitor dashboard |

### 4.10 Shared Foundation (`src/shared/`) — 93 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/components/BrandLogo.tsx` | `src/shared/components/BrandLogo.tsx` | Shared application shell layout & navigation bar |
| 2 | `src/components/Layout.tsx` | `src/shared/components/Layout.tsx` | Shared application shell layout & navigation bar |
| 3 | `src/components/Navbar.tsx` | `src/shared/components/Navbar.tsx` | Shared application shell layout & navigation bar |
| 4 | `src/components/Sidebar.tsx` | `src/shared/components/Sidebar.tsx` | Shared application shell layout & navigation bar |
| 5 | `src/components/ui/accordion.tsx` | `src/shared/components/ui/accordion.tsx` | Radix UI / Shadcn accessible design system primitive |
| 6 | `src/components/ui/alert-dialog.tsx` | `src/shared/components/ui/alert-dialog.tsx` | Radix UI / Shadcn accessible design system primitive |
| 7 | `src/components/ui/alert.tsx` | `src/shared/components/ui/alert.tsx` | Radix UI / Shadcn accessible design system primitive |
| 8 | `src/components/ui/aspect-ratio.tsx` | `src/shared/components/ui/aspect-ratio.tsx` | Radix UI / Shadcn accessible design system primitive |
| 9 | `src/components/ui/avatar.tsx` | `src/shared/components/ui/avatar.tsx` | Radix UI / Shadcn accessible design system primitive |
| 10 | `src/components/ui/badge.tsx` | `src/shared/components/ui/badge.tsx` | Radix UI / Shadcn accessible design system primitive |
| 11 | `src/components/ui/breadcrumb.tsx` | `src/shared/components/ui/breadcrumb.tsx` | Radix UI / Shadcn accessible design system primitive |
| 12 | `src/components/ui/button.tsx` | `src/shared/components/ui/button.tsx` | Radix UI / Shadcn accessible design system primitive |
| 13 | `src/components/ui/calendar.tsx` | `src/shared/components/ui/calendar.tsx` | Radix UI / Shadcn accessible design system primitive |
| 14 | `src/components/ui/card.tsx` | `src/shared/components/ui/card.tsx` | Radix UI / Shadcn accessible design system primitive |
| 15 | `src/components/ui/carousel.tsx` | `src/shared/components/ui/carousel.tsx` | Radix UI / Shadcn accessible design system primitive |
| 16 | `src/components/ui/chart.tsx` | `src/shared/components/ui/chart.tsx` | Radix UI / Shadcn accessible design system primitive |
| 17 | `src/components/ui/checkbox.tsx` | `src/shared/components/ui/checkbox.tsx` | Radix UI / Shadcn accessible design system primitive |
| 18 | `src/components/ui/collapsible.tsx` | `src/shared/components/ui/collapsible.tsx` | Radix UI / Shadcn accessible design system primitive |
| 19 | `src/components/ui/command.tsx` | `src/shared/components/ui/command.tsx` | Radix UI / Shadcn accessible design system primitive |
| 20 | `src/components/ui/context-menu.tsx` | `src/shared/components/ui/context-menu.tsx` | Radix UI / Shadcn accessible design system primitive |
| 21 | `src/components/ui/dialog.tsx` | `src/shared/components/ui/dialog.tsx` | Radix UI / Shadcn accessible design system primitive |
| 22 | `src/components/ui/drawer.tsx` | `src/shared/components/ui/drawer.tsx` | Radix UI / Shadcn accessible design system primitive |
| 23 | `src/components/ui/dropdown-menu.tsx` | `src/shared/components/ui/dropdown-menu.tsx` | Radix UI / Shadcn accessible design system primitive |
| 24 | `src/components/ui/enterprise/EnterpriseCard.tsx` | `src/shared/components/ui/enterprise/EnterpriseCard.tsx` | Radix UI / Shadcn accessible design system primitive |
| 25 | `src/components/ui/form.tsx` | `src/shared/components/ui/form.tsx` | Radix UI / Shadcn accessible design system primitive |
| 26 | `src/components/ui/hover-card.tsx` | `src/shared/components/ui/hover-card.tsx` | Radix UI / Shadcn accessible design system primitive |
| 27 | `src/components/ui/input-otp.tsx` | `src/shared/components/ui/input-otp.tsx` | Radix UI / Shadcn accessible design system primitive |
| 28 | `src/components/ui/input.tsx` | `src/shared/components/ui/input.tsx` | Radix UI / Shadcn accessible design system primitive |
| 29 | `src/components/ui/label.tsx` | `src/shared/components/ui/label.tsx` | Radix UI / Shadcn accessible design system primitive |
| 30 | `src/components/ui/menubar.tsx` | `src/shared/components/ui/menubar.tsx` | Radix UI / Shadcn accessible design system primitive |
| 31 | `src/components/ui/navigation-menu.tsx` | `src/shared/components/ui/navigation-menu.tsx` | Radix UI / Shadcn accessible design system primitive |
| 32 | `src/components/ui/pagination.tsx` | `src/shared/components/ui/pagination.tsx` | Radix UI / Shadcn accessible design system primitive |
| 33 | `src/components/ui/popover.tsx` | `src/shared/components/ui/popover.tsx` | Radix UI / Shadcn accessible design system primitive |
| 34 | `src/components/ui/progress.tsx` | `src/shared/components/ui/progress.tsx` | Radix UI / Shadcn accessible design system primitive |
| 35 | `src/components/ui/radio-group.tsx` | `src/shared/components/ui/radio-group.tsx` | Radix UI / Shadcn accessible design system primitive |
| 36 | `src/components/ui/resizable.tsx` | `src/shared/components/ui/resizable.tsx` | Radix UI / Shadcn accessible design system primitive |
| 37 | `src/components/ui/scroll-area.tsx` | `src/shared/components/ui/scroll-area.tsx` | Radix UI / Shadcn accessible design system primitive |
| 38 | `src/components/ui/select.tsx` | `src/shared/components/ui/select.tsx` | Radix UI / Shadcn accessible design system primitive |
| 39 | `src/components/ui/separator.tsx` | `src/shared/components/ui/separator.tsx` | Radix UI / Shadcn accessible design system primitive |
| 40 | `src/components/ui/sheet.tsx` | `src/shared/components/ui/sheet.tsx` | Radix UI / Shadcn accessible design system primitive |
| 41 | `src/components/ui/sidebar.tsx` | `src/shared/components/ui/sidebar.tsx` | Radix UI / Shadcn accessible design system primitive |
| 42 | `src/components/ui/skeleton.tsx` | `src/shared/components/ui/skeleton.tsx` | Radix UI / Shadcn accessible design system primitive |
| 43 | `src/components/ui/slider.tsx` | `src/shared/components/ui/slider.tsx` | Radix UI / Shadcn accessible design system primitive |
| 44 | `src/components/ui/sonner.tsx` | `src/shared/components/ui/sonner.tsx` | Radix UI / Shadcn accessible design system primitive |
| 45 | `src/components/ui/switch.tsx` | `src/shared/components/ui/switch.tsx` | Radix UI / Shadcn accessible design system primitive |
| 46 | `src/components/ui/table.tsx` | `src/shared/components/ui/table.tsx` | Radix UI / Shadcn accessible design system primitive |
| 47 | `src/components/ui/tabs.tsx` | `src/shared/components/ui/tabs.tsx` | Radix UI / Shadcn accessible design system primitive |
| 48 | `src/components/ui/textarea.tsx` | `src/shared/components/ui/textarea.tsx` | Radix UI / Shadcn accessible design system primitive |
| 49 | `src/components/ui/toast.tsx` | `src/shared/components/ui/toast.tsx` | Radix UI / Shadcn accessible design system primitive |
| 50 | `src/components/ui/toaster.tsx` | `src/shared/components/ui/toaster.tsx` | Radix UI / Shadcn accessible design system primitive |
| 51 | `src/components/ui/toggle-group.tsx` | `src/shared/components/ui/toggle-group.tsx` | Radix UI / Shadcn accessible design system primitive |
| 52 | `src/components/ui/toggle.tsx` | `src/shared/components/ui/toggle.tsx` | Radix UI / Shadcn accessible design system primitive |
| 53 | `src/components/ui/tooltip.tsx` | `src/shared/components/ui/tooltip.tsx` | Radix UI / Shadcn accessible design system primitive |
| 54 | `src/components/ui/use-toast.ts` | `src/shared/components/ui/use-toast.ts` | Radix UI / Shadcn accessible design system primitive |
| 55 | `src/guards/AuthGuard.tsx` | `src/shared/guards/AuthGuard.tsx` | Route guards (AuthGuard, RoleGuard, TenantGuard, PermissionGuard, Can) |
| 56 | `src/guards/Can.tsx` | `src/shared/guards/Can.tsx` | Route guards (AuthGuard, RoleGuard, TenantGuard, PermissionGuard, Can) |
| 57 | `src/guards/PermissionGuard.tsx` | `src/shared/guards/PermissionGuard.tsx` | Route guards (AuthGuard, RoleGuard, TenantGuard, PermissionGuard, Can) |
| 58 | `src/guards/RoleGuard.tsx` | `src/shared/guards/RoleGuard.tsx` | Route guards (AuthGuard, RoleGuard, TenantGuard, PermissionGuard, Can) |
| 59 | `src/guards/TenantGuard.tsx` | `src/shared/guards/TenantGuard.tsx` | Route guards (AuthGuard, RoleGuard, TenantGuard, PermissionGuard, Can) |
| 60 | `src/hooks/use-mobile.tsx` | `src/shared/hooks/use-mobile.tsx` | Shared React hooks (responsive UI, toast notifications, query caching) |
| 61 | `src/hooks/use-toast.ts` | `src/shared/hooks/use-toast.ts` | Shared React hooks (responsive UI, toast notifications, query caching) |
| 62 | `src/hooks/useApiQueries.ts` | `src/shared/hooks/useApiQueries.ts` | Shared React hooks (responsive UI, toast notifications, query caching) |
| 63 | `src/integrations/supabase/client.ts` | `src/shared/integrations/supabase/client.ts` | Supabase client and database schema types |
| 64 | `src/integrations/supabase/types.ts` | `src/shared/integrations/supabase/types.ts` | Supabase client and database schema types |
| 65 | `src/lib/apiClient.ts` | `src/shared/lib/apiClient.ts` | Core utility functions (cn) and Axios API client |
| 66 | `src/lib/design-system/EnterpriseLayout.tsx` | `src/shared/lib/design-system/EnterpriseLayout.tsx` | Enterprise design system layout and design tokens |
| 67 | `src/lib/design-system/tokens.ts` | `src/shared/lib/design-system/tokens.ts` | Enterprise design system layout and design tokens |
| 68 | `src/lib/utils.ts` | `src/shared/lib/utils.ts` | Core utility functions (cn) and Axios API client |
| 69 | `src/pages/Exams.tsx` | `src/shared/pages/Exams.tsx` | Shared user account page, device management, or global error view |
| 70 | `src/pages/NotFound.tsx` | `src/shared/pages/NotFound.tsx` | Shared user account page, device management, or global error view |
| 71 | `src/pages/Settings.tsx` | `src/shared/pages/Settings.tsx` | Shared user account page, device management, or global error view |
| 72 | `src/pages/auth/AccessDenied.tsx` | `src/shared/pages/auth/AccessDenied.tsx` | Shared user account page, device management, or global error view |
| 73 | `src/pages/auth/AccountLocked.tsx` | `src/shared/pages/auth/AccountLocked.tsx` | Shared user account page, device management, or global error view |
| 74 | `src/pages/auth/DevicesPage.tsx` | `src/shared/pages/auth/DevicesPage.tsx` | Shared user account page, device management, or global error view |
| 75 | `src/pages/auth/MFAVerification.tsx` | `src/shared/pages/auth/MFAVerification.tsx` | Shared user account page, device management, or global error view |
| 76 | `src/pages/auth/Maintenance.tsx` | `src/shared/pages/auth/Maintenance.tsx` | Shared user account page, device management, or global error view |
| 77 | `src/pages/auth/NetworkError.tsx` | `src/shared/pages/auth/NetworkError.tsx` | Shared user account page, device management, or global error view |
| 78 | `src/pages/auth/PortalAuthLayout.tsx` | `src/shared/components/layout/PortalAuthLayout.tsx` | Shared portal authentication layout wrapper |
| 79 | `src/pages/auth/SecuritySettings.tsx` | `src/shared/pages/auth/SecuritySettings.tsx` | Shared user account page, device management, or global error view |
| 80 | `src/pages/auth/SessionExpired.tsx` | `src/shared/pages/auth/SessionExpired.tsx` | Shared user account page, device management, or global error view |
| 81 | `src/pages/auth/SessionsPage.tsx` | `src/shared/pages/auth/SessionsPage.tsx` | Shared user account page, device management, or global error view |
| 82 | `src/pages/me/ActivityPage.tsx` | `src/shared/pages/me/ActivityPage.tsx` | Shared current user profile & account management |
| 83 | `src/pages/me/ApiKeysPage.tsx` | `src/shared/pages/me/ApiKeysPage.tsx` | Shared current user profile & account management |
| 84 | `src/pages/me/PrivacyPage.tsx` | `src/shared/pages/me/PrivacyPage.tsx` | Shared current user profile & account management |
| 85 | `src/pages/me/ProfilePage.tsx` | `src/shared/pages/me/ProfilePage.tsx` | Shared current user profile & account management |
| 86 | `src/pages/security/MfaWizardPage.tsx` | `src/shared/pages/security/MfaWizardPage.tsx` | Shared user account page, device management, or global error view |
| 87 | `src/services/authService.ts` | `src/shared/services/authService.ts` | Shared client auth & session service |
| 88 | `src/stores/authStore.ts` | `src/shared/stores/authStore.ts` | Zustand global client state store |
| 89 | `src/stores/organizationStore.ts` | `src/shared/stores/organizationStore.ts` | Zustand global client state store |
| 90 | `src/stores/questionStore.ts` | `src/shared/stores/questionStore.ts` | Zustand global client state store |
| 91 | `src/stores/tenantStore.ts` | `src/shared/stores/tenantStore.ts` | Zustand global client state store |
| 92 | `src/types/auth.ts` | `src/shared/types/auth.ts` | Shared user, role, and authentication TypeScript definitions |
| 93 | `src/utils/rbac.ts` | `src/shared/utils/rbac.ts` | Role-based access control and permission mapping matrix |

### 4.11 Backend Server (`server/` at project root) — 64 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/server/auth/audit/audit.service.ts` | `server/auth/audit/audit.service.ts` | Backend Express API controller, service, middleware, or test |
| 2 | `src/server/auth/controllers/auth.controller.ts` | `server/auth/controllers/auth.controller.ts` | Backend Express API controller, service, middleware, or test |
| 3 | `src/server/auth/devices/device.service.ts` | `server/auth/devices/device.service.ts` | Backend Express API controller, service, middleware, or test |
| 4 | `src/server/auth/middleware/security.middleware.ts` | `server/auth/middleware/security.middleware.ts` | Backend Express API controller, service, middleware, or test |
| 5 | `src/server/auth/routes/auth.routes.ts` | `server/auth/routes/auth.routes.ts` | Backend Express API controller, service, middleware, or test |
| 6 | `src/server/auth/security/cookie.config.ts` | `server/auth/security/cookie.config.ts` | Backend Express API controller, service, middleware, or test |
| 7 | `src/server/auth/security/password.service.ts` | `server/auth/security/password.service.ts` | Backend Express API controller, service, middleware, or test |
| 8 | `src/server/auth/services/authorization.service.ts` | `server/auth/services/authorization.service.ts` | Backend Express API controller, service, middleware, or test |
| 9 | `src/server/auth/services/device_session.service.ts` | `server/auth/services/device_session.service.ts` | Backend Express API controller, service, middleware, or test |
| 10 | `src/server/auth/sessions/session.service.ts` | `server/auth/sessions/session.service.ts` | Backend Express API controller, service, middleware, or test |
| 11 | `src/server/auth/tests/auth.test.ts` | `server/auth/tests/auth.test.ts` | Backend Express API controller, service, middleware, or test |
| 12 | `src/server/auth/tokens/jwt.service.ts` | `server/auth/tokens/jwt.service.ts` | Backend Express API controller, service, middleware, or test |
| 13 | `src/server/auth/validators/auth.validators.ts` | `server/auth/validators/auth.validators.ts` | Backend Express API controller, service, middleware, or test |
| 14 | `src/server/confidence-pipeline/constants/pipeline.constants.ts` | `server/confidence-pipeline/constants/pipeline.constants.ts` | Backend Express API controller, service, middleware, or test |
| 15 | `src/server/confidence-pipeline/controllers/pipelineController.ts` | `server/confidence-pipeline/controllers/pipelineController.ts` | Backend Express API controller, service, middleware, or test |
| 16 | `src/server/confidence-pipeline/routes/pipelineRoutes.ts` | `server/confidence-pipeline/routes/pipelineRoutes.ts` | Backend Express API controller, service, middleware, or test |
| 17 | `src/server/confidence-pipeline/services/aiConfidenceEngine.service.ts` | `server/confidence-pipeline/services/aiConfidenceEngine.service.ts` | Backend Express API controller, service, middleware, or test |
| 18 | `src/server/confidence-pipeline/services/alertEngine.service.ts` | `server/confidence-pipeline/services/alertEngine.service.ts` | Backend Express API controller, service, middleware, or test |
| 19 | `src/server/confidence-pipeline/services/correlationEngine.service.ts` | `server/confidence-pipeline/services/correlationEngine.service.ts` | Backend Express API controller, service, middleware, or test |
| 20 | `src/server/confidence-pipeline/services/eventGateway.service.ts` | `server/confidence-pipeline/services/eventGateway.service.ts` | Backend Express API controller, service, middleware, or test |
| 21 | `src/server/confidence-pipeline/services/eventNormalizer.service.ts` | `server/confidence-pipeline/services/eventNormalizer.service.ts` | Backend Express API controller, service, middleware, or test |
| 22 | `src/server/confidence-pipeline/services/eventValidator.service.ts` | `server/confidence-pipeline/services/eventValidator.service.ts` | Backend Express API controller, service, middleware, or test |
| 23 | `src/server/confidence-pipeline/services/policyEngine.service.ts` | `server/confidence-pipeline/services/policyEngine.service.ts` | Backend Express API controller, service, middleware, or test |
| 24 | `src/server/confidence-pipeline/services/riskDimensionCalculator.service.ts` | `server/confidence-pipeline/services/riskDimensionCalculator.service.ts` | Backend Express API controller, service, middleware, or test |
| 25 | `src/server/confidence-pipeline/services/sessionStateManager.service.ts` | `server/confidence-pipeline/services/sessionStateManager.service.ts` | Backend Express API controller, service, middleware, or test |
| 26 | `src/server/confidence-pipeline/tests/Module7Pipeline.test.ts` | `server/confidence-pipeline/tests/Module7Pipeline.test.ts` | Backend Express API controller, service, middleware, or test |
| 27 | `src/server/confidence-pipeline/types/pipeline.types.ts` | `server/confidence-pipeline/types/pipeline.types.ts` | Backend Express API controller, service, middleware, or test |
| 28 | `src/server/confidence-pipeline/websocket/pipelineWebSocket.ts` | `server/confidence-pipeline/websocket/pipelineWebSocket.ts` | Backend Express API controller, service, middleware, or test |
| 29 | `src/server/health/health.service.ts` | `server/health/health.service.ts` | Backend Express API controller, service, middleware, or test |
| 30 | `src/server/identity/abac.policy.ts` | `server/identity/abac.policy.ts` | Backend Express API controller, service, middleware, or test |
| 31 | `src/server/identity/user_center.service.ts` | `server/identity/user_center.service.ts` | Backend Express API controller, service, middleware, or test |
| 32 | `src/server/index.ts` | `server/index.ts` | Backend Express API controller, service, middleware, or test |
| 33 | `src/server/integration/integration_platform.service.ts` | `server/integration/integration_platform.service.ts` | Backend Express API controller, service, middleware, or test |
| 34 | `src/server/integrity/AuditService.ts` | `server/integrity/AuditService.ts` | Backend Express API controller, service, middleware, or test |
| 35 | `src/server/integrity/BaselineEngine.ts` | `server/integrity/BaselineEngine.ts` | Backend Express API controller, service, middleware, or test |
| 36 | `src/server/integrity/BehaviorAnalyticsEngine.ts` | `server/integrity/BehaviorAnalyticsEngine.ts` | Backend Express API controller, service, middleware, or test |
| 37 | `src/server/integrity/EventStore.ts` | `server/integrity/EventStore.ts` | Backend Express API controller, service, middleware, or test |
| 38 | `src/server/integrity/EvidenceAggregator.ts` | `server/integrity/EvidenceAggregator.ts` | Backend Express API controller, service, middleware, or test |
| 39 | `src/server/integrity/HumanReviewAPI.ts` | `server/integrity/HumanReviewAPI.ts` | Backend Express API controller, service, middleware, or test |
| 40 | `src/server/integrity/IntegrityRiskEngine.ts` | `server/integrity/IntegrityRiskEngine.ts` | Backend Express API controller, service, middleware, or test |
| 41 | `src/server/integrity/ReportGenerator.ts` | `server/integrity/ReportGenerator.ts` | Backend Express API controller, service, middleware, or test |
| 42 | `src/server/integrity/TelemetryGateway.ts` | `server/integrity/TelemetryGateway.ts` | Backend Express API controller, service, middleware, or test |
| 43 | `src/server/integrity/tests/Phase4IntegrityPlatform.test.ts` | `server/integrity/tests/Phase4IntegrityPlatform.test.ts` | Backend Express API controller, service, middleware, or test |
| 44 | `src/server/integrity/types/IntegrityTypes.ts` | `server/integrity/types/IntegrityTypes.ts` | Backend Express API controller, service, middleware, or test |
| 45 | `src/server/middleware/auth.middleware.ts` | `server/middleware/auth.middleware.ts` | Backend Express API controller, service, middleware, or test |
| 46 | `src/server/operations/controllers/EnterpriseOperationsController.ts` | `server/operations/controllers/EnterpriseOperationsController.ts` | Backend Express API controller, service, middleware, or test |
| 47 | `src/server/operations/services/EnterpriseOperationsService.ts` | `server/operations/services/EnterpriseOperationsService.ts` | Backend Express API controller, service, middleware, or test |
| 48 | `src/server/operations/tests/Phase6EnterpriseOperations.test.ts` | `server/operations/tests/Phase6EnterpriseOperations.test.ts` | Backend Express API controller, service, middleware, or test |
| 49 | `src/server/operations/types/OperationsTypes.ts` | `server/operations/types/OperationsTypes.ts` | Backend Express API controller, service, middleware, or test |
| 50 | `src/server/organization/controllers/organization.controller.ts` | `server/organization/controllers/organization.controller.ts` | Backend Express API controller, service, middleware, or test |
| 51 | `src/server/organization/org_hierarchy.service.ts` | `server/organization/org_hierarchy.service.ts` | Backend Express API controller, service, middleware, or test |
| 52 | `src/server/organization/routes/organization.routes.ts` | `server/organization/routes/organization.routes.ts` | Backend Express API controller, service, middleware, or test |
| 53 | `src/server/organization/services/invitation.service.ts` | `server/organization/services/invitation.service.ts` | Backend Express API controller, service, middleware, or test |
| 54 | `src/server/organization/services/organization.service.ts` | `server/organization/services/organization.service.ts` | Backend Express API controller, service, middleware, or test |
| 55 | `src/server/organization/tests/organization.test.ts` | `server/organization/tests/organization.test.ts` | Backend Express API controller, service, middleware, or test |
| 56 | `src/server/organization/tests/run_test.ts` | `server/organization/tests/run_test.ts` | Backend Express API controller, service, middleware, or test |
| 57 | `src/server/routes/auth.routes.ts` | `server/routes/auth.routes.ts` | Backend Express API controller, service, middleware, or test |
| 58 | `src/server/security/security_center.service.ts` | `server/security/security_center.service.ts` | Backend Express API controller, service, middleware, or test |
| 59 | `src/server/services/audit.service.ts` | `server/services/audit.service.ts` | Backend Express API controller, service, middleware, or test |
| 60 | `src/server/student/student_dashboard.controller.ts` | `server/student/student_dashboard.controller.ts` | Backend Express API controller, service, middleware, or test |
| 61 | `src/server/student/student_dashboard.service.ts` | `server/student/student_dashboard.service.ts` | Backend Express API controller, service, middleware, or test |
| 62 | `src/server/student/student_profile.controller.ts` | `server/student/student_profile.controller.ts` | Backend Express API controller, service, middleware, or test |
| 63 | `src/server/student/student_profile.service.ts` | `server/student/student_profile.service.ts` | Backend Express API controller, service, middleware, or test |
| 64 | `src/server/tenant/middleware/tenant.middleware.ts` | `server/tenant/middleware/tenant.middleware.ts` | Backend Express API controller, service, middleware, or test |

### 4.12 Application Core (`src/app/`) — 2 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/App.css` | `src/app/App.css` | Application root component & router |
| 2 | `src/App.tsx` | `src/app/App.tsx` | Application root component & router |

### 4.13 Root Configuration / Entry (`src/`) — 3 files

| # | Current Path | Target Path | Architectural Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| 1 | `src/index.css` | `src/index.css` | Application bootstrap, global styles, and Vite environment types |
| 2 | `src/main.tsx` | `src/main.tsx` | Application bootstrap, global styles, and Vite environment types |
| 3 | `src/vite-env.d.ts` | `src/vite-env.d.ts` | Application bootstrap, global styles, and Vite environment types |

---

## 5. Route Ownership & Preservation Matrix

All existing URL routes in `App.tsx` are 100% preserved. Each portal router owns its respective domain paths and applies the required guards:

| URL Route | Portal Owner | Component | Guards Enforced |
| :--- | :--- | :--- | :--- |
| `/` | `public` | `LightLanding` | Public |
| `/auth` | `public` | `PortalSelection` | Public |
| `/auth/login` | `public` | `PortalSelection` | Public |
| `/auth/register` | `public` | `Register` | Public |
| `/auth/welcome` | `public` | `Welcome` | Public |
| `/auth/discovery` | `public` | `OrgDiscovery` | Public |
| `/auth/forgot-password` | `public` | `ForgotPassword` | Public |
| `/auth/reset-password` | `public` | `ResetPassword` | Public |
| `/auth/otp` | `public` | `VerifyOTP` | Public |
| `/auth/mfa` | `public` | `MFAVerification` | Public |
| `/auth/verify-email` | `public` | `VerifyEmail` | Public |
| `/auth/invitation-accept` | `public` | `InvitationAccept` | Public |
| `/auth/select-tenant` | `public` | `SelectTenant` | `AuthGuard` |
| `/auth/onboarding` | `public` | `FirstLoginWizard` | `AuthGuard` |
| `/student` | `student` | `StudentLanding` | Public |
| `/student/login` | `student` | `StudentLogin` | Public |
| `/student/register` | `student` | `StudentRegister` | Public |
| `/student/verify-email` | `student` | `StudentVerifyEmail` | Public |
| `/student/forgot-password` | `student` | `StudentForgotPassword` | Public |
| `/student/reset-password` | `student` | `StudentResetPassword` | Public |
| `/student/mfa` | `student` | `StudentMFA` | Public |
| `/student/account-recovery` | `student` | `StudentAccountRecovery` | Public |
| `/student/dashboard` | `student` | `StudentDashboard` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/exams` | `student` | `StudentScheduledExams` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/exams/runner` | `student` | `StudentExamRunner` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/courses` | `student` | `StudentCourses` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/practice` | `student` | `StudentPractice` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/results` | `student` | `StudentResults` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/certificates` | `student` | `StudentCertificates` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/placement` | `student` | `StudentPlacement` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/settings` | `student` | `StudentSettings` | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/student/profile/*` | `student` | Profile subpages | `AuthGuard`, `RoleGuard(['STUDENT'])` |
| `/faculty` | `faculty` | `FacultyLanding` | Public |
| `/faculty/login` | `faculty` | `FacultyLogin` | Public |
| `/faculty/dashboard` | `faculty` | `FacultyDashboard` | `AuthGuard`, `RoleGuard(['FACULTY'])` |
| `/faculty/question-bank` | `faculty` | `FacultyQuestionBank` | `AuthGuard`, `RoleGuard(['FACULTY'])` |
| `/faculty/exams` | `faculty` | `FacultyExamBuilder` | `AuthGuard`, `RoleGuard(['FACULTY'])` |
| `/faculty/analytics` | `faculty` | `FacultyAnalytics` | `AuthGuard`, `RoleGuard(['FACULTY'])` |
| `/invigilator` | `invigilator` | `InvigilatorLanding` | Public |
| `/invigilator/login` | `invigilator` | `InvigilatorLogin` | Public |
| `/invigilator/dashboard` | `invigilator` | `InvigilatorDashboard` | `AuthGuard`, `RoleGuard(['INVIGILATOR'])` |
| `/invigilator/live` | `invigilator` | `InvigilatorLiveGrid` | `AuthGuard`, `RoleGuard(['INVIGILATOR'])` |
| `/invigilator/incidents` | `invigilator` | `InvigilatorIncidents` | `AuthGuard`, `RoleGuard(['INVIGILATOR'])` |
| `/organization/login`, `/org-admin/login` | `org-admin` | `OrgAdminLogin` | Public |
| `/organization/register` | `org-admin` | `Register` | Public |
| `/organization`, `/org-admin/dashboard`, `/organization/dashboard` | `org-admin` | `OrganizationDashboard` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/org-admin/users`, `/users` | `org-admin` | `OrgAdminUsers` / `Users` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN', 'FACULTY'])` |
| `/org-admin/organization` | `org-admin` | `OrgAdminStructure` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/org-admin/assessments` | `org-admin` | `OrgAdminAssessments` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/organization/branding` | `org-admin` | `BrandingSettings` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/organization/invitations` | `org-admin` | `InvitationCenter` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/organization/workspace` | `org-admin` | `WorkspaceSettings` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/organization/campuses` | `org-admin` | `CampusManagement` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/organization/departments` | `org-admin` | `DepartmentManagement` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/organization/programs` | `org-admin` | `ProgramManagement` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/organization/workspaces` | `org-admin` | `WorkspaceManagement` | `AuthGuard`, `RoleGuard(['ORGANIZATION_ADMIN', 'SUPER_ADMIN'])` |
| `/admin`, `/admin/login`, `/super-admin/login` | `super-admin` | `AdminLanding` / `SuperAdminLogin` | Public |
| `/admin/dashboard`, `/super-admin/dashboard` | `super-admin` | `AdminDashboard` | `AuthGuard`, `RoleGuard(['SUPER_ADMIN'])` |
| `/admin/production-status` | `super-admin` | `ProductionDashboard` | `AuthGuard`, `RoleGuard(['SUPER_ADMIN'])` |
| `/super-admin/organizations` | `super-admin` | `SuperAdminTenants` | `AuthGuard`, `RoleGuard(['SUPER_ADMIN'])` |
| `/super-admin/security`, `/security/center` | `super-admin` | `SuperAdminSecurity` / `SecurityCenterPage` | `AuthGuard`, `RoleGuard(['SUPER_ADMIN'])` |
| `/super-admin/platform` | `super-admin` | `SuperAdminPlatform` | `AuthGuard`, `RoleGuard(['SUPER_ADMIN'])` |
| `/admin/roles`, `/admin/permissions`, `/admin/policies` | `super-admin` | Roles, Permissions, Policies | `AuthGuard`, `RoleGuard(['SUPER_ADMIN'])` |
| `/security/compliance` | `super-admin` | `CompliancePage` | `AuthGuard`, `RoleGuard(['SUPER_ADMIN'])` |
| `/developer/*` | `super-admin` | Integrations, Webhooks, Queues | `AuthGuard`, `RoleGuard(['SUPER_ADMIN', 'ORGANIZATION_ADMIN'])` |
| `/coding/login` | `coding` | `CodingLogin` | Public |
| `/coding`, `/coding/dashboard` | `coding` | `CodingDashboard` | `AuthGuard`, `RoleGuard(['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'FACULTY', 'STUDENT'])` |
| `/operations`, `/admin/operations`, `/org-admin/operations` | `operations` | `EnterpriseCommandCenter` | `AuthGuard`, `RoleGuard(['SUPER_ADMIN'])` |
| `/proctoring/*` | `operations` / `engines` | Proctoring Suite | `AuthGuard`, `RoleGuard(['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'INVIGILATOR'])` |
| `/dashboard`, `/exams`, `/settings`, `/me/*`, `/auth/sessions`, `/auth/devices` | `shared` | Shared layout views | `AuthGuard` |
| `*` | `shared` | `NotFound` | Public |

---

## 6. Architectural Boundary Enforcement Plan

To prevent future cross-portal contamination and ensure domain autonomy:
1. **Path Aliases Configured (`tsconfig.json` & `vite.config.ts`):**
   - `@/shared/*` -> `src/shared/*`
   - `@/engines/*` -> `src/engines/*`
   - `@/portals/*` -> `src/portals/*`
   - `@/app/*` -> `src/app/*`
2. **ESLint Boundary Rules (`no-restricted-imports`):**
   - Portals CANNOT import from other portals (e.g. `src/portals/student` cannot import from `src/portals/faculty`).
   - Portals CAN import from `@/shared` and `@/engines`.
   - Engines CANNOT import from portals.
   - Shared CANNOT import from portals or engines.

---

## 7. Migration Sequence & Approval Request

Following approval, migration will proceed safely in incremental, verified batches using `git mv`:
1. **Foundation & Aliases:** Configure `tsconfig.json`, `tsconfig.app.json`, and `vite.config.ts`.
2. **Server Extraction:** `git mv src/server server`, configure `/server/tsconfig.server.json`, update `Dockerfile.backend` and `docker-compose.yml`.
3. **Engines Migration:** Move `exam-security`, `browser-integrity`, and `proctoring` into `src/engines/`.
4. **Shared Layer Migration:** Move `components/ui`, layout, guards, stores, services, hooks, lib, types, utils to `src/shared/`.
5. **Role Portals Migration (One-by-one verification):**
   - Step 5a: `public` portal
   - Step 5b: `student` portal
   - Step 5c: `faculty` portal
   - Step 5d: `invigilator` portal
   - Step 5e: `org-admin` portal
   - Step 5f: `super-admin` portal
   - Step 5g: `coding` portal
   - Step 5h: `operations` portal
6. **App Root Refactor:** Modularize `src/app/App.tsx` with lazy-loaded portal route modules.
7. **Boundary Enforcement & Verification:** Add ESLint rules, run `npm run build`, `npm run lint`, and `npx vitest run`.

> **Action Required:** Please review this file classification and architectural layout. Upon your approval, we will proceed immediately with Step 2 & 3 moves.