## 📦 Tech Stack

* **Frontend**

  * **Next.js (Pages Router)** with **TypeScript**
  * **React** + **React Icons** (fi-icons)
  * **Tailwind CSS** (with Poppins font)
  * **Framer Motion** for animations
  * **react-hot-toast** for toasts
  * **Axios** for HTTP

* **Backend**

  * **Next.js API Routes** (serverless functions)
  * **MongoDB Atlas** with **Mongoose** ODM
  * **JSON Web Tokens** (JWT) for auth
  * **bcryptjs** for password hashing

* **Dev Tools & Hosting**

  * `.env.local` for secrets (MONGODB\_URI, JWT\_SECRET)
  * Vercel or any Node-capable host

---

## 🗄️ Database Models

1. **Question**

   * `qid`, `text`, `options[{key, text, weight}]`
   * Seeded with 15 questions, weights 0–3

2. **SurveyEntry**

   * `email`, `phone` (unique)
   * `answers` (map of qid→choice)
   * Computed `meter` (0–100%) and `result` label

3. **Admin**

   * `email`, `passwordHash`, `status` (pending/approved/rejected)
   * Signup → pending → approve/reject workflow

---

## 🚀 Features

### Survey Flow

1. **Splash Screen** with animated icon
2. **15-question form** (Poppins, Tailwind-styled, responsive grid)
3. **Live validation** on Email & Phone (format + uniqueness check via API)
4. **Preview endpoint** (`POST /api/survey/check`) to calculate meter & feedback BEFORE saving
5. **Submission endpoint** (`POST /api/survey`) that enforces unique contact info

### Results UI

* **Thank-You Modal** showing meter%, result (“Healthy” / “Mild Concerns” / “At Risk”), tailored feedback
* If at-risk, displays a helpline phone & email
* **Toasts** for any errors or confirmations

### Admin Panel

1. **Sign-Up & Login** pages with icons, validation, toasts

2. **JWT-protected** dashboard at `/admin/dashboard`

3. **Entries tab**

   * Table with status icon (smile / alert / triangle)
   * Scrollable on mobile (`overflow-x-auto`)
   * Click row → **detailed modal** listing all questions + selected answers, scrollable

4. **Admins tab**

   * Lists all admin users with status
   * Approve/reject buttons on “pending” only

5. **Loading spinners** while fetching data

---

## 🧠 Scoring Logic

* Each response carries a 0–3 weight.
* **Total score** ÷ (15 × 3) → percentage meter.
* Categories:

  * ≥ 80% → Healthy
  * 50–79% → Mild Concerns
  * < 50% → At Risk

---

## ✅ What’s Complete

* Full **survey** UI + backend
* **Admin workflow** for signup, login, user approval
* **Protected** data retrieval routes
* Responsive design, polished with icons & animations
* Robust **validation** (format + uniqueness)
* Real-time **toasts** & **spinners**

You now have a fully functional mental-health survey app with an admin approval dashboard, built end-to-end in Next.js, TypeScript, and MongoDB. Let me know if you want to add reports, analytics, or email notifications next!
