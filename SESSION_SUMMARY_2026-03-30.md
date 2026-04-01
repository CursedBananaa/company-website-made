# Session Summary — March 30, 2026

## What We Did Today

---

### 1. Completed Full Supabase Removal
- Removed all remaining `supabase` imports and database calls from `Projects.tsx`, `Students.tsx`, `Applicants.tsx`, `AddProjectDialog.tsx`, and `ApplicationDetailsDialog.tsx`.
- Deleted `src/integrations/supabase/` directory and the root `supabase/` folder.
- Uninstalled the `@supabase/supabase-js` package from `package.json`.
- Removed all `VITE_SUPABASE_*` environment variables from `.env`.
- Confirmed: **Zero Supabase code remains in the project.**

---

### 2. Company Profile — Backend Integration
Connected the company profile page to the real `.NET` backend at:
```
https://sha8alny-backend-857164936517.us-central1.run.app/api/companies/profile
```

- `GET` — loads saved company data when user logs in.
- `POST` — creates a new company profile (first time save).
- `PUT` — updates an existing company profile.

The app intelligently uses `POST` for new companies and `PUT` for existing ones via a `hasCompanyProfile` flag.

---

### 3. Fixed the "Data Disappears After Login" Bug
Discovered and fixed a critical bug:

> The `.NET` backend wraps all responses inside `{ "isSuccess": true, "data": { ... } }`. The frontend was reading the outer wrapper as the profile data, so everything appeared empty after login.

**Fix:** Updated `api.ts` to correctly extract `.data.data` from the API response, so company profile data now **persists correctly between sessions**.

---

### 4. Profile Page Redesign
Completely replaced the old "Edit Profile" form (First Name, Last Name, Bio, etc.) with the **Company Details form** matching the exact `.NET` backend schema:

| Field | Placeholder Example |
|---|---|
| Company Name | Adham Net |
| Industry | .NET Services |
| Website URL | https://Net.com |
| Contact Email | hr@Net.com |
| Contact Phone | 011112221 |
| Address | 123 Net Park |
| City | Alexandria |
| Country | Egypt |
| Company Description | Leading software development firm. |
| Logo URL | /uploads/logos/default.png |

---

### 5. Profile Preview Card Sync
Updated the left-side **Profile Card** to dynamically display company-specific data:
- Shows `Company Name` instead of First/Last name.
- Shows `Industry` as the subtitle.
- Shows `Contact Email`, `Contact Phone`, and `City, Country` location.
- Shows a clickable **Website URL** with a Globe icon.
- Uses the company `logoUrl` as the profile picture.

---

### 6. Save Behavior
- Saving only triggers when the user explicitly clicks **"Save Company Details"** — not on every keystroke.
- A success/error toast message appears after the API call completes.

---

## Files Modified
| File | What Changed |
|---|---|
| `src/lib/api.ts` | Added `companiesApi` (GET/POST/PUT), fixed response unwrapping |
| `src/contexts/ProfileContext.tsx` | Integrated company profile fetch + save, removed role guards |
| `src/pages/Profile.tsx` | Full UI redesign to match `.NET` schema, removed old generic form |
| `.env` | Removed all Supabase variables |
| `package.json` | Removed `@supabase/supabase-js` |

---

## Known Limitations / Next Steps
- **Projects, Students, Applicants** pages have stubbed-out API calls (`api.get('/projects')` etc.) that are not yet connected to real backend endpoints.
- **Logo upload** currently accepts a URL string — no file upload UI yet.
