# 🍳 Recipe Website

A collaborative project to create a modern recipe platform.  
Users can discover, view, and interact with recipes – each step supported with images, GIFs, or videos.  

🔗 *Repository*: [recipe-website-group-project](git@github.com:JustinCCodes/recipe-website-group-project.git)

---

## ✨ Features

✅ Recipe feed with images/videos  
✅ Like ❤️ , save 🔖 & edit ✏️ recipes  
✅ Search option 🔍  
✅ Recipe detail pages with *step-by-step instructions* (including images)  
✅ Authentication (register/login/profile) 👤  
✅ Responsive & mobile-first design 📱  

---

## 🛠️ Tech Stack

•⁠  ⁠*Framework:* [Next.js 15](https://nextjs.org/) (App Router)  
•⁠  ⁠*Language:* [TypeScript](https://www.typescriptlang.org/)  
•⁠  ⁠*Styling:* [Tailwind CSS](https://tailwindcss.com/)  
•⁠  ⁠*Database:* [Prisma,Neon](https://www.prisma.io/ & https://neon.com/) + PostgreSQL  
•⁠  ⁠*Other:* React Hooks, Context API

---

## 📂 Project Structure

```plaintext
src/
 ├─ app/                     # Next.js app router pages
 │   ├─ recipes/             # Recipes
 │   │   └─ [id]/            # Dynamic recipe detail pages
 │   ├─ login/               # Auth
 │   ├─ register/            # Auth
 │   └─ ...
 ├─ components/              # Shared UI components
 │   ├─ feed/                # Feed & FeedItem
 │   └─ recipe/              # DetailStepsClient, Media rendering
 ├─ features/                # Feature modules
 ├─ types/                   # Global TS types
 └─ utils/                   # Helpers & utilities


## 🚀 Getting Started

```bash
### 1️⃣ Clone the repository
git clone git@github.com:JustinCCodes/recipe-website-group-project.git
cd recipe-website-group-project

### 2️⃣ Install dependencies
npm install

### 3️⃣ Set up environment variables
# Create a .env file in the project root with values like:
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/recipe-db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

### 4️⃣ Prepare Prisma (DB migration)
npx prisma migrate dev

### 5️⃣ Start the development server
npm run dev

# Open in browser:
http://localhost:3000


## 👥 Contributors

•⁠  ⁠[JustinCCodes](https://github.com/JustinCCodes)  
•⁠  ⁠[LaraKerstian](https://github.com/laerra)  
•⁠  ⁠[YourNameHere](https://github.com/codealchemyy)  
