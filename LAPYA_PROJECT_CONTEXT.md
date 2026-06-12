# Lapya — MVP Project Context

## Overview
Lapya is a nutrition & health web application. The Figma designs are in a Figma Make file and the project needs to be built as a full-stack MVP.

**Figma Make File:** https://www.figma.com/make/IjDMHUVDmdIjk2QKjDBt9D/Lapya--Copy-?p=f&t=BBtwX2sq7MnD4AGb-0
**File Key:** `IjDMHUVDmdIjk2QKjDBt9D`

> **IMPORTANT:** Connect the Figma MCP server to pull designs directly. Use `get_design_context` with fileKey `IjDMHUVDmdIjk2QKjDBt9D` and nodeId `0:1` to get the full project source. For individual screens, use `get_design_context` on specific component files listed below.

---

## Tech Stack

### Frontend
- **React** (with TypeScript)
- **Tailwind CSS** for styling
- **shadcn/ui** component library (already used in the Figma designs)
- **React Router** for navigation
- **Vite** as the build tool

### Backend
- **FastAPI** (Python 3.12, async)
- **SQLAlchemy 2.0** ORM (sync sessions; SQLite dev / PostgreSQL prod)
- **Alembic** for database migrations
- **Pydantic v2** for request/response schemas + `pydantic-settings` for config
- **python-jose[cryptography]** for JWT
- **passlib[bcrypt]** for password hashing
- **CORSMiddleware** (FastAPI built-in)
- Auto-generated OpenAPI docs at `/docs`

---

## App Screens & Component Structure

### Auth & Onboarding (Phase 1 & 2)
| Screen | Source File | Description |
|--------|-----------|-------------|
| Splash Screen | `SplashScreen.tsx` | App loading/branding screen |
| Welcome Screen | `WelcomeScreen.tsx` | First screen with CTA to login/signup |
| Login | `LoginScreen.tsx` | Email/password login |
| Signup | `auth/SignupScreen.tsx` | User registration |
| Email Verification | `auth/EmailVerification.tsx` | OTP/email verification flow |
| Forgot Password | `auth/ForgotPassword.tsx` | Password reset flow |
| Onboarding Step 1 | `onboarding/OnboardingScreen1.tsx` | Diet preferences |
| Onboarding Step 2 | `onboarding/OnboardingScreen2.tsx` | Health goals |
| Onboarding Step 3 | `onboarding/OnboardingScreen3.tsx` | Dietary restrictions |
| Onboarding Step 4 | `onboarding/OnboardingScreen4.tsx` | Cooking preferences |
| Location | `onboarding/OnboardingScreenLocation.tsx` | Location selection |
| Metrics | `onboarding/OnboardingScreenMetrics.tsx` | Height/weight/age |
| Onboarding Complete | `onboarding/OnboardingComplete.tsx` | Success/completion |

### Core Features (Phase 3)
| Screen | Source File | Description |
|--------|-----------|-------------|
| Home Screen | `HomeScreen.tsx` | Main dashboard with daily summary |
| Week View | `mealplan/WeekView.tsx` | Weekly meal plan calendar |
| Meal Detail | `mealplan/MealDetail.tsx` | Individual meal info |
| Meal Swap | `mealplan/MealSwap.tsx` | Swap meals in the plan |
| Recipe Detail | `mealplan/RecipeDetail.tsx` | Full recipe with ingredients/steps |
| Scan Camera | `scanner/ScanCamera.tsx` | Food barcode/label scanner |
| Scan Analyzing | `scanner/ScanAnalyzing.tsx` | Scanning progress screen |
| Scan Result | `scanner/ScanResult.tsx` | Nutritional analysis results |
| Grocery List | `GroceryList.tsx` | Shopping list from meal plans |

### Health & Social (Phase 4)
| Screen | Source File | Description |
|--------|-----------|-------------|
| Health Metrics | `health/HealthMetrics.tsx` | Health data dashboard |
| Log Metric | `health/LogMetric.tsx` | Log health measurements |
| Care Circle | `caregiver/CareCircle.tsx` | Caregiver network view |
| Caregiver Home | `caregiver/CaregiverHome.tsx` | Caregiver's dashboard |
| Invite Caregiver | `caregiver/InviteCaregiver.tsx` | Invite caregivers |
| Nutrition Chatbot | `nutrition/NutritionChatbot.tsx` | AI nutrition assistant |

### Settings & Payments (Phase 5)
| Screen | Source File | Description |
|--------|-----------|-------------|
| Profile | `profile/ProfileScreen.tsx` | User profile view |
| Edit Profile | `profile/EditProfile.tsx` | Edit user details |
| Settings | `profile/SettingsScreen.tsx` | App settings |
| Upgrade | `upgrade/UpgradeScreen.tsx` | Premium plan upsell |
| Payment | `payment/PaymentCheckout.tsx` | Payment/checkout flow |
| Notifications | `notifications/NotificationsList.tsx` | Notification center |
| Dietitian Dashboard | `dietitian/DietitianDashboard.tsx` | Dietitian's patient overview |
| Patient Detail | `dietitian/PatientDetail.tsx` | Dietitian's patient detail |
| Landing Page | `landing/LandingPage.tsx` | Public marketing page |

### Shared / UI Polish
| Component | Source File | Description |
|-----------|-----------|-------------|
| Navigation | `navigation/WebNavigation.tsx` | Main app navigation/bottom tabs |
| Logo | `LapyaLogo.tsx`, `LogoVariants.tsx` | Brand logos |
| Confirm Modal | `polish/ConfirmModal.tsx` | Confirmation dialogs |
| Empty State | `polish/EmptyState.tsx` | Empty state placeholders |
| Error State | `polish/ErrorState.tsx` | Error screens |
| Loading Skeleton | `polish/LoadingSkeleton.tsx` | Skeleton loaders |
| Loading Spinner | `polish/LoadingSpinner.tsx` | Loading indicators |
| Toast | `polish/Toast.tsx` | Toast notifications |

---

## Build Phases

### Phase 1 — Project Scaffold & Auth
1. Set up React + Vite + Tailwind + shadcn/ui frontend
2. Set up Flask backend with SQLAlchemy
3. Implement user model (email, password hash, profile data)
4. Build auth API endpoints: `/api/auth/signup`, `/api/auth/login`, `/api/auth/verify-email`, `/api/auth/forgot-password`
5. Build frontend auth screens: Login, Signup, Email Verification, Forgot Password
6. JWT token management on frontend
7. Protected route wrapper

### Phase 2 — Onboarding Flow
1. Build onboarding API to save user preferences
2. Implement all onboarding screens (4 steps + location + metrics)
3. Multi-step form state management
4. Onboarding completion screen

### Phase 3 — Core Screens
1. Home dashboard with daily nutrition summary
2. Meal plan system (CRUD for weekly meal plans)
3. Recipe detail view with ingredients and steps
4. Meal swap functionality
5. Food scanner UI (camera integration placeholder for MVP)
6. Scan results with nutritional breakdown
7. Grocery list generation from meal plans

### Phase 4 — Health & Social
1. Health metrics dashboard and logging
2. Care circle / caregiver invitation system
3. Nutrition chatbot (can integrate Claude API for AI responses)

### Phase 5 — Settings, Payments, Dietitian
1. Profile and settings screens
2. Upgrade/premium plan screen
3. Payment checkout (Stripe/Paystack integration placeholder)
4. Notification system
5. Dietitian dashboard and patient detail views
6. Public landing page

---

## Backend API Structure (FastAPI)

```
backend/
├── app/
│   ├── main.py              # FastAPI app instance + middleware + router mounts
│   ├── core/
│   │   ├── config.py        # Settings via pydantic-settings
│   │   ├── database.py      # engine, SessionLocal, get_db dependency
│   │   ├── security.py      # password hashing, JWT helpers
│   │   └── deps.py          # get_current_user, get_admin_user dependencies
│   ├── models/
│   │   ├── user.py          # User model
│   │   ├── meal_plan.py     # Meal plan models (Phase 3)
│   │   ├── recipe.py        # Recipe model (Phase 3)
│   │   ├── health_metric.py # Health tracking (Phase 4)
│   │   ├── grocery.py       # Grocery list (Phase 3)
│   │   └── caregiver.py     # Caregiver relationships (Phase 4)
│   ├── schemas/             # Pydantic request/response models per domain
│   ├── routers/
│   │   ├── auth.py          # /api/auth/*
│   │   ├── admin.py         # /api/admin/*
│   │   ├── onboarding.py    # /api/onboarding/* (Phase 2)
│   │   ├── meals.py         # /api/meal-plans/* (Phase 3)
│   │   ├── recipes.py       # /api/recipes/* (Phase 3)
│   │   ├── scanner.py       # /api/scanner/* (Phase 3)
│   │   ├── health.py        # /api/health/* (Phase 4)
│   │   ├── grocery.py       # /api/grocery/* (Phase 3)
│   │   ├── caregiver.py     # /api/caregivers/* (Phase 4)
│   │   ├── profile.py       # /api/profile/* (Phase 5)
│   │   └── chat.py          # /api/chat (Phase 4 — Claude SSE)
│   └── exceptions.py        # Custom exception classes + handlers
├── alembic/
├── alembic.ini
├── tests/
├── requirements.txt
└── .env.example
```

## Frontend Structure (React)

```
frontend/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth/            # Auth screens
│   │   ├── onboarding/      # Onboarding flow
│   │   ├── mealplan/        # Meal planning
│   │   ├── scanner/         # Food scanner
│   │   ├── health/          # Health metrics
│   │   ├── caregiver/       # Caregiver features
│   │   ├── nutrition/       # Chatbot
│   │   ├── profile/         # Profile/settings
│   │   ├── payment/         # Payment
│   │   ├── dietitian/       # Dietitian portal
│   │   ├── navigation/      # App navigation
│   │   ├── landing/         # Landing page
│   │   └── polish/          # Shared UI (modals, states, loaders)
│   ├── hooks/               # Custom React hooks
│   ├── context/             # Auth context, app state
│   ├── services/            # API client functions
│   ├── types/               # TypeScript interfaces
│   └── styles/              # Tailwind config, globals, theme
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Design Tokens (from Figma)
The Figma file uses a custom theme with CSS variables. Pull the exact values from `src/styles/theme.css` and `src/styles/tailwind.css` in the Figma Make source by using:
```
get_design_context(fileKey="IjDMHUVDmdIjk2QKjDBt9D", nodeId="0:1")
```

## Key Notes
- The Figma Make file already has generated React + Tailwind code — use it as reference but adapt for production
- Mobile-first design (the app screens are mobile-sized) but should work on web too
- shadcn/ui is the component foundation — don't reinvent these components
- The app has role-based views: regular user, caregiver, and dietitian
- Start with Phase 1 (scaffold + auth) and build incrementally
