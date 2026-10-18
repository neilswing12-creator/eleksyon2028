# Philippine 2028 National Election Survey Platform

A modern, responsive, independent public opinion survey platform for the **2028 Philippine National Elections** (President, Vice President, and Senate) featuring interactive **Three.js 3D spatial mapping**, precision 2D choropleths, anonymous participation, server-side HMAC-SHA256 duplicate IP deterrence, and a full administrator dashboard.

> **Disclaimer:** This is an independent, non-partisan public opinion research platform and not an official COMELEC voting system or certified election result.

---

## 🏛️ Key Features

1. **Anonymous Registration-Free Voting:**
   - No passwords, emails, phone numbers, or government IDs required.
   - Requires participant name/pseudonym and optional location (Region, Province, Municipality).
   - Selection rules strictly enforced on both frontend and backend:
     - **President:** Exactly 1 selection.
     - **Vice President:** Exactly 1 selection.
     - **Senators:** Up to 12 distinct selections with a live counter (`8 of 12 selected`) and duplicate prevention.

2. **One Active Vote Per IP Address (HMAC-SHA-256):**
   - Public IP addresses are converted into one-way cryptographic salted hashes using HMAC-SHA-256. Raw IP addresses are never stored in the database or exposed in public endpoints.
   - Enforces one active submission per public network per campaign.

3. **Secure Vote Retraction & Private Management Tokens:**
   - Every voter receives a cryptographically secure, high-entropy 64-character token and private link (`/survey/manage/[token]`).
   - Only a SHA-256 hash of the token is stored in the database.
   - Voters can retract their vote at any time; retracted votes are immediately excluded from all active candidate rankings, percentages, and map calculations.

4. **Interactive 3D & 2D Philippine Map (Three.js):**
   - **3D Spatial View:** Three.js archipelago visualization rendering all 82 provinces with coordinate projection (`geoTo3D`), cylindrical pillar height scaled by vote volume, and materials dynamically tinted with the administrator-assigned candidate leader color. Includes orbital drag rotation and mouse raycasting hover HUD.
   - **2D Precision Choropleth:** SVG vector map of Luzon, Visayas, and Mindanao with province search and island group filters.
   - **Contextual Province Drawer:** Displays leading candidate, vote counts, percentage shares, margins, and sample size verification warnings if responses are below the minimum threshold.

5. **Candidate Directory & Policy Platforms:**
   - Full profiles with verified education, public service records, photos, and political affiliations.
   - Policy repository filterable by categories: *Economy & Jobs, Healthcare, Education, Agriculture & Fisheries, Infrastructure, Governance & Anti-Corruption, Digital Transformation, Public Safety, and Environment*.

6. **Comprehensive Admin Dashboard (`/admin`):**
   - **Default Admin Credentials:**
     - **Email:** `admin@survey2028.ph`
     - **Password:** `Admin@2028!`
   - **Candidate Manager:** Add/edit candidates, update photos, bios, affiliations, and customize assigned map colors with a live swatch picker.
   - **Platforms Manager:** Add and verify policy proposals across 9 policy domains.
   - **Survey Configuration:** Pause/resume survey, toggle IP restrictions, configure minimum response thresholds, and set senator limits.
   - **Audit Logs:** Immutable audit trail recording administrative actions, timestamps, and IP addresses.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS with civic white & blue editorial palette (`#FFFFFF`, `#1455D9`, `#3B82F6`, `#14213D`, `#64748B`, `#E5EAF2`)
- **3D Graphics:** Three.js (`three`, `@types/three`)
- **Database & ORM:** SQLite with Prisma ORM (`prisma`, `@prisma/client`)
- **Icons:** Lucide Icons (`lucide-react`)
- **Security:** Node.js `crypto` (HMAC-SHA-256 IP hashing, SHA-256 token hashing, PBKDF2 password security, signed JWT sessions)

---

## 🚀 Getting Started

### 1. Set Active Workspace
It is recommended to set this directory as your active workspace in your editor:
```
C:\Users\user\.gemini\antigravity\scratch\ph-election-survey-2028
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Verification Tests
Run the 16 automated tests covering voting rules, selection limits, duplicate IP blocking, token management, and retraction:
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
npm start
```
