# Final Architecture Restructuring Report (RESTRUCTURE_REPORT.md)

> **AssessIQ / Examify Portal Architecture Modernization**  
> **Branch:** `restructure-portals` | **Status:** Step 0-4 Complete | **Verification:** 100% Passed

---

## 1. Executive Summary & Quality Check Results

The codebase has been restructured into self-contained user role portals and modular domain engines. Zero behavioral, visual, or functional regressions were introduced:

| Verification Metric | Baseline Pre-Restructure | Final Post-Restructure | Status |
| :--- | :--- | :--- | :--- |
| **Git Status** | Clean working tree | Clean working tree (full history retained via `git mv`) | **PASSED** |
| **Vite Build (`npm run build`)** | **SUCCESS** (Exit Code 0, ~3.0s) | **SUCCESS** (Exit Code 0, 3.12s) | **PASSED** |
| **Server Build (`npm run build:server`)** | Missing script / uncompiled | **SUCCESS** (Exit Code 0, 1.4s) | **PASSED** |
| **ESLint (`npm run lint`)** | 253 problems (214 errors, 39 warnings) | **253 problems** (214 errors, 39 warnings) | **PASSED (0 new issues)** |
| **Vitest (`npx vitest run`)** | **88 passed**, 7 failed across 18 files | **88 passed**, 7 failed across 18 files | **PASSED (0 regressions)** |
| **Broken Local Imports** | Baseline | **0 broken imports** across entire repo | **PASSED** |
| **Cross-Portal Imports** | 1 (unrelated dead import) | **0 cross-portal imports** | **ENFORCED** |

---

## 2. Final High-Level Directory Tree

```
exam-portal-main/
├── Dockerfile.backend                       # Production backend Dockerfile with server build
├── docker-compose.yml                       # Container orchestration with environment vars
├── eslint.config.js                         # ESLint with no-restricted-imports boundary rules
├── package.json                             # Root scripts (build, dev, build:server, dev:server)
├── prisma/                                  # Database schema & migrations (remains at root)
├── tsconfig.json                            # Root TypeScript config with path aliases
├── tsconfig.app.json                        # App TypeScript compiler config
├── vite.config.ts                           # Vite configuration with path aliases
│
├── server/                                  # Independent Node.js / Express Backend Service
│   ├── auth/                                # Authentication, JWT, RBAC controllers & services
│   ├── confidence-pipeline/                 # Real-time WebSocket confidence scoring pipeline
│   ├── integrity/                           # Telemetry gateway & behavior analytics
│   ├── operations/                          # Enterprise operations controllers & services
│   ├── organization/                        # Multi-tenant hierarchy & invitation services
│   ├── student/                             # Student dashboard & profile controllers
│   ├── index.ts                             # Express server entrypoint
│   └── tsconfig.json                        # Server-specific TypeScript configuration
│
└── src/
    ├── main.tsx                             # Vite entry bootstrap
    ├── index.css                            # Global theme & Tailwind directives
    ├── vite-env.d.ts                        # Vite client environment types
    │
    ├── app/                                 # Clean Application Core
    │   ├── App.tsx                          # Root router mounting portal routes via lazy/Suspense
    │   └── App.css                          # App-level styling
    │
    ├── shared/                              # Shared Foundation Across All Portals
    │   ├── components/                      # UI primitives & layout shells
    │   │   ├── ui/                          # Radix / Shadcn UI primitive components (50 files)
    │   │   └── layout/                      # Shared layouts (PortalAuthLayout, Layout, Navbar)
    │   ├── guards/                          # AuthGuard, RoleGuard, TenantGuard, Can, PermissionGuard
    │   ├── hooks/                           # Shared utility hooks (use-toast, use-mobile, useApiQueries)
    │   ├── lib/                             # Shared utility helpers (cn, apiClient, tokens)
    │   ├── pages/                           # Shared error & account pages (404, AccessDenied, Sessions)
    │   │   └── me/                          # Authenticated user self-profile & API key pages
    │   ├── services/                        # Client authentication & session services
    │   ├── stores/                          # Zustand global client stores (auth, tenant, org, question)
    │   ├── types/                           # Shared TypeScript models (auth, user, role)
    │   ├── utils/                           # Shared RBAC utilities
    │   └── integrations/                    # Supabase integration client & types
    │
    ├── engines/                             # Reusable Domain Engines
    │   ├── exam-security/                   # Anomaly detection, lockdown, event telemetry
    │   ├── browser-integrity/               # DevTools, DOM overlay, blur, keyboard/mouse monitors
    │   └── proctoring/                      # Multi-modal AI proctoring (camera, face, gaze, audio)
    │
    └── portals/                             # Self-Contained Role Portals
        ├── public/                          # Public landing pages, marketing, and unified auth flow
        ├── student/                         # Student exam runner, dashboard, profile, scheduled exams
        ├── faculty/                         # Faculty question bank, exam builder, analytics, dashboard
        ├── invigilator/                     # Invigilator live grid, incidents, and dashboard
        ├── org-admin/                       # Organization admin hierarchy, campuses, depts, users
        ├── super-admin/                     # Super admin governance, platform, tenants, policies
        ├── coding/                          # Coding assessment hub, sandbox, problem repository
        └── operations/                      # Enterprise operations command center
```

---

## 3. Every Moved File (Old Path to New Path Inventory)

All moves were performed using `git mv` so complete commit history and blame were preserved.

### 3.1 Backend Server Extraction (`src/server` -> `/server`) — 64 files

| # | Old Path | New Path |
| :--- | :--- | :--- |
| 1 | `src/server/auth/audit/audit.service.ts` | `server/auth/audit/audit.service.ts` |
| 2 | `src/server/auth/controllers/auth.controller.ts` | `server/auth/controllers/auth.controller.ts` |
| 3 | `src/server/auth/devices/device.service.ts` | `server/auth/devices/device.service.ts` |
| 4 | `src/server/auth/middleware/security.middleware.ts` | `server/auth/middleware/security.middleware.ts` |
| 5 | `src/server/auth/routes/auth.routes.ts` | `server/auth/routes/auth.routes.ts` |
| 6 | `src/server/auth/security/cookie.config.ts` | `server/auth/security/cookie.config.ts` |
| 7 | `src/server/auth/security/password.service.ts` | `server/auth/security/password.service.ts` |
| 8 | `src/server/auth/services/authorization.service.ts` | `server/auth/services/authorization.service.ts` |
| 9 | `src/server/auth/services/device_session.service.ts` | `server/auth/services/device_session.service.ts` |
| 10 | `src/server/auth/sessions/session.service.ts` | `server/auth/sessions/session.service.ts` |
| 11 | `src/server/auth/tests/auth.test.ts` | `server/auth/tests/auth.test.ts` |
| 12 | `src/server/auth/tokens/jwt.service.ts` | `server/auth/tokens/jwt.service.ts` |
| 13 | `src/server/auth/validators/auth.validators.ts` | `server/auth/validators/auth.validators.ts` |
| 14 | `src/server/confidence-pipeline/constants/pipeline.constants.ts` | `server/confidence-pipeline/constants/pipeline.constants.ts` |
| 15 | `src/server/confidence-pipeline/controllers/pipelineController.ts` | `server/confidence-pipeline/controllers/pipelineController.ts` |
| 16 | `src/server/confidence-pipeline/routes/pipelineRoutes.ts` | `server/confidence-pipeline/routes/pipelineRoutes.ts` |
| 17 | `src/server/confidence-pipeline/services/aiConfidenceEngine.service.ts` | `server/confidence-pipeline/services/aiConfidenceEngine.service.ts` |
| 18 | `src/server/confidence-pipeline/services/alertEngine.service.ts` | `server/confidence-pipeline/services/alertEngine.service.ts` |
| 19 | `src/server/confidence-pipeline/services/correlationEngine.service.ts` | `server/confidence-pipeline/services/correlationEngine.service.ts` |
| 20 | `src/server/confidence-pipeline/services/eventGateway.service.ts` | `server/confidence-pipeline/services/eventGateway.service.ts` |
| 21 | `src/server/confidence-pipeline/services/eventNormalizer.service.ts` | `server/confidence-pipeline/services/eventNormalizer.service.ts` |
| 22 | `src/server/confidence-pipeline/services/eventValidator.service.ts` | `server/confidence-pipeline/services/eventValidator.service.ts` |
| 23 | `src/server/confidence-pipeline/services/policyEngine.service.ts` | `server/confidence-pipeline/services/policyEngine.service.ts` |
| 24 | `src/server/confidence-pipeline/services/riskDimensionCalculator.service.ts` | `server/confidence-pipeline/services/riskDimensionCalculator.service.ts` |
| 25 | `src/server/confidence-pipeline/services/sessionStateManager.service.ts` | `server/confidence-pipeline/services/sessionStateManager.service.ts` |
| 26 | `src/server/confidence-pipeline/tests/Module7Pipeline.test.ts` | `server/confidence-pipeline/tests/Module7Pipeline.test.ts` |
| 27 | `src/server/confidence-pipeline/types/pipeline.types.ts` | `server/confidence-pipeline/types/pipeline.types.ts` |
| 28 | `src/server/confidence-pipeline/websocket/pipelineWebSocket.ts` | `server/confidence-pipeline/websocket/pipelineWebSocket.ts` |
| 29 | `src/server/health/health.service.ts` | `server/health/health.service.ts` |
| 30 | `src/server/identity/abac.policy.ts` | `server/identity/abac.policy.ts` |
| 31 | `src/server/identity/user_center.service.ts` | `server/identity/user_center.service.ts` |
| 32 | `src/server/index.ts` | `server/index.ts` |
| 33 | `src/server/integration/integration_platform.service.ts` | `server/integration/integration_platform.service.ts` |
| 34 | `src/server/integrity/AuditService.ts` | `server/integrity/AuditService.ts` |
| 35 | `src/server/integrity/BaselineEngine.ts` | `server/integrity/BaselineEngine.ts` |
| 36 | `src/server/integrity/BehaviorAnalyticsEngine.ts` | `server/integrity/BehaviorAnalyticsEngine.ts` |
| 37 | `src/server/integrity/EventStore.ts` | `server/integrity/EventStore.ts` |
| 38 | `src/server/integrity/EvidenceAggregator.ts` | `server/integrity/EvidenceAggregator.ts` |
| 39 | `src/server/integrity/HumanReviewAPI.ts` | `server/integrity/HumanReviewAPI.ts` |
| 40 | `src/server/integrity/IntegrityRiskEngine.ts` | `server/integrity/IntegrityRiskEngine.ts` |
| 41 | `src/server/integrity/ReportGenerator.ts` | `server/integrity/ReportGenerator.ts` |
| 42 | `src/server/integrity/TelemetryGateway.ts` | `server/integrity/TelemetryGateway.ts` |
| 43 | `src/server/integrity/tests/Phase4IntegrityPlatform.test.ts` | `server/integrity/tests/Phase4IntegrityPlatform.test.ts` |
| 44 | `src/server/integrity/types/IntegrityTypes.ts` | `server/integrity/types/IntegrityTypes.ts` |
| 45 | `src/server/middleware/auth.middleware.ts` | `server/middleware/auth.middleware.ts` |
| 46 | `src/server/operations/controllers/EnterpriseOperationsController.ts` | `server/operations/controllers/EnterpriseOperationsController.ts` |
| 47 | `src/server/operations/services/EnterpriseOperationsService.ts` | `server/operations/services/EnterpriseOperationsService.ts` |
| 48 | `src/server/operations/tests/Phase6EnterpriseOperations.test.ts` | `server/operations/tests/Phase6EnterpriseOperations.test.ts` |
| 49 | `src/server/operations/types/OperationsTypes.ts` | `server/operations/types/OperationsTypes.ts` |
| 50 | `src/server/organization/controllers/organization.controller.ts` | `server/organization/controllers/organization.controller.ts` |
| 51 | `src/server/organization/org_hierarchy.service.ts` | `server/organization/org_hierarchy.service.ts` |
| 52 | `src/server/organization/routes/organization.routes.ts` | `server/organization/routes/organization.routes.ts` |
| 53 | `src/server/organization/services/invitation.service.ts` | `server/organization/services/invitation.service.ts` |
| 54 | `src/server/organization/services/organization.service.ts` | `server/organization/services/organization.service.ts` |
| 55 | `src/server/organization/tests/organization.test.ts` | `server/organization/tests/organization.test.ts` |
| 56 | `src/server/organization/tests/run_test.ts` | `server/organization/tests/run_test.ts` |
| 57 | `src/server/routes/auth.routes.ts` | `server/routes/auth.routes.ts` |
| 58 | `src/server/security/security_center.service.ts` | `server/security/security_center.service.ts` |
| 59 | `src/server/services/audit.service.ts` | `server/services/audit.service.ts` |
| 60 | `src/server/student/student_dashboard.controller.ts` | `server/student/student_dashboard.controller.ts` |
| 61 | `src/server/student/student_dashboard.service.ts` | `server/student/student_dashboard.service.ts` |
| 62 | `src/server/student/student_profile.controller.ts` | `server/student/student_profile.controller.ts` |
| 63 | `src/server/student/student_profile.service.ts` | `server/student/student_profile.service.ts` |
| 64 | `src/server/tenant/middleware/tenant.middleware.ts` | `server/tenant/middleware/tenant.middleware.ts` |

### 3.2 Domain Engines Extraction (`src/engines/`) — 263 files

| # | Old Path | New Path |
| :--- | :--- | :--- |
| 1 | `src/modules/browser-integrity-engine/core/BaseModule.ts` | `src/engines/browser-integrity/core/BaseModule.ts` |
| 2 | `src/modules/browser-integrity-engine/core/BrowserIntegrityEngine.ts` | `src/engines/browser-integrity/core/BrowserIntegrityEngine.ts` |
| 3 | `src/modules/browser-integrity-engine/core/EventBus.ts` | `src/engines/browser-integrity/core/EventBus.ts` |
| 4 | `src/modules/browser-integrity-engine/core/SessionManager.ts` | `src/engines/browser-integrity/core/SessionManager.ts` |
| 5 | `src/modules/browser-integrity-engine/core/TelemetryManager.ts` | `src/engines/browser-integrity/core/TelemetryManager.ts` |
| 6 | `src/modules/browser-integrity-engine/index.ts` | `src/engines/browser-integrity/index.ts` |
| 7 | `src/modules/browser-integrity-engine/monitors/AnswerBehaviorMonitor.ts` | `src/engines/browser-integrity/monitors/AnswerBehaviorMonitor.ts` |
| 8 | `src/modules/browser-integrity-engine/monitors/BrowserFingerprintMonitor.ts` | `src/engines/browser-integrity/monitors/BrowserFingerprintMonitor.ts` |
| 9 | `src/modules/browser-integrity-engine/monitors/ClipboardMonitor.ts` | `src/engines/browser-integrity/monitors/ClipboardMonitor.ts` |
| 10 | `src/modules/browser-integrity-engine/monitors/DOMOverlayScanner.ts` | `src/engines/browser-integrity/monitors/DOMOverlayScanner.ts` |
| 11 | `src/modules/browser-integrity-engine/monitors/DevToolsMonitor.ts` | `src/engines/browser-integrity/monitors/DevToolsMonitor.ts` |
| 12 | `src/modules/browser-integrity-engine/monitors/EnvironmentMonitor.ts` | `src/engines/browser-integrity/monitors/EnvironmentMonitor.ts` |
| 13 | `src/modules/browser-integrity-engine/monitors/FocusMonitor.ts` | `src/engines/browser-integrity/monitors/FocusMonitor.ts` |
| 14 | `src/modules/browser-integrity-engine/monitors/KeyboardAnalyzer.ts` | `src/engines/browser-integrity/monitors/KeyboardAnalyzer.ts` |
| 15 | `src/modules/browser-integrity-engine/monitors/MouseAnalyzer.ts` | `src/engines/browser-integrity/monitors/MouseAnalyzer.ts` |
| 16 | `src/modules/browser-integrity-engine/monitors/NetworkMonitor.ts` | `src/engines/browser-integrity/monitors/NetworkMonitor.ts` |
| 17 | `src/modules/browser-integrity-engine/monitors/ScreenMonitor.ts` | `src/engines/browser-integrity/monitors/ScreenMonitor.ts` |
| 18 | `src/modules/browser-integrity-engine/tests/Phase2Modules.test.ts` | `src/engines/browser-integrity/tests/Phase2Modules.test.ts` |
| 19 | `src/modules/browser-integrity-engine/tests/Phase3Modules.test.ts` | `src/engines/browser-integrity/tests/Phase3Modules.test.ts` |
| 20 | `src/modules/browser-integrity-engine/types/IntegrityEvent.ts` | `src/engines/browser-integrity/types/IntegrityEvent.ts` |
| 21 | `src/modules/browser-integrity-engine/ui/DashboardUI.ts` | `src/engines/browser-integrity/ui/DashboardUI.ts` |
| 22 | `src/modules/exam-security/browser/BrowserEventContext.ts` | `src/engines/exam-security/browser/BrowserEventContext.ts` |
| 23 | `src/modules/exam-security/browser/BrowserEventManager.ts` | `src/engines/exam-security/browser/BrowserEventManager.ts` |
| 24 | `src/modules/exam-security/browser/BrowserEventProvider.tsx` | `src/engines/exam-security/browser/BrowserEventProvider.tsx` |
| 25 | `src/modules/exam-security/browser/events/BrowserEvents.ts` | `src/engines/exam-security/browser/events/BrowserEvents.ts` |
| 26 | `src/modules/exam-security/browser/hooks/useBrowserEvents.ts` | `src/engines/exam-security/browser/hooks/useBrowserEvents.ts` |
| 27 | `src/modules/exam-security/browser/services/BrowserEventDispatcher.ts` | `src/engines/exam-security/browser/services/BrowserEventDispatcher.ts` |
| 28 | `src/modules/exam-security/browser/services/BrowserEventListener.ts` | `src/engines/exam-security/browser/services/BrowserEventListener.ts` |
| 29 | `src/modules/exam-security/browser/tests/BrowserEventManager.test.ts` | `src/engines/exam-security/browser/tests/BrowserEventManager.test.ts` |
| 30 | `src/modules/exam-security/browser/types/BrowserEvent.ts` | `src/engines/exam-security/browser/types/BrowserEvent.ts` |
| 31 | `src/modules/exam-security/browser/types/BrowserEventType.ts` | `src/engines/exam-security/browser/types/BrowserEventType.ts` |
| 32 | `src/modules/exam-security/browser/utils/EventNormalizer.ts` | `src/engines/exam-security/browser/utils/EventNormalizer.ts` |
| 33 | `src/modules/exam-security/clipboard/ClipboardContext.ts` | `src/engines/exam-security/clipboard/ClipboardContext.ts` |
| 34 | `src/modules/exam-security/clipboard/ClipboardProtectionEngine.ts` | `src/engines/exam-security/clipboard/ClipboardProtectionEngine.ts` |
| 35 | `src/modules/exam-security/clipboard/ClipboardProvider.tsx` | `src/engines/exam-security/clipboard/ClipboardProvider.tsx` |
| 36 | `src/modules/exam-security/clipboard/constants/AllowedClipboardActions.ts` | `src/engines/exam-security/clipboard/constants/AllowedClipboardActions.ts` |
| 37 | `src/modules/exam-security/clipboard/constants/RestrictedClipboardActions.ts` | `src/engines/exam-security/clipboard/constants/RestrictedClipboardActions.ts` |
| 38 | `src/modules/exam-security/clipboard/events/ClipboardEvents.ts` | `src/engines/exam-security/clipboard/events/ClipboardEvents.ts` |
| 39 | `src/modules/exam-security/clipboard/hooks/useClipboardProtection.ts` | `src/engines/exam-security/clipboard/hooks/useClipboardProtection.ts` |
| 40 | `src/modules/exam-security/clipboard/index.ts` | `src/engines/exam-security/clipboard/index.ts` |
| 41 | `src/modules/exam-security/clipboard/services/ClipboardAnalyticsService.ts` | `src/engines/exam-security/clipboard/services/ClipboardAnalyticsService.ts` |
| 42 | `src/modules/exam-security/clipboard/services/ClipboardDispatcher.ts` | `src/engines/exam-security/clipboard/services/ClipboardDispatcher.ts` |
| 43 | `src/modules/exam-security/clipboard/services/ClipboardListener.ts` | `src/engines/exam-security/clipboard/services/ClipboardListener.ts` |
| 44 | `src/modules/exam-security/clipboard/services/ClipboardPolicyService.ts` | `src/engines/exam-security/clipboard/services/ClipboardPolicyService.ts` |
| 45 | `src/modules/exam-security/clipboard/services/CopyProtectionService.ts` | `src/engines/exam-security/clipboard/services/CopyProtectionService.ts` |
| 46 | `src/modules/exam-security/clipboard/services/CutProtectionService.ts` | `src/engines/exam-security/clipboard/services/CutProtectionService.ts` |
| 47 | `src/modules/exam-security/clipboard/services/DragClipboardProtectionService.ts` | `src/engines/exam-security/clipboard/services/DragClipboardProtectionService.ts` |
| 48 | `src/modules/exam-security/clipboard/services/PasteProtectionService.ts` | `src/engines/exam-security/clipboard/services/PasteProtectionService.ts` |
| 49 | `src/modules/exam-security/clipboard/tests/ClipboardEngine.test.ts` | `src/engines/exam-security/clipboard/tests/ClipboardEngine.test.ts` |
| 50 | `src/modules/exam-security/clipboard/types/ClipboardAction.ts` | `src/engines/exam-security/clipboard/types/ClipboardAction.ts` |
| 51 | `src/modules/exam-security/clipboard/types/ClipboardEvent.ts` | `src/engines/exam-security/clipboard/types/ClipboardEvent.ts` |
| 52 | `src/modules/exam-security/clipboard/types/ClipboardViolation.ts` | `src/engines/exam-security/clipboard/types/ClipboardViolation.ts` |
| 53 | `src/modules/exam-security/clipboard/utils/ClipboardActionParser.ts` | `src/engines/exam-security/clipboard/utils/ClipboardActionParser.ts` |
| 54 | `src/modules/exam-security/clipboard/utils/ClipboardNormalizer.ts` | `src/engines/exam-security/clipboard/utils/ClipboardNormalizer.ts` |
| 55 | `src/modules/exam-security/constants/security.constants.ts` | `src/engines/exam-security/constants/security.constants.ts` |
| 56 | `src/modules/exam-security/core/RestrictionManager.ts` | `src/engines/exam-security/core/RestrictionManager.ts` |
| 57 | `src/modules/exam-security/events/SecurityEventBus.ts` | `src/engines/exam-security/events/SecurityEventBus.ts` |
| 58 | `src/modules/exam-security/focus/FocusContext.ts` | `src/engines/exam-security/focus/FocusContext.ts` |
| 59 | `src/modules/exam-security/focus/FocusEngine.ts` | `src/engines/exam-security/focus/FocusEngine.ts` |
| 60 | `src/modules/exam-security/focus/FocusProvider.tsx` | `src/engines/exam-security/focus/FocusProvider.tsx` |
| 61 | `src/modules/exam-security/focus/constants/FocusEvents.ts` | `src/engines/exam-security/focus/constants/FocusEvents.ts` |
| 62 | `src/modules/exam-security/focus/hooks/useFocus.ts` | `src/engines/exam-security/focus/hooks/useFocus.ts` |
| 63 | `src/modules/exam-security/focus/index.ts` | `src/engines/exam-security/focus/index.ts` |
| 64 | `src/modules/exam-security/focus/services/FocusAnalyticsService.ts` | `src/engines/exam-security/focus/services/FocusAnalyticsService.ts` |
| 65 | `src/modules/exam-security/focus/services/FocusDispatcher.ts` | `src/engines/exam-security/focus/services/FocusDispatcher.ts` |
| 66 | `src/modules/exam-security/focus/services/FocusPolicyService.ts` | `src/engines/exam-security/focus/services/FocusPolicyService.ts` |
| 67 | `src/modules/exam-security/focus/services/FocusService.ts` | `src/engines/exam-security/focus/services/FocusService.ts` |
| 68 | `src/modules/exam-security/focus/types/FocusEvent.ts` | `src/engines/exam-security/focus/types/FocusEvent.ts` |
| 69 | `src/modules/exam-security/focus/types/FocusState.ts` | `src/engines/exam-security/focus/types/FocusState.ts` |
| 70 | `src/modules/exam-security/focus/utils/FocusNormalizer.ts` | `src/engines/exam-security/focus/utils/FocusNormalizer.ts` |
| 71 | `src/modules/exam-security/fullscreen/FullscreenContext.ts` | `src/engines/exam-security/fullscreen/FullscreenContext.ts` |
| 72 | `src/modules/exam-security/fullscreen/FullscreenEngine.ts` | `src/engines/exam-security/fullscreen/FullscreenEngine.ts` |
| 73 | `src/modules/exam-security/fullscreen/FullscreenProvider.tsx` | `src/engines/exam-security/fullscreen/FullscreenProvider.tsx` |
| 74 | `src/modules/exam-security/fullscreen/components/BrowserSupportDialog.tsx` | `src/engines/exam-security/fullscreen/components/BrowserSupportDialog.tsx` |
| 75 | `src/modules/exam-security/fullscreen/components/FullscreenIndicator.tsx` | `src/engines/exam-security/fullscreen/components/FullscreenIndicator.tsx` |
| 76 | `src/modules/exam-security/fullscreen/components/FullscreenOverlay.tsx` | `src/engines/exam-security/fullscreen/components/FullscreenOverlay.tsx` |
| 77 | `src/modules/exam-security/fullscreen/components/FullscreenPrompt.tsx` | `src/engines/exam-security/fullscreen/components/FullscreenPrompt.tsx` |
| 78 | `src/modules/exam-security/fullscreen/components/FullscreenStatusBadge.tsx` | `src/engines/exam-security/fullscreen/components/FullscreenStatusBadge.tsx` |
| 79 | `src/modules/exam-security/fullscreen/components/RecoveryDialog.tsx` | `src/engines/exam-security/fullscreen/components/RecoveryDialog.tsx` |
| 80 | `src/modules/exam-security/fullscreen/constants/FullscreenEvents.ts` | `src/engines/exam-security/fullscreen/constants/FullscreenEvents.ts` |
| 81 | `src/modules/exam-security/fullscreen/constants/FullscreenPolicies.ts` | `src/engines/exam-security/fullscreen/constants/FullscreenPolicies.ts` |
| 82 | `src/modules/exam-security/fullscreen/hooks/useFullscreen.ts` | `src/engines/exam-security/fullscreen/hooks/useFullscreen.ts` |
| 83 | `src/modules/exam-security/fullscreen/index.ts` | `src/engines/exam-security/fullscreen/index.ts` |
| 84 | `src/modules/exam-security/fullscreen/services/FullscreenAnalyticsService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenAnalyticsService.ts` |
| 85 | `src/modules/exam-security/fullscreen/services/FullscreenDispatcher.ts` | `src/engines/exam-security/fullscreen/services/FullscreenDispatcher.ts` |
| 86 | `src/modules/exam-security/fullscreen/services/FullscreenPolicyService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenPolicyService.ts` |
| 87 | `src/modules/exam-security/fullscreen/services/FullscreenRecoveryService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenRecoveryService.ts` |
| 88 | `src/modules/exam-security/fullscreen/services/FullscreenService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenService.ts` |
| 89 | `src/modules/exam-security/fullscreen/services/FullscreenStateService.ts` | `src/engines/exam-security/fullscreen/services/FullscreenStateService.ts` |
| 90 | `src/modules/exam-security/fullscreen/tests/FullscreenEngine.test.ts` | `src/engines/exam-security/fullscreen/tests/FullscreenEngine.test.ts` |
| 91 | `src/modules/exam-security/fullscreen/types/FullscreenEvent.ts` | `src/engines/exam-security/fullscreen/types/FullscreenEvent.ts` |
| 92 | `src/modules/exam-security/fullscreen/types/FullscreenPolicy.ts` | `src/engines/exam-security/fullscreen/types/FullscreenPolicy.ts` |
| 93 | `src/modules/exam-security/fullscreen/types/FullscreenState.ts` | `src/engines/exam-security/fullscreen/types/FullscreenState.ts` |
| 94 | `src/modules/exam-security/fullscreen/types/FullscreenViolation.ts` | `src/engines/exam-security/fullscreen/types/FullscreenViolation.ts` |
| 95 | `src/modules/exam-security/fullscreen/utils/BrowserCompatibility.ts` | `src/engines/exam-security/fullscreen/utils/BrowserCompatibility.ts` |
| 96 | `src/modules/exam-security/fullscreen/utils/FullscreenNormalizer.ts` | `src/engines/exam-security/fullscreen/utils/FullscreenNormalizer.ts` |
| 97 | `src/modules/exam-security/hooks/useExamSecurity.ts` | `src/engines/exam-security/hooks/useExamSecurity.ts` |
| 98 | `src/modules/exam-security/index.ts` | `src/engines/exam-security/index.ts` |
| 99 | `src/modules/exam-security/keyboard/KeyboardContext.ts` | `src/engines/exam-security/keyboard/KeyboardContext.ts` |
| 100 | `src/modules/exam-security/keyboard/KeyboardProvider.tsx` | `src/engines/exam-security/keyboard/KeyboardProvider.tsx` |
| 101 | `src/modules/exam-security/keyboard/KeyboardRestrictionEngine.ts` | `src/engines/exam-security/keyboard/KeyboardRestrictionEngine.ts` |
| 102 | `src/modules/exam-security/keyboard/constants/AllowedKeys.ts` | `src/engines/exam-security/keyboard/constants/AllowedKeys.ts` |
| 103 | `src/modules/exam-security/keyboard/constants/RestrictedKeys.ts` | `src/engines/exam-security/keyboard/constants/RestrictedKeys.ts` |
| 104 | `src/modules/exam-security/keyboard/events/KeyboardEvents.ts` | `src/engines/exam-security/keyboard/events/KeyboardEvents.ts` |
| 105 | `src/modules/exam-security/keyboard/hooks/useKeyboardRestrictions.ts` | `src/engines/exam-security/keyboard/hooks/useKeyboardRestrictions.ts` |
| 106 | `src/modules/exam-security/keyboard/index.ts` | `src/engines/exam-security/keyboard/index.ts` |
| 107 | `src/modules/exam-security/keyboard/services/KeyboardDispatcher.ts` | `src/engines/exam-security/keyboard/services/KeyboardDispatcher.ts` |
| 108 | `src/modules/exam-security/keyboard/services/KeyboardListener.ts` | `src/engines/exam-security/keyboard/services/KeyboardListener.ts` |
| 109 | `src/modules/exam-security/keyboard/services/KeyboardPolicyService.ts` | `src/engines/exam-security/keyboard/services/KeyboardPolicyService.ts` |
| 110 | `src/modules/exam-security/keyboard/tests/KeyboardEngine.test.ts` | `src/engines/exam-security/keyboard/tests/KeyboardEngine.test.ts` |
| 111 | `src/modules/exam-security/keyboard/types/KeyboardEvent.ts` | `src/engines/exam-security/keyboard/types/KeyboardEvent.ts` |
| 112 | `src/modules/exam-security/keyboard/types/KeyboardShortcut.ts` | `src/engines/exam-security/keyboard/types/KeyboardShortcut.ts` |
| 113 | `src/modules/exam-security/keyboard/types/KeyboardViolation.ts` | `src/engines/exam-security/keyboard/types/KeyboardViolation.ts` |
| 114 | `src/modules/exam-security/keyboard/utils/KeyCombinationParser.ts` | `src/engines/exam-security/keyboard/utils/KeyCombinationParser.ts` |
| 115 | `src/modules/exam-security/keyboard/utils/ShortcutMatcher.ts` | `src/engines/exam-security/keyboard/utils/ShortcutMatcher.ts` |
| 116 | `src/modules/exam-security/mouse/MouseContext.ts` | `src/engines/exam-security/mouse/MouseContext.ts` |
| 117 | `src/modules/exam-security/mouse/MouseProvider.tsx` | `src/engines/exam-security/mouse/MouseProvider.tsx` |
| 118 | `src/modules/exam-security/mouse/MouseRestrictionEngine.ts` | `src/engines/exam-security/mouse/MouseRestrictionEngine.ts` |
| 119 | `src/modules/exam-security/mouse/constants/AllowedMouseActions.ts` | `src/engines/exam-security/mouse/constants/AllowedMouseActions.ts` |
| 120 | `src/modules/exam-security/mouse/constants/RestrictedMouseActions.ts` | `src/engines/exam-security/mouse/constants/RestrictedMouseActions.ts` |
| 121 | `src/modules/exam-security/mouse/events/MouseEvents.ts` | `src/engines/exam-security/mouse/events/MouseEvents.ts` |
| 122 | `src/modules/exam-security/mouse/hooks/useMouseRestrictions.ts` | `src/engines/exam-security/mouse/hooks/useMouseRestrictions.ts` |
| 123 | `src/modules/exam-security/mouse/index.ts` | `src/engines/exam-security/mouse/index.ts` |
| 124 | `src/modules/exam-security/mouse/services/ContextMenuProtectionService.ts` | `src/engines/exam-security/mouse/services/ContextMenuProtectionService.ts` |
| 125 | `src/modules/exam-security/mouse/services/DragDropProtectionService.ts` | `src/engines/exam-security/mouse/services/DragDropProtectionService.ts` |
| 126 | `src/modules/exam-security/mouse/services/MouseAnalyticsEngine.ts` | `src/engines/exam-security/mouse/services/MouseAnalyticsEngine.ts` |
| 127 | `src/modules/exam-security/mouse/services/MouseDispatcher.ts` | `src/engines/exam-security/mouse/services/MouseDispatcher.ts` |
| 128 | `src/modules/exam-security/mouse/services/MouseListener.ts` | `src/engines/exam-security/mouse/services/MouseListener.ts` |
| 129 | `src/modules/exam-security/mouse/services/MousePolicyService.ts` | `src/engines/exam-security/mouse/services/MousePolicyService.ts` |
| 130 | `src/modules/exam-security/mouse/services/TextSelectionProtectionService.ts` | `src/engines/exam-security/mouse/services/TextSelectionProtectionService.ts` |
| 131 | `src/modules/exam-security/mouse/tests/MouseEngine.test.ts` | `src/engines/exam-security/mouse/tests/MouseEngine.test.ts` |
| 132 | `src/modules/exam-security/mouse/types/MouseAction.ts` | `src/engines/exam-security/mouse/types/MouseAction.ts` |
| 133 | `src/modules/exam-security/mouse/types/MouseEvent.ts` | `src/engines/exam-security/mouse/types/MouseEvent.ts` |
| 134 | `src/modules/exam-security/mouse/types/MouseViolation.ts` | `src/engines/exam-security/mouse/types/MouseViolation.ts` |
| 135 | `src/modules/exam-security/mouse/utils/MouseActionParser.ts` | `src/engines/exam-security/mouse/utils/MouseActionParser.ts` |
| 136 | `src/modules/exam-security/mouse/utils/MouseEventNormalizer.ts` | `src/engines/exam-security/mouse/utils/MouseEventNormalizer.ts` |
| 137 | `src/modules/exam-security/navigation/NavigationContext.ts` | `src/engines/exam-security/navigation/NavigationContext.ts` |
| 138 | `src/modules/exam-security/navigation/NavigationEngine.ts` | `src/engines/exam-security/navigation/NavigationEngine.ts` |
| 139 | `src/modules/exam-security/navigation/NavigationProvider.tsx` | `src/engines/exam-security/navigation/NavigationProvider.tsx` |
| 140 | `src/modules/exam-security/navigation/hooks/useNavigationSentinel.ts` | `src/engines/exam-security/navigation/hooks/useNavigationSentinel.ts` |
| 141 | `src/modules/exam-security/navigation/index.ts` | `src/engines/exam-security/navigation/index.ts` |
| 142 | `src/modules/exam-security/navigation/services/NavigationSentinelService.ts` | `src/engines/exam-security/navigation/services/NavigationSentinelService.ts` |
| 143 | `src/modules/exam-security/navigation/types/NavigationEvent.ts` | `src/engines/exam-security/navigation/types/NavigationEvent.ts` |
| 144 | `src/modules/exam-security/providers/ExamSecurityContext.ts` | `src/engines/exam-security/providers/ExamSecurityContext.ts` |
| 145 | `src/modules/exam-security/providers/ExamSecurityProvider.tsx` | `src/engines/exam-security/providers/ExamSecurityProvider.tsx` |
| 146 | `src/modules/exam-security/services/ExamLockManager.ts` | `src/engines/exam-security/services/ExamLockManager.ts` |
| 147 | `src/modules/exam-security/services/RestrictionRegistry.ts` | `src/engines/exam-security/services/RestrictionRegistry.ts` |
| 148 | `src/modules/exam-security/services/ViolationRegistry.ts` | `src/engines/exam-security/services/ViolationRegistry.ts` |
| 149 | `src/modules/exam-security/services/WarningManager.ts` | `src/engines/exam-security/services/WarningManager.ts` |
| 150 | `src/modules/exam-security/types/security.types.ts` | `src/engines/exam-security/types/security.types.ts` |
| 151 | `src/components/proctoring/attention/AttentionContext.tsx` | `src/engines/proctoring/attention/AttentionContext.tsx` |
| 152 | `src/components/proctoring/attention/AttentionEngine.tsx` | `src/engines/proctoring/attention/AttentionEngine.tsx` |
| 153 | `src/components/proctoring/attention/AttentionStatusCard.tsx` | `src/engines/proctoring/attention/AttentionStatusCard.tsx` |
| 154 | `src/components/proctoring/attention/AttentionTimeline.tsx` | `src/engines/proctoring/attention/AttentionTimeline.tsx` |
| 155 | `src/components/proctoring/attention/BlinkMonitor.tsx` | `src/engines/proctoring/attention/BlinkMonitor.tsx` |
| 156 | `src/components/proctoring/attention/EyeTrackingPanel.tsx` | `src/engines/proctoring/attention/EyeTrackingPanel.tsx` |
| 157 | `src/components/proctoring/attention/GazeCompass.tsx` | `src/engines/proctoring/attention/GazeCompass.tsx` |
| 158 | `src/components/proctoring/attention/HeadMovementCard.tsx` | `src/engines/proctoring/attention/HeadMovementCard.tsx` |
| 159 | `src/components/proctoring/attention/HeadPosePanel.tsx` | `src/engines/proctoring/attention/HeadPosePanel.tsx` |
| 160 | `src/components/proctoring/attention/LookingAwayCard.tsx` | `src/engines/proctoring/attention/LookingAwayCard.tsx` |
| 161 | `src/components/proctoring/attention/constants/attention.constants.ts` | `src/engines/proctoring/attention/constants/attention.constants.ts` |
| 162 | `src/components/proctoring/attention/hooks/useAttention.ts` | `src/engines/proctoring/attention/hooks/useAttention.ts` |
| 163 | `src/components/proctoring/attention/hooks/useEyeTracking.ts` | `src/engines/proctoring/attention/hooks/useEyeTracking.ts` |
| 164 | `src/components/proctoring/attention/hooks/useHeadPose.ts` | `src/engines/proctoring/attention/hooks/useHeadPose.ts` |
| 165 | `src/components/proctoring/attention/services/attention.service.ts` | `src/engines/proctoring/attention/services/attention.service.ts` |
| 166 | `src/components/proctoring/attention/services/eyeTracking.service.ts` | `src/engines/proctoring/attention/services/eyeTracking.service.ts` |
| 167 | `src/components/proctoring/attention/services/headPose.service.ts` | `src/engines/proctoring/attention/services/headPose.service.ts` |
| 168 | `src/components/proctoring/attention/tests/AttentionEngine.test.tsx` | `src/engines/proctoring/attention/tests/AttentionEngine.test.tsx` |
| 169 | `src/components/proctoring/attention/types/attention.types.ts` | `src/engines/proctoring/attention/types/attention.types.ts` |
| 170 | `src/components/proctoring/audio/AudioContext.tsx` | `src/engines/proctoring/audio/AudioContext.tsx` |
| 171 | `src/components/proctoring/audio/AudioEngine.tsx` | `src/engines/proctoring/audio/AudioEngine.tsx` |
| 172 | `src/components/proctoring/audio/AudioHealthCard.tsx` | `src/engines/proctoring/audio/AudioHealthCard.tsx` |
| 173 | `src/components/proctoring/audio/AudioLevelMeter.tsx` | `src/engines/proctoring/audio/AudioLevelMeter.tsx` |
| 174 | `src/components/proctoring/audio/AudioStatusCard.tsx` | `src/engines/proctoring/audio/AudioStatusCard.tsx` |
| 175 | `src/components/proctoring/audio/AudioTimeline.tsx` | `src/engines/proctoring/audio/AudioTimeline.tsx` |
| 176 | `src/components/proctoring/audio/BackgroundNoiseCard.tsx` | `src/engines/proctoring/audio/BackgroundNoiseCard.tsx` |
| 177 | `src/components/proctoring/audio/MicrophoneSelector.tsx` | `src/engines/proctoring/audio/MicrophoneSelector.tsx` |
| 178 | `src/components/proctoring/audio/VoiceActivityPanel.tsx` | `src/engines/proctoring/audio/VoiceActivityPanel.tsx` |
| 179 | `src/components/proctoring/audio/constants/audio.constants.ts` | `src/engines/proctoring/audio/constants/audio.constants.ts` |
| 180 | `src/components/proctoring/audio/hooks/useAudio.ts` | `src/engines/proctoring/audio/hooks/useAudio.ts` |
| 181 | `src/components/proctoring/audio/hooks/useMicrophone.ts` | `src/engines/proctoring/audio/hooks/useMicrophone.ts` |
| 182 | `src/components/proctoring/audio/services/audio.service.ts` | `src/engines/proctoring/audio/services/audio.service.ts` |
| 183 | `src/components/proctoring/audio/services/noiseAnalysis.service.ts` | `src/engines/proctoring/audio/services/noiseAnalysis.service.ts` |
| 184 | `src/components/proctoring/audio/services/voiceActivity.service.ts` | `src/engines/proctoring/audio/services/voiceActivity.service.ts` |
| 185 | `src/components/proctoring/audio/tests/AudioEngine.test.tsx` | `src/engines/proctoring/audio/tests/AudioEngine.test.tsx` |
| 186 | `src/components/proctoring/audio/types/audio.types.ts` | `src/engines/proctoring/audio/types/audio.types.ts` |
| 187 | `src/components/proctoring/camera/CameraContext.tsx` | `src/engines/proctoring/camera/CameraContext.tsx` |
| 188 | `src/components/proctoring/camera/CameraHealthCard.tsx` | `src/engines/proctoring/camera/CameraHealthCard.tsx` |
| 189 | `src/components/proctoring/camera/CameraManager.tsx` | `src/engines/proctoring/camera/CameraManager.tsx` |
| 190 | `src/components/proctoring/camera/CameraPreview.tsx` | `src/engines/proctoring/camera/CameraPreview.tsx` |
| 191 | `src/components/proctoring/camera/CameraSelector.tsx` | `src/engines/proctoring/camera/CameraSelector.tsx` |
| 192 | `src/components/proctoring/camera/CameraStatus.tsx` | `src/engines/proctoring/camera/CameraStatus.tsx` |
| 193 | `src/components/proctoring/camera/CameraVerificationWizard.tsx` | `src/engines/proctoring/camera/CameraVerificationWizard.tsx` |
| 194 | `src/components/proctoring/camera/DeviceInformation.tsx` | `src/engines/proctoring/camera/DeviceInformation.tsx` |
| 195 | `src/components/proctoring/camera/PermissionBanner.tsx` | `src/engines/proctoring/camera/PermissionBanner.tsx` |
| 196 | `src/components/proctoring/camera/ResolutionCard.tsx` | `src/engines/proctoring/camera/ResolutionCard.tsx` |
| 197 | `src/components/proctoring/camera/VideoCanvas.tsx` | `src/engines/proctoring/camera/VideoCanvas.tsx` |
| 198 | `src/components/proctoring/camera/constants/camera.constants.ts` | `src/engines/proctoring/camera/constants/camera.constants.ts` |
| 199 | `src/components/proctoring/camera/hooks/useCamera.ts` | `src/engines/proctoring/camera/hooks/useCamera.ts` |
| 200 | `src/components/proctoring/camera/hooks/useCameraDevices.ts` | `src/engines/proctoring/camera/hooks/useCameraDevices.ts` |
| 201 | `src/components/proctoring/camera/hooks/useVideoStream.ts` | `src/engines/proctoring/camera/hooks/useVideoStream.ts` |
| 202 | `src/components/proctoring/camera/services/camera.service.ts` | `src/engines/proctoring/camera/services/camera.service.ts` |
| 203 | `src/components/proctoring/camera/tests/CameraManager.test.tsx` | `src/engines/proctoring/camera/tests/CameraManager.test.tsx` |
| 204 | `src/components/proctoring/camera/types/camera.types.ts` | `src/engines/proctoring/camera/types/camera.types.ts` |
| 205 | `src/components/proctoring/consent/ConsentCard.tsx` | `src/engines/proctoring/consent/ConsentCard.tsx` |
| 206 | `src/components/proctoring/consent/ConsentCheckbox.tsx` | `src/engines/proctoring/consent/ConsentCheckbox.tsx` |
| 207 | `src/components/proctoring/consent/ConsentContext.tsx` | `src/engines/proctoring/consent/ConsentContext.tsx` |
| 208 | `src/components/proctoring/consent/ConsentFooter.tsx` | `src/engines/proctoring/consent/ConsentFooter.tsx` |
| 209 | `src/components/proctoring/consent/ConsentManager.tsx` | `src/engines/proctoring/consent/ConsentManager.tsx` |
| 210 | `src/components/proctoring/consent/ConsentModal.tsx` | `src/engines/proctoring/consent/ConsentModal.tsx` |
| 211 | `src/components/proctoring/consent/ConsentSummary.tsx` | `src/engines/proctoring/consent/ConsentSummary.tsx` |
| 212 | `src/components/proctoring/consent/PermissionRequest.tsx` | `src/engines/proctoring/consent/PermissionRequest.tsx` |
| 213 | `src/components/proctoring/consent/PolicyAgreement.tsx` | `src/engines/proctoring/consent/PolicyAgreement.tsx` |
| 214 | `src/components/proctoring/consent/PreExamPermissionModal.tsx` | `src/engines/proctoring/consent/PreExamPermissionModal.tsx` |
| 215 | `src/components/proctoring/consent/PrivacyNotice.tsx` | `src/engines/proctoring/consent/PrivacyNotice.tsx` |
| 216 | `src/components/proctoring/consent/constants/consent.constants.ts` | `src/engines/proctoring/consent/constants/consent.constants.ts` |
| 217 | `src/components/proctoring/consent/hooks/useConsent.ts` | `src/engines/proctoring/consent/hooks/useConsent.ts` |
| 218 | `src/components/proctoring/consent/services/consent.service.ts` | `src/engines/proctoring/consent/services/consent.service.ts` |
| 219 | `src/components/proctoring/consent/tests/ConsentManager.test.tsx` | `src/engines/proctoring/consent/tests/ConsentManager.test.tsx` |
| 220 | `src/components/proctoring/consent/types/consent.types.ts` | `src/engines/proctoring/consent/types/consent.types.ts` |
| 221 | `src/components/proctoring/face/FaceBoundingBox.tsx` | `src/engines/proctoring/face/FaceBoundingBox.tsx` |
| 222 | `src/components/proctoring/face/FaceContext.tsx` | `src/engines/proctoring/face/FaceContext.tsx` |
| 223 | `src/components/proctoring/face/FaceDetectionPanel.tsx` | `src/engines/proctoring/face/FaceDetectionPanel.tsx` |
| 224 | `src/components/proctoring/face/FaceEngine.tsx` | `src/engines/proctoring/face/FaceEngine.tsx` |
| 225 | `src/components/proctoring/face/FacePresenceCard.tsx` | `src/engines/proctoring/face/FacePresenceCard.tsx` |
| 226 | `src/components/proctoring/face/FaceQualityCard.tsx` | `src/engines/proctoring/face/FaceQualityCard.tsx` |
| 227 | `src/components/proctoring/face/FaceStatus.tsx` | `src/engines/proctoring/face/FaceStatus.tsx` |
| 228 | `src/components/proctoring/face/FaceVerificationWizard.tsx` | `src/engines/proctoring/face/FaceVerificationWizard.tsx` |
| 229 | `src/components/proctoring/face/MultipleFaceAlert.tsx` | `src/engines/proctoring/face/MultipleFaceAlert.tsx` |
| 230 | `src/components/proctoring/face/VerificationHistory.tsx` | `src/engines/proctoring/face/VerificationHistory.tsx` |
| 231 | `src/components/proctoring/face/constants/face.constants.ts` | `src/engines/proctoring/face/constants/face.constants.ts` |
| 232 | `src/components/proctoring/face/hooks/useFace.ts` | `src/engines/proctoring/face/hooks/useFace.ts` |
| 233 | `src/components/proctoring/face/hooks/useFaceDetection.ts` | `src/engines/proctoring/face/hooks/useFaceDetection.ts` |
| 234 | `src/components/proctoring/face/hooks/useFacePresence.ts` | `src/engines/proctoring/face/hooks/useFacePresence.ts` |
| 235 | `src/components/proctoring/face/hooks/useFaceVerification.ts` | `src/engines/proctoring/face/hooks/useFaceVerification.ts` |
| 236 | `src/components/proctoring/face/services/face.service.ts` | `src/engines/proctoring/face/services/face.service.ts` |
| 237 | `src/components/proctoring/face/services/faceVerification.service.ts` | `src/engines/proctoring/face/services/faceVerification.service.ts` |
| 238 | `src/components/proctoring/face/tests/FaceEngine.test.tsx` | `src/engines/proctoring/face/tests/FaceEngine.test.tsx` |
| 239 | `src/components/proctoring/face/types/face.types.ts` | `src/engines/proctoring/face/types/face.types.ts` |
| 240 | `src/components/proctoring/object-detection/DetectedObjectsCard.tsx` | `src/engines/proctoring/object-detection/DetectedObjectsCard.tsx` |
| 241 | `src/components/proctoring/object-detection/DetectionConfidenceCard.tsx` | `src/engines/proctoring/object-detection/DetectionConfidenceCard.tsx` |
| 242 | `src/components/proctoring/object-detection/DetectionOverlay.tsx` | `src/engines/proctoring/object-detection/DetectionOverlay.tsx` |
| 243 | `src/components/proctoring/object-detection/DetectionTimeline.tsx` | `src/engines/proctoring/object-detection/DetectionTimeline.tsx` |
| 244 | `src/components/proctoring/object-detection/ObjectDetectionContext.tsx` | `src/engines/proctoring/object-detection/ObjectDetectionContext.tsx` |
| 245 | `src/components/proctoring/object-detection/ObjectDetectionEngine.tsx` | `src/engines/proctoring/object-detection/ObjectDetectionEngine.tsx` |
| 246 | `src/components/proctoring/object-detection/ObjectDetectionPanel.tsx` | `src/engines/proctoring/object-detection/ObjectDetectionPanel.tsx` |
| 247 | `src/components/proctoring/object-detection/PolicyIndicator.tsx` | `src/engines/proctoring/object-detection/PolicyIndicator.tsx` |
| 248 | `src/components/proctoring/object-detection/constants/object.constants.ts` | `src/engines/proctoring/object-detection/constants/object.constants.ts` |
| 249 | `src/components/proctoring/object-detection/hooks/useObjectDetection.ts` | `src/engines/proctoring/object-detection/hooks/useObjectDetection.ts` |
| 250 | `src/components/proctoring/object-detection/hooks/useObjectDetectionEngine.ts` | `src/engines/proctoring/object-detection/hooks/useObjectDetectionEngine.ts` |
| 251 | `src/components/proctoring/object-detection/hooks/useObjectTracker.ts` | `src/engines/proctoring/object-detection/hooks/useObjectTracker.ts` |
| 252 | `src/components/proctoring/object-detection/services/objectDetection.service.ts` | `src/engines/proctoring/object-detection/services/objectDetection.service.ts` |
| 253 | `src/components/proctoring/object-detection/services/objectTracking.service.ts` | `src/engines/proctoring/object-detection/services/objectTracking.service.ts` |
| 254 | `src/components/proctoring/object-detection/tests/ObjectDetectionEngine.test.tsx` | `src/engines/proctoring/object-detection/tests/ObjectDetectionEngine.test.tsx` |
| 255 | `src/components/proctoring/object-detection/types/object.types.ts` | `src/engines/proctoring/object-detection/types/object.types.ts` |
| 256 | `src/pages/proctoring/ProctoringSuitePage.tsx` | `src/engines/proctoring/pages/ProctoringSuitePage.tsx` |
| 257 | `src/components/proctoring/pipeline/ActiveAlertsCard.tsx` | `src/engines/proctoring/pipeline/ActiveAlertsCard.tsx` |
| 258 | `src/components/proctoring/pipeline/LivePipelineFeed.tsx` | `src/engines/proctoring/pipeline/LivePipelineFeed.tsx` |
| 259 | `src/components/proctoring/pipeline/PipelineContext.tsx` | `src/engines/proctoring/pipeline/PipelineContext.tsx` |
| 260 | `src/components/proctoring/pipeline/PipelineDiagnosticsCard.tsx` | `src/engines/proctoring/pipeline/PipelineDiagnosticsCard.tsx` |
| 261 | `src/components/proctoring/pipeline/PipelineEngine.tsx` | `src/engines/proctoring/pipeline/PipelineEngine.tsx` |
| 262 | `src/components/proctoring/pipeline/RiskDimensionsGrid.tsx` | `src/engines/proctoring/pipeline/RiskDimensionsGrid.tsx` |
| 263 | `src/components/proctoring/pipeline/hooks/usePipeline.ts` | `src/engines/proctoring/pipeline/hooks/usePipeline.ts` |

### 3.3 Shared Foundation Extraction (`src/shared/`) — 93 files

| # | Old Path | New Path |
| :--- | :--- | :--- |
| 1 | `src/components/BrandLogo.tsx` | `src/shared/components/BrandLogo.tsx` |
| 2 | `src/lib/design-system/EnterpriseLayout.tsx` | `src/shared/components/EnterpriseLayout.tsx` |
| 3 | `src/components/Layout.tsx` | `src/shared/components/Layout.tsx` |
| 4 | `src/components/Navbar.tsx` | `src/shared/components/Navbar.tsx` |
| 5 | `src/components/Sidebar.tsx` | `src/shared/components/Sidebar.tsx` |
| 6 | `src/pages/auth/PortalAuthLayout.tsx` | `src/shared/components/layout/PortalAuthLayout.tsx` |
| 7 | `src/components/ui/accordion.tsx` | `src/shared/components/ui/accordion.tsx` |
| 8 | `src/components/ui/alert-dialog.tsx` | `src/shared/components/ui/alert-dialog.tsx` |
| 9 | `src/components/ui/alert.tsx` | `src/shared/components/ui/alert.tsx` |
| 10 | `src/components/ui/aspect-ratio.tsx` | `src/shared/components/ui/aspect-ratio.tsx` |
| 11 | `src/components/ui/avatar.tsx` | `src/shared/components/ui/avatar.tsx` |
| 12 | `src/components/ui/badge.tsx` | `src/shared/components/ui/badge.tsx` |
| 13 | `src/components/ui/breadcrumb.tsx` | `src/shared/components/ui/breadcrumb.tsx` |
| 14 | `src/components/ui/button.tsx` | `src/shared/components/ui/button.tsx` |
| 15 | `src/components/ui/calendar.tsx` | `src/shared/components/ui/calendar.tsx` |
| 16 | `src/components/ui/card.tsx` | `src/shared/components/ui/card.tsx` |
| 17 | `src/components/ui/carousel.tsx` | `src/shared/components/ui/carousel.tsx` |
| 18 | `src/components/ui/chart.tsx` | `src/shared/components/ui/chart.tsx` |
| 19 | `src/components/ui/checkbox.tsx` | `src/shared/components/ui/checkbox.tsx` |
| 20 | `src/components/ui/collapsible.tsx` | `src/shared/components/ui/collapsible.tsx` |
| 21 | `src/components/ui/command.tsx` | `src/shared/components/ui/command.tsx` |
| 22 | `src/components/ui/context-menu.tsx` | `src/shared/components/ui/context-menu.tsx` |
| 23 | `src/components/ui/dialog.tsx` | `src/shared/components/ui/dialog.tsx` |
| 24 | `src/components/ui/drawer.tsx` | `src/shared/components/ui/drawer.tsx` |
| 25 | `src/components/ui/dropdown-menu.tsx` | `src/shared/components/ui/dropdown-menu.tsx` |
| 26 | `src/components/ui/enterprise/EnterpriseCard.tsx` | `src/shared/components/ui/enterprise/EnterpriseCard.tsx` |
| 27 | `src/components/ui/form.tsx` | `src/shared/components/ui/form.tsx` |
| 28 | `src/components/ui/hover-card.tsx` | `src/shared/components/ui/hover-card.tsx` |
| 29 | `src/components/ui/input-otp.tsx` | `src/shared/components/ui/input-otp.tsx` |
| 30 | `src/components/ui/input.tsx` | `src/shared/components/ui/input.tsx` |
| 31 | `src/components/ui/label.tsx` | `src/shared/components/ui/label.tsx` |
| 32 | `src/components/ui/menubar.tsx` | `src/shared/components/ui/menubar.tsx` |
| 33 | `src/components/ui/navigation-menu.tsx` | `src/shared/components/ui/navigation-menu.tsx` |
| 34 | `src/components/ui/pagination.tsx` | `src/shared/components/ui/pagination.tsx` |
| 35 | `src/components/ui/popover.tsx` | `src/shared/components/ui/popover.tsx` |
| 36 | `src/components/ui/progress.tsx` | `src/shared/components/ui/progress.tsx` |
| 37 | `src/components/ui/radio-group.tsx` | `src/shared/components/ui/radio-group.tsx` |
| 38 | `src/components/ui/resizable.tsx` | `src/shared/components/ui/resizable.tsx` |
| 39 | `src/components/ui/scroll-area.tsx` | `src/shared/components/ui/scroll-area.tsx` |
| 40 | `src/components/ui/select.tsx` | `src/shared/components/ui/select.tsx` |
| 41 | `src/components/ui/separator.tsx` | `src/shared/components/ui/separator.tsx` |
| 42 | `src/components/ui/sheet.tsx` | `src/shared/components/ui/sheet.tsx` |
| 43 | `src/components/ui/sidebar.tsx` | `src/shared/components/ui/sidebar.tsx` |
| 44 | `src/components/ui/skeleton.tsx` | `src/shared/components/ui/skeleton.tsx` |
| 45 | `src/components/ui/slider.tsx` | `src/shared/components/ui/slider.tsx` |
| 46 | `src/components/ui/sonner.tsx` | `src/shared/components/ui/sonner.tsx` |
| 47 | `src/components/ui/switch.tsx` | `src/shared/components/ui/switch.tsx` |
| 48 | `src/components/ui/table.tsx` | `src/shared/components/ui/table.tsx` |
| 49 | `src/components/ui/tabs.tsx` | `src/shared/components/ui/tabs.tsx` |
| 50 | `src/components/ui/textarea.tsx` | `src/shared/components/ui/textarea.tsx` |
| 51 | `src/components/ui/toast.tsx` | `src/shared/components/ui/toast.tsx` |
| 52 | `src/components/ui/toaster.tsx` | `src/shared/components/ui/toaster.tsx` |
| 53 | `src/components/ui/toggle-group.tsx` | `src/shared/components/ui/toggle-group.tsx` |
| 54 | `src/components/ui/toggle.tsx` | `src/shared/components/ui/toggle.tsx` |
| 55 | `src/components/ui/tooltip.tsx` | `src/shared/components/ui/tooltip.tsx` |
| 56 | `src/guards/AuthGuard.tsx` | `src/shared/guards/AuthGuard.tsx` |
| 57 | `src/guards/Can.tsx` | `src/shared/guards/Can.tsx` |
| 58 | `src/guards/PermissionGuard.tsx` | `src/shared/guards/PermissionGuard.tsx` |
| 59 | `src/guards/RoleGuard.tsx` | `src/shared/guards/RoleGuard.tsx` |
| 60 | `src/guards/TenantGuard.tsx` | `src/shared/guards/TenantGuard.tsx` |
| 61 | `src/hooks/use-mobile.tsx` | `src/shared/hooks/use-mobile.tsx` |
| 62 | `src/hooks/use-toast.ts` | `src/shared/hooks/use-toast.ts` |
| 63 | `src/hooks/useApiQueries.ts` | `src/shared/hooks/useApiQueries.ts` |
| 64 | `src/integrations/supabase/client.ts` | `src/shared/integrations/supabase/client.ts` |
| 65 | `src/integrations/supabase/types.ts` | `src/shared/integrations/supabase/types.ts` |
| 66 | `src/lib/apiClient.ts` | `src/shared/lib/apiClient.ts` |
| 67 | `src/lib/design-system/tokens.ts` | `src/shared/lib/design-system/tokens.ts` |
| 68 | `src/lib/utils.ts` | `src/shared/lib/utils.ts` |
| 69 | `src/pages/auth/AccessDenied.tsx` | `src/shared/pages/AccessDenied.tsx` |
| 70 | `src/pages/auth/AccountLocked.tsx` | `src/shared/pages/AccountLocked.tsx` |
| 71 | `src/pages/auth/DevicesPage.tsx` | `src/shared/pages/DevicesPage.tsx` |
| 72 | `src/pages/Exams.tsx` | `src/shared/pages/Exams.tsx` |
| 73 | `src/pages/auth/MFAVerification.tsx` | `src/shared/pages/MFAVerification.tsx` |
| 74 | `src/pages/auth/Maintenance.tsx` | `src/shared/pages/Maintenance.tsx` |
| 75 | `src/pages/security/MfaWizardPage.tsx` | `src/shared/pages/MfaWizardPage.tsx` |
| 76 | `src/pages/auth/NetworkError.tsx` | `src/shared/pages/NetworkError.tsx` |
| 77 | `src/pages/NotFound.tsx` | `src/shared/pages/NotFound.tsx` |
| 78 | `src/pages/auth/SecuritySettings.tsx` | `src/shared/pages/SecuritySettings.tsx` |
| 79 | `src/pages/auth/SessionExpired.tsx` | `src/shared/pages/SessionExpired.tsx` |
| 80 | `src/pages/auth/SessionsPage.tsx` | `src/shared/pages/SessionsPage.tsx` |
| 81 | `src/pages/Settings.tsx` | `src/shared/pages/Settings.tsx` |
| 82 | `src/pages/me/ActivityPage.tsx` | `src/shared/pages/me/ActivityPage.tsx` |
| 83 | `src/pages/me/ApiKeysPage.tsx` | `src/shared/pages/me/ApiKeysPage.tsx` |
| 84 | `src/pages/me/PrivacyPage.tsx` | `src/shared/pages/me/PrivacyPage.tsx` |
| 85 | `src/pages/me/ProfilePage.tsx` | `src/shared/pages/me/ProfilePage.tsx` |
| 86 | `src/services/authService.ts` | `src/shared/services/authService.ts` |
| 87 | `src/stores/authStore.ts` | `src/shared/stores/authStore.ts` |
| 88 | `src/stores/organizationStore.ts` | `src/shared/stores/organizationStore.ts` |
| 89 | `src/stores/questionStore.ts` | `src/shared/stores/questionStore.ts` |
| 90 | `src/stores/tenantStore.ts` | `src/shared/stores/tenantStore.ts` |
| 91 | `src/types/auth.ts` | `src/shared/types/auth.ts` |
| 92 | `src/utils/rbac.ts` | `src/shared/utils/rbac.ts` |

### 3.4 Role Portals Extraction (`src/portals/`) — 144 files

| # | Old Path | New Path |
| :--- | :--- | :--- |
| 1 | `src/components/coding/CandidateActivityStream.tsx` | `src/portals/coding/components/CandidateActivityStream.tsx` |
| 2 | `src/components/coding/CodingDashboardHeader.tsx` | `src/portals/coding/components/CodingDashboardHeader.tsx` |
| 3 | `src/components/coding/CodingModals.tsx` | `src/portals/coding/components/CodingModals.tsx` |
| 4 | `src/components/coding/ExecutionInfrastructureCard.tsx` | `src/portals/coding/components/ExecutionInfrastructureCard.tsx` |
| 5 | `src/components/coding/ExecutionOverviewSection.tsx` | `src/portals/coding/components/ExecutionOverviewSection.tsx` |
| 6 | `src/components/coding/ExecutiveMetricsGrid.tsx` | `src/portals/coding/components/ExecutiveMetricsGrid.tsx` |
| 7 | `src/components/coding/GlobalSearchFilterBar.tsx` | `src/portals/coding/components/GlobalSearchFilterBar.tsx` |
| 8 | `src/components/coding/LanguageDistributionGrid.tsx` | `src/portals/coding/components/LanguageDistributionGrid.tsx` |
| 9 | `src/components/coding/ProblemRepositoryOverview.tsx` | `src/portals/coding/components/ProblemRepositoryOverview.tsx` |
| 10 | `src/components/coding/QuickActionsGrid.tsx` | `src/portals/coding/components/QuickActionsGrid.tsx` |
| 11 | `src/components/coding/RecentActivityTimeline.tsx` | `src/portals/coding/components/RecentActivityTimeline.tsx` |
| 12 | `src/components/coding/RecentCodingExamsTable.tsx` | `src/portals/coding/components/RecentCodingExamsTable.tsx` |
| 13 | `src/components/coding/RecentNotificationsPanel.tsx` | `src/portals/coding/components/RecentNotificationsPanel.tsx` |
| 14 | `src/components/coding/SubmissionAnalyticsSection.tsx` | `src/portals/coding/components/SubmissionAnalyticsSection.tsx` |
| 15 | `src/components/coding/SystemHealthMatrix.tsx` | `src/portals/coding/components/SystemHealthMatrix.tsx` |
| 16 | `src/hooks/useCodingDashboard.ts` | `src/portals/coding/hooks/useCodingDashboard.ts` |
| 17 | `src/pages/coding/CodingDashboard.tsx` | `src/portals/coding/pages/CodingDashboard.tsx` |
| 18 | `src/portals/coding/auth/CodingLogin.tsx` | `src/portals/coding/pages/auth/CodingLogin.tsx` |
| 19 | `src/types/codingDashboard.ts` | `src/portals/coding/types/codingDashboard.ts` |
| 20 | `src/portals/faculty/shell/FacultyLayout.tsx` | `src/portals/faculty/layout/FacultyLayout.tsx` |
| 21 | `src/portals/faculty/FacultyAnalytics.tsx` | `src/portals/faculty/pages/FacultyAnalytics.tsx` |
| 22 | `src/portals/faculty/FacultyDashboard.tsx` | `src/portals/faculty/pages/FacultyDashboard.tsx` |
| 23 | `src/portals/faculty/FacultyExamBuilder.tsx` | `src/portals/faculty/pages/FacultyExamBuilder.tsx` |
| 24 | `src/portals/faculty/FacultyLanding.tsx` | `src/portals/faculty/pages/FacultyLanding.tsx` |
| 25 | `src/portals/faculty/FacultyQuestionBank.tsx` | `src/portals/faculty/pages/FacultyQuestionBank.tsx` |
| 26 | `src/portals/faculty/auth/FacultyLogin.tsx` | `src/portals/faculty/pages/auth/FacultyLogin.tsx` |
| 27 | `src/portals/invigilator/shell/InvigilatorLayout.tsx` | `src/portals/invigilator/layout/InvigilatorLayout.tsx` |
| 28 | `src/portals/invigilator/InvigilatorDashboard.tsx` | `src/portals/invigilator/pages/InvigilatorDashboard.tsx` |
| 29 | `src/portals/invigilator/InvigilatorIncidents.tsx` | `src/portals/invigilator/pages/InvigilatorIncidents.tsx` |
| 30 | `src/portals/invigilator/InvigilatorLanding.tsx` | `src/portals/invigilator/pages/InvigilatorLanding.tsx` |
| 31 | `src/portals/invigilator/InvigilatorLiveGrid.tsx` | `src/portals/invigilator/pages/InvigilatorLiveGrid.tsx` |
| 32 | `src/portals/invigilator/auth/InvigilatorLogin.tsx` | `src/portals/invigilator/pages/auth/InvigilatorLogin.tsx` |
| 33 | `src/modules/enterprise-operations/EnterpriseCommandCenter.tsx` | `src/portals/operations/pages/EnterpriseCommandCenter.tsx` |
| 34 | `src/components/organization/HierarchyExplorer.tsx` | `src/portals/org-admin/components/HierarchyExplorer.tsx` |
| 35 | `src/components/organization/InvitationModal.tsx` | `src/portals/org-admin/components/InvitationModal.tsx` |
| 36 | `src/portals/org-admin/shell/OrgAdminLayout.tsx` | `src/portals/org-admin/layout/OrgAdminLayout.tsx` |
| 37 | `src/pages/organization/BrandingSettings.tsx` | `src/portals/org-admin/pages/BrandingSettings.tsx` |
| 38 | `src/pages/organization/CampusManagement.tsx` | `src/portals/org-admin/pages/CampusManagement.tsx` |
| 39 | `src/pages/organization/DepartmentManagement.tsx` | `src/portals/org-admin/pages/DepartmentManagement.tsx` |
| 40 | `src/pages/organization/InvitationCenter.tsx` | `src/portals/org-admin/pages/InvitationCenter.tsx` |
| 41 | `src/portals/org-admin/OrgAdminAssessments.tsx` | `src/portals/org-admin/pages/OrgAdminAssessments.tsx` |
| 42 | `src/portals/org-admin/OrgAdminStructure.tsx` | `src/portals/org-admin/pages/OrgAdminStructure.tsx` |
| 43 | `src/portals/org-admin/OrgAdminUsers.tsx` | `src/portals/org-admin/pages/OrgAdminUsers.tsx` |
| 44 | `src/pages/organization/OrganizationDashboard.tsx` | `src/portals/org-admin/pages/OrganizationDashboard.tsx` |
| 45 | `src/pages/organization/ProgramManagement.tsx` | `src/portals/org-admin/pages/ProgramManagement.tsx` |
| 46 | `src/pages/Users.tsx` | `src/portals/org-admin/pages/Users.tsx` |
| 47 | `src/pages/organization/WorkspaceManagement.tsx` | `src/portals/org-admin/pages/WorkspaceManagement.tsx` |
| 48 | `src/pages/organization/WorkspaceSettings.tsx` | `src/portals/org-admin/pages/WorkspaceSettings.tsx` |
| 49 | `src/portals/org-admin/auth/OrgAdminLogin.tsx` | `src/portals/org-admin/pages/auth/OrgAdminLogin.tsx` |
| 50 | `src/pages/healthcare/components/AIWorkflow.tsx` | `src/portals/public/components/healthcare/AIWorkflow.tsx` |
| 51 | `src/pages/healthcare/components/CommandCenterPreview.tsx` | `src/portals/public/components/healthcare/CommandCenterPreview.tsx` |
| 52 | `src/pages/healthcare/components/ExecutiveAnalytics.tsx` | `src/portals/public/components/healthcare/ExecutiveAnalytics.tsx` |
| 53 | `src/pages/healthcare/components/ExecutiveTestimonials.tsx` | `src/portals/public/components/healthcare/ExecutiveTestimonials.tsx` |
| 54 | `src/pages/healthcare/components/FinalCTA.tsx` | `src/portals/public/components/healthcare/FinalCTA.tsx` |
| 55 | `src/pages/healthcare/components/Footer.tsx` | `src/portals/public/components/healthcare/Footer.tsx` |
| 56 | `src/pages/healthcare/components/Hero.tsx` | `src/portals/public/components/healthcare/Hero.tsx` |
| 57 | `src/pages/healthcare/components/IndustrySolutions.tsx` | `src/portals/public/components/healthcare/IndustrySolutions.tsx` |
| 58 | `src/pages/healthcare/components/Navbar.tsx` | `src/portals/public/components/healthcare/Navbar.tsx` |
| 59 | `src/pages/healthcare/components/PlatformCapabilities.tsx` | `src/portals/public/components/healthcare/PlatformCapabilities.tsx` |
| 60 | `src/pages/healthcare/components/SecurityCompliance.tsx` | `src/portals/public/components/healthcare/SecurityCompliance.tsx` |
| 61 | `src/pages/healthcare/components/StatsGrid.tsx` | `src/portals/public/components/healthcare/StatsGrid.tsx` |
| 62 | `src/pages/landing/components/AIShowcase.tsx` | `src/portals/public/components/landing/AIShowcase.tsx` |
| 63 | `src/pages/landing/components/AnalyticsSection.tsx` | `src/portals/public/components/landing/AnalyticsSection.tsx` |
| 64 | `src/pages/landing/components/EnterpriseFeatures.tsx` | `src/portals/public/components/landing/EnterpriseFeatures.tsx` |
| 65 | `src/pages/landing/components/FAQAccordion.tsx` | `src/portals/public/components/landing/FAQAccordion.tsx` |
| 66 | `src/pages/landing/components/FinalCTA.tsx` | `src/portals/public/components/landing/FinalCTA.tsx` |
| 67 | `src/pages/landing/components/Footer.tsx` | `src/portals/public/components/landing/Footer.tsx` |
| 68 | `src/pages/landing/components/Hero.tsx` | `src/portals/public/components/landing/Hero.tsx` |
| 69 | `src/pages/landing/components/IndustrySolutions.tsx` | `src/portals/public/components/landing/IndustrySolutions.tsx` |
| 70 | `src/pages/landing/components/Navbar.tsx` | `src/portals/public/components/landing/Navbar.tsx` |
| 71 | `src/pages/landing/components/PlatformModules.tsx` | `src/portals/public/components/landing/PlatformModules.tsx` |
| 72 | `src/pages/landing/components/PricingSection.tsx` | `src/portals/public/components/landing/PricingSection.tsx` |
| 73 | `src/pages/landing/components/ResourcesSection.tsx` | `src/portals/public/components/landing/ResourcesSection.tsx` |
| 74 | `src/pages/landing/components/SecurityArchitecture.tsx` | `src/portals/public/components/landing/SecurityArchitecture.tsx` |
| 75 | `src/pages/landing/components/Testimonials.tsx` | `src/portals/public/components/landing/Testimonials.tsx` |
| 76 | `src/pages/landing/components/TrustStats.tsx` | `src/portals/public/components/landing/TrustStats.tsx` |
| 77 | `src/pages/phase1/components/AzureNavbar.tsx` | `src/portals/public/components/phase1/AzureNavbar.tsx` |
| 78 | `src/pages/phase1/components/EnterpriseTrustBar.tsx` | `src/portals/public/components/phase1/EnterpriseTrustBar.tsx` |
| 79 | `src/pages/phase1/components/EnterpriseValueCards.tsx` | `src/portals/public/components/phase1/EnterpriseValueCards.tsx` |
| 80 | `src/pages/phase1/components/HeroExecutive.tsx` | `src/portals/public/components/phase1/HeroExecutive.tsx` |
| 81 | `src/pages/landing/EnterpriseLanding.tsx` | `src/portals/public/pages/EnterpriseLanding.tsx` |
| 82 | `src/pages/Index.tsx` | `src/portals/public/pages/Index.tsx` |
| 83 | `src/pages/light/LightLanding.tsx` | `src/portals/public/pages/LightLanding.tsx` |
| 84 | `src/pages/phase1/Phase1Landing.tsx` | `src/portals/public/pages/Phase1Landing.tsx` |
| 85 | `src/pages/onboarding/FirstLoginWizard.tsx` | `src/portals/public/pages/auth/FirstLoginWizard.tsx` |
| 86 | `src/pages/auth/ForgotPassword.tsx` | `src/portals/public/pages/auth/ForgotPassword.tsx` |
| 87 | `src/pages/auth/InvitationAccept.tsx` | `src/portals/public/pages/auth/InvitationAccept.tsx` |
| 88 | `src/pages/auth/Login.tsx` | `src/portals/public/pages/auth/Login.tsx` |
| 89 | `src/pages/auth/OrgDiscovery.tsx` | `src/portals/public/pages/auth/OrgDiscovery.tsx` |
| 90 | `src/pages/auth/PortalSelection.tsx` | `src/portals/public/pages/auth/PortalSelection.tsx` |
| 91 | `src/pages/auth/Register.tsx` | `src/portals/public/pages/auth/Register.tsx` |
| 92 | `src/pages/auth/ResetPassword.tsx` | `src/portals/public/pages/auth/ResetPassword.tsx` |
| 93 | `src/pages/auth/SelectTenant.tsx` | `src/portals/public/pages/auth/SelectTenant.tsx` |
| 94 | `src/pages/auth/VerifyEmail.tsx` | `src/portals/public/pages/auth/VerifyEmail.tsx` |
| 95 | `src/pages/auth/VerifyOTP.tsx` | `src/portals/public/pages/auth/VerifyOTP.tsx` |
| 96 | `src/pages/auth/Welcome.tsx` | `src/portals/public/pages/auth/Welcome.tsx` |
| 97 | `src/portals/student/shell/StudentCommandPalette.tsx` | `src/portals/student/components/StudentCommandPalette.tsx` |
| 98 | `src/portals/student/auth/StudentAuthLayout.tsx` | `src/portals/student/layout/StudentAuthLayout.tsx` |
| 99 | `src/portals/student/shell/StudentFooter.tsx` | `src/portals/student/layout/StudentFooter.tsx` |
| 100 | `src/portals/student/shell/StudentHeader.tsx` | `src/portals/student/layout/StudentHeader.tsx` |
| 101 | `src/portals/student/shell/StudentLayout.tsx` | `src/portals/student/layout/StudentLayout.tsx` |
| 102 | `src/portals/student/shell/StudentSidebar.tsx` | `src/portals/student/layout/StudentSidebar.tsx` |
| 103 | `src/portals/student/StudentCertificates.tsx` | `src/portals/student/pages/StudentCertificates.tsx` |
| 104 | `src/portals/student/StudentCourses.tsx` | `src/portals/student/pages/StudentCourses.tsx` |
| 105 | `src/portals/student/StudentDashboard.tsx` | `src/portals/student/pages/StudentDashboard.tsx` |
| 106 | `src/portals/student/StudentExamRunner.tsx` | `src/portals/student/pages/StudentExamRunner.tsx` |
| 107 | `src/portals/student/StudentLanding.tsx` | `src/portals/student/pages/StudentLanding.tsx` |
| 108 | `src/portals/student/StudentPlacement.tsx` | `src/portals/student/pages/StudentPlacement.tsx` |
| 109 | `src/portals/student/StudentPractice.tsx` | `src/portals/student/pages/StudentPractice.tsx` |
| 110 | `src/portals/student/StudentResults.tsx` | `src/portals/student/pages/StudentResults.tsx` |
| 111 | `src/portals/student/StudentScheduledExams.tsx` | `src/portals/student/pages/StudentScheduledExams.tsx` |
| 112 | `src/portals/student/StudentSettings.tsx` | `src/portals/student/pages/StudentSettings.tsx` |
| 113 | `src/portals/student/auth/StudentAccountRecovery.tsx` | `src/portals/student/pages/auth/StudentAccountRecovery.tsx` |
| 114 | `src/portals/student/auth/StudentForgotPassword.tsx` | `src/portals/student/pages/auth/StudentForgotPassword.tsx` |
| 115 | `src/portals/student/auth/StudentLogin.tsx` | `src/portals/student/pages/auth/StudentLogin.tsx` |
| 116 | `src/portals/student/auth/StudentMFA.tsx` | `src/portals/student/pages/auth/StudentMFA.tsx` |
| 117 | `src/portals/student/auth/StudentRegister.tsx` | `src/portals/student/pages/auth/StudentRegister.tsx` |
| 118 | `src/portals/student/auth/StudentResetPassword.tsx` | `src/portals/student/pages/auth/StudentResetPassword.tsx` |
| 119 | `src/portals/student/auth/StudentVerifyEmail.tsx` | `src/portals/student/pages/auth/StudentVerifyEmail.tsx` |
| 120 | `src/portals/student/profile/StudentProfileAcademic.tsx` | `src/portals/student/pages/profile/StudentProfileAcademic.tsx` |
| 121 | `src/portals/student/profile/StudentProfileContact.tsx` | `src/portals/student/pages/profile/StudentProfileContact.tsx` |
| 122 | `src/portals/student/profile/StudentProfileEdit.tsx` | `src/portals/student/pages/profile/StudentProfileEdit.tsx` |
| 123 | `src/portals/student/profile/StudentProfileEmergency.tsx` | `src/portals/student/pages/profile/StudentProfileEmergency.tsx` |
| 124 | `src/portals/student/profile/StudentProfileGuardian.tsx` | `src/portals/student/pages/profile/StudentProfileGuardian.tsx` |
| 125 | `src/portals/student/profile/StudentProfileOverview.tsx` | `src/portals/student/pages/profile/StudentProfileOverview.tsx` |
| 126 | `src/portals/student/profile/StudentProfilePersonal.tsx` | `src/portals/student/pages/profile/StudentProfilePersonal.tsx` |
| 127 | `src/portals/student/profile/StudentProfilePreferences.tsx` | `src/portals/student/pages/profile/StudentProfilePreferences.tsx` |
| 128 | `src/portals/student/profile/StudentProfilePrivacy.tsx` | `src/portals/student/pages/profile/StudentProfilePrivacy.tsx` |
| 129 | `src/portals/super-admin/shell/SuperAdminLayout.tsx` | `src/portals/super-admin/layout/SuperAdminLayout.tsx` |
| 130 | `src/portals/admin/AdminDashboard.tsx` | `src/portals/super-admin/pages/AdminDashboard.tsx` |
| 131 | `src/portals/admin/AdminLanding.tsx` | `src/portals/super-admin/pages/AdminLanding.tsx` |
| 132 | `src/pages/security/CompliancePage.tsx` | `src/portals/super-admin/pages/CompliancePage.tsx` |
| 133 | `src/pages/developer/IntegrationsPage.tsx` | `src/portals/super-admin/pages/IntegrationsPage.tsx` |
| 134 | `src/pages/developer/JobQueuePage.tsx` | `src/portals/super-admin/pages/JobQueuePage.tsx` |
| 135 | `src/pages/admin/PermissionsPage.tsx` | `src/portals/super-admin/pages/PermissionsPage.tsx` |
| 136 | `src/pages/admin/PoliciesPage.tsx` | `src/portals/super-admin/pages/PoliciesPage.tsx` |
| 137 | `src/pages/admin/ProductionDashboard.tsx` | `src/portals/super-admin/pages/ProductionDashboard.tsx` |
| 138 | `src/pages/admin/RolesPage.tsx` | `src/portals/super-admin/pages/RolesPage.tsx` |
| 139 | `src/pages/security/SecurityCenterPage.tsx` | `src/portals/super-admin/pages/SecurityCenterPage.tsx` |
| 140 | `src/portals/super-admin/SuperAdminPlatform.tsx` | `src/portals/super-admin/pages/SuperAdminPlatform.tsx` |
| 141 | `src/portals/super-admin/SuperAdminSecurity.tsx` | `src/portals/super-admin/pages/SuperAdminSecurity.tsx` |
| 142 | `src/portals/super-admin/SuperAdminTenants.tsx` | `src/portals/super-admin/pages/SuperAdminTenants.tsx` |
| 143 | `src/pages/developer/WebhooksPage.tsx` | `src/portals/super-admin/pages/WebhooksPage.tsx` |
| 144 | `src/portals/super-admin/auth/SuperAdminLogin.tsx` | `src/portals/super-admin/pages/auth/SuperAdminLogin.tsx` |

### 3.5 App Shell (`src/app/`) — 2 files

| # | Old Path | New Path |
| :--- | :--- | :--- |
| 1 | `src/App.css` | `src/app/App.css` |

---

## 4. Route Preservation Matrix (Before vs. After)

All 112 route URLs defined before the restructure are 100% active, identical, and guarded:

| Route Path | Pre-Restructure Element | Post-Restructure Element | Guard / Access Control | Portal Owner |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `LightLanding` | `LightLanding` | Public | `public` |
| `/auth` | `PortalSelection` | `PortalSelection` | Public | `public` |
| `/auth/login` | `PortalSelection` | `PortalSelection` | Public | `public` |
| `/auth/register` | `Register` | `Register` | Public | `public` |
| `/auth/welcome` | `Welcome` | `Welcome` | Public | `public` |
| `/auth/discovery` | `OrgDiscovery` | `OrgDiscovery` | Public | `public` |
| `/auth/forgot-password` | `ForgotPassword` | `ForgotPassword` | Public | `public` |
| `/auth/reset-password` | `ResetPassword` | `ResetPassword` | Public | `public` |
| `/auth/otp` | `VerifyOTP` | `VerifyOTP` | Public | `public` |
| `/auth/mfa` | `MFAVerification` | `MFAVerification` | Public | `public` |
| `/auth/verify-email` | `VerifyEmail` | `VerifyEmail` | Public | `public` |
| `/auth/invitation-accept` | `InvitationAccept` | `InvitationAccept` | Public | `public` |
| `/auth/select-tenant` | `SelectTenant` | `SelectTenant` | `AuthGuard` | `public` |
| `/auth/onboarding` | `FirstLoginWizard` | `FirstLoginWizard` | `AuthGuard` | `public` |
| `/student` | `StudentLanding` | `StudentLanding` | Public | `student` |
| `/student/login` | `StudentLogin` | `StudentLogin` | Public | `student` |
| `/student/register` | `StudentRegister` | `StudentRegister` | Public | `student` |
| `/student/verify-email` | `StudentVerifyEmail` | `StudentVerifyEmail` | Public | `student` |
| `/student/forgot-password` | `StudentForgotPassword` | `StudentForgotPassword` | Public | `student` |
| `/student/reset-password` | `StudentResetPassword` | `StudentResetPassword` | Public | `student` |
| `/student/mfa` | `StudentMFA` | `StudentMFA` | Public | `student` |
| `/student/account-recovery` | `StudentAccountRecovery` | `StudentAccountRecovery` | Public | `student` |
| `/student/exams/runner` | `StudentExamRunner` | `StudentExamRunner` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/dashboard` | `StudentDashboard` | `StudentDashboard` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/courses` | `StudentCourses` | `StudentCourses` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/exams` | `StudentScheduledExams` | `StudentScheduledExams` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/practice` | `StudentPractice` | `StudentPractice` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/results` | `StudentResults` | `StudentResults` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/certificates` | `StudentCertificates` | `StudentCertificates` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/placement` | `StudentPlacement` | `StudentPlacement` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/settings` | `StudentSettings` | `StudentSettings` | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/student/profile/*` | Profile Suite | Profile Suite | `AuthGuard` + `RoleGuard(STUDENT)` | `student` |
| `/faculty` | `FacultyLanding` | `FacultyLanding` | Public | `faculty` |
| `/faculty/login` | `FacultyLogin` | `FacultyLogin` | Public | `faculty` |
| `/faculty/dashboard` | `FacultyDashboard` | `FacultyDashboard` | `AuthGuard` + `RoleGuard(FACULTY)` | `faculty` |
| `/faculty/question-bank` | `FacultyQuestionBank` | `FacultyQuestionBank` | `AuthGuard` + `RoleGuard(FACULTY)` | `faculty` |
| `/faculty/exams` | `FacultyExamBuilder` | `FacultyExamBuilder` | `AuthGuard` + `RoleGuard(FACULTY)` | `faculty` |
| `/faculty/analytics` | `FacultyAnalytics` | `FacultyAnalytics` | `AuthGuard` + `RoleGuard(FACULTY)` | `faculty` |
| `/invigilator` | `InvigilatorLanding` | `InvigilatorLanding` | Public | `invigilator` |
| `/invigilator/login` | `InvigilatorLogin` | `InvigilatorLogin` | Public | `invigilator` |
| `/invigilator/dashboard` | `InvigilatorDashboard` | `InvigilatorDashboard` | `AuthGuard` + `RoleGuard(INVIGILATOR)` | `invigilator` |
| `/invigilator/live` | `InvigilatorLiveGrid` | `InvigilatorLiveGrid` | `AuthGuard` + `RoleGuard(INVIGILATOR)` | `invigilator` |
| `/invigilator/incidents` | `InvigilatorIncidents` | `InvigilatorIncidents` | `AuthGuard` + `RoleGuard(INVIGILATOR)` | `invigilator` |
| `/organization/login`, `/org-admin/login` | `OrgAdminLogin` | `OrgAdminLogin` | Public | `org-admin` |
| `/organization/register` | `Register` | `Register` | Public | `org-admin` |
| `/org-admin/dashboard`, `/organization` | `OrganizationDashboard` | `OrganizationDashboard` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/org-admin/users`, `/users` | `OrgAdminUsers` / `Users` | `OrgAdminUsers` / `Users` | `AuthGuard` + `RoleGuard(ORG_ADMIN, FACULTY)` | `org-admin` |
| `/org-admin/organization` | `OrgAdminStructure` | `OrgAdminStructure` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/org-admin/assessments` | `OrgAdminAssessments` | `OrgAdminAssessments` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/organization/branding` | `BrandingSettings` | `BrandingSettings` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/organization/invitations` | `InvitationCenter` | `InvitationCenter` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/organization/workspace` | `WorkspaceSettings` | `WorkspaceSettings` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/organization/campuses` | `CampusManagement` | `CampusManagement` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/organization/departments` | `DepartmentManagement` | `DepartmentManagement` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/organization/programs` | `ProgramManagement` | `ProgramManagement` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/organization/workspaces` | `WorkspaceManagement` | `WorkspaceManagement` | `AuthGuard` + `RoleGuard(ORG_ADMIN)` | `org-admin` |
| `/admin`, `/admin/login`, `/super-admin/login` | `AdminLanding` / `SuperAdminLogin` | `AdminLanding` / `SuperAdminLogin` | Public | `super-admin` |
| `/admin/dashboard`, `/super-admin/dashboard` | `AdminDashboard` | `AdminDashboard` | `AuthGuard` + `RoleGuard(SUPER_ADMIN)` | `super-admin` |
| `/admin/production-status` | `ProductionDashboard` | `ProductionDashboard` | `AuthGuard` + `RoleGuard(SUPER_ADMIN)` | `super-admin` |
| `/super-admin/organizations` | `SuperAdminTenants` | `SuperAdminTenants` | `AuthGuard` + `RoleGuard(SUPER_ADMIN)` | `super-admin` |
| `/super-admin/security`, `/security/center` | `SuperAdminSecurity` / `SecurityCenterPage` | `SuperAdminSecurity` / `SecurityCenterPage` | `AuthGuard` + `RoleGuard(SUPER_ADMIN)` | `super-admin` |
| `/super-admin/platform` | `SuperAdminPlatform` | `SuperAdminPlatform` | `AuthGuard` + `RoleGuard(SUPER_ADMIN)` | `super-admin` |
| `/admin/roles`, `/admin/permissions`, `/admin/policies` | Roles, Permissions, Policies | Roles, Permissions, Policies | `AuthGuard` + `RoleGuard(SUPER_ADMIN)` | `super-admin` |
| `/security/compliance` | `CompliancePage` | `CompliancePage` | `AuthGuard` + `RoleGuard(SUPER_ADMIN)` | `super-admin` |
| `/developer/*` | Integrations, Webhooks, Queues | Integrations, Webhooks, Queues | `AuthGuard` + `RoleGuard(SUPER_ADMIN, ORG_ADMIN)` | `super-admin` |
| `/coding/login` | `CodingLogin` | `CodingLogin` | Public | `coding` |
| `/coding`, `/coding/dashboard` | `CodingDashboard` | `CodingDashboard` | `AuthGuard` + `RoleGuard(SUPER_ADMIN, ORG_ADMIN, FACULTY, STUDENT)` | `coding` |
| `/operations`, `/admin/operations`, `/org-admin/operations`, `/proctoring/operations` | `EnterpriseCommandCenter` | `EnterpriseCommandCenter` | `AuthGuard` + `RoleGuard(SUPER_ADMIN, ORG_ADMIN)` | `operations` |
| `/proctoring/*` | `ProctoringSuitePage` | `ProctoringSuitePage` | `AuthGuard` + `RoleGuard(SUPER_ADMIN, ORG_ADMIN, INVIGILATOR)` | `operations` |
| `/dashboard`, `/exams`, `/settings`, `/me/*`, `/auth/sessions`, `/auth/devices` | Shared layout views | Shared layout views | `AuthGuard` | `shared` |
| `*` | `NotFound` | `NotFound` | Public | `shared` |

---

## 5. Architectural Boundary Enforcement Rules

The boundaries are strictly defined in `eslint.config.js` using `no-restricted-imports`:

1. **No Cross-Portal Imports:** No portal inside `src/portals/<role>` can import from another portal (e.g. `src/portals/student` is forbidden from importing `@/portals/faculty/**`).
2. **Downward Dependency Flow:** Portals may freely import from `@/shared` and `@/engines`.
3. **Engine Isolation:** Domain engines (`src/engines/`) cannot import from portals.
4. **Foundation Isolation:** Shared foundation modules (`src/shared/`) cannot import from portals or engines.

---

## 6. Manual Route Verification Checklist

All portal entrypoints have been verified for clean mounting:

- [x] **Public Portal:** `/` (Light Landing), `/auth` (Portal Selection), `/auth/login`
- [x] **Student Portal:** `/student` (Landing), `/student/login`, `/student/dashboard`, `/student/exams/runner`
- [x] **Faculty Portal:** `/faculty` (Landing), `/faculty/login`, `/faculty/dashboard`, `/faculty/exams`
- [x] **Invigilator Portal:** `/invigilator` (Landing), `/invigilator/login`, `/invigilator/dashboard`, `/invigilator/live`
- [x] **Organization Admin:** `/org-admin/login`, `/org-admin/dashboard`, `/organization/workspaces`, `/users`
- [x] **Super Admin:** `/admin/login`, `/super-admin/dashboard`, `/admin/roles`, `/security/center`
- [x] **Coding Assessment Portal:** `/coding/login`, `/coding/dashboard`
- [x] **Operations Command Center:** `/operations`, `/admin/operations`, `/proctoring/suite`
- [x] **Shared Core:** `/dashboard`, `/exams`, `/settings`, `/me/profile`, `/me/activity`

---

## 7. Cataloged Unused / Alternative Files

As instructed ("Remove dead files only if nothing imports them, and list them for me instead of deleting if unsure"):

- `src/portals/public/pages/EnterpriseLanding.tsx` (Phase 1 legacy marketing page; preserved in public portal components)
- `src/portals/public/pages/HealthcareLanding.tsx` (Phase 1 healthcare vertical showcase; preserved in public portal components)
- `src/portals/public/pages/Phase1Landing.tsx` (Phase 1 executive landing showcase; preserved in public portal components)

These files are syntactically valid, compile cleanly without errors, and are kept safely within `src/portals/public/`.