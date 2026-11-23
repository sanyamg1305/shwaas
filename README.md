# Shwaas - Comprehensive COPD & Respiratory Care Companion

**Shwaas** is an accessible, modern, patient-centered digital health companion for individuals managing Chronic Obstructive Pulmonary Disease (COPD) and chronic respiratory conditions.

## Key Features

1. **Daily Air Quality Index (AQI) & Health Advisory**
   - Live location detection & global city search powered by the free Open-Meteo Air Quality API.
   - Particulate breakdown ($PM_{2.5}$, $PM_{10}$, $O_3$, $NO_2$, $SO_2$) with tailored COPD outdoor activity guidance.

2. **Official COPD Assessment Test™ (CAT)**
   - Faithful digital implementation of the official 8-question CAT survey with 0–5 scale and dual anchor statements.
   - Clinical GOLD impact level categorization (Low, Medium, High, Very High Impact) and PDF/print export.

3. **Shwaas Guided Breathing Exercises**
   - Inspiratory Exercises: Diaphragmatic Breathing (1.1) & Thoracic Expansion (1.2).
   - Expiratory Exercises: Pursed-Lip Breathing (2.1) & Huff Coughing Technique (2.2).
   - Breathlessness Management: Forward-Leaning Recovery Position (3.1).
   - Real-time animated pacing visualizer, Web Audio chimes, and direct links to Shwaas video demonstrations.

4. **Pulmonologist Locator**
   - Finds nearby pulmonary clinics and chest hospitals with GPS or city search.
   - Direct Google Maps navigation links and a "Saved Doctors" directory.

5. **Doctor Follow-Up & Appointment Log**
   - Appointment scheduler with pre-visit questions checklist.
   - Post-visit record keeping for doctor notes and spirometry test results (FEV1 % Predicted, Resting SpO2).

6. **How to Use an Inhaler (Interactive Guide)**
   - Step-by-step guides for MDI with Spacer, Standard MDI, Dry Powder Inhalers (DPI), and Soft Mist Inhalers (SMI / Respimat).
   - Built-in 10-second breath-holding timer and common user mistakes checklist.

7. **Respiratory Medication Tracker**
   - Daily schedule slots (Morning, Afternoon, Evening, Bedtime, As Needed).
   - Inhaler Canister Puff Counter with visual gauges and refill alerts.
   - One-tap Emergency Rescue Puff logger.

8. **COPD Red Zone Emergency Action Plan**
   - Quick-access emergency guidance for acute respiratory distress, cyanosis, and one-tap emergency call buttons.

---

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **APIs**: Open-Meteo Air Quality & Geocoding APIs (No API key required)
- **Deployment**: Vercel

---

## Getting Started Locally

1. Clone repository:
   ```bash
   git clone https://github.com/sanyamg1305/shwaas.git
   cd shwaas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## Deploy to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `shwaas` repository.
4. Framework preset: **Vite** (auto-detected).
5. Click **Deploy**.
