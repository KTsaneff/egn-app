# EGN Validator & Generator (React + TypeScript)

Validate and generate Bulgarian **EGN** numbers entirely in the browser. Built with **React + TypeScript + Vite** and deployed to **GitHub Pages** via **GitHub Actions**.

> ⚠️ **Educational use only.** Do **not** enter real EGN values. The app runs fully client-side; no data is sent to a server or stored.

---

## Live Demo

- **URL:** https://ktsaneff.github.io/egn-app/  
- **Status:** ![CI/CD](https://github.com/KTsaneff/egn-app/actions/workflows/pages.yml/badge.svg)

---

## Features

- ✅ **Validation** of EGN (10 digits) with:
  - Century-encoded month handling (1800/1900/2000)
  - Real Gregorian date check (incl. leap years)
  - Checksum verification (weights `2,4,8,5,10,9,7,3,6` and mod-11 with 10→0 rule)
  - Sex inference from the 9th digit (even = male, odd = female)
- ✅ **Generation** of valid EGNs with options:
  - Specify **sex** (male/female/any)
  - Optional **exact birth date**
- 🔄 **CI/CD**: automatic build & deploy to GitHub Pages on every push to `main`
- 🧪 *(Roadmap)* Unit tests with Vitest + RTL
- 🧰 *(Roadmap)* Batch generation, CSV export, copy-to-clipboard, history log

---

## Quick Start (Local Dev)

> Requires **Node.js 20+** and **npm**.

```bash
# 1) Clone
git clone https://github.com/KTsaneff/egn-app.git
cd egn-app

# 2) Install deps
npm install

# 3) Start dev server
npm run dev
# Open the printed local URL (e.g. http://localhost:5173)
