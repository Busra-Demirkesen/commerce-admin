# 🛍️ Commerce Admin Dashboard

> Full-featured admin panel for managing products, categories, orders, and stores. 
> **Companion project:** [Commerce Storefront](https://github.com/Busra-Demirkesen/commerce-store)

---

## ✨ Overview
The **Commerce Admin Dashboard** provides a modern, scalable way to manage e-commerce data including products, categories, stock, images, and orders.  
It connects seamlessly with the **Commerce Storefront** app for a full-stack experience.

<img width="1568" height="756" alt="e-commerce project screenshot5" src="https://github.com/user-attachments/assets/319659d6-b2c4-4d4b-bdea-96ebf139900c" />


<img width="1570" height="757" alt="e-commerce project screenshot6" src="https://github.com/user-attachments/assets/31aa41fb-c079-42cd-813a-7c2870e236ae" />


<img width="1569" height="757" alt="e-commerce project screenshot7" src="https://github.com/user-attachments/assets/32366636-b7b5-4e51-a7c2-66cfeb8ba043" />


### 🔑 Key Features
- 🔐 Authentication (Clerk or NextAuth)  
- 📦 Product & Category CRUD operations  
- 🖼️ Image uploads (Cloudinary / UploadThing)  
- 💳 Stripe integration for payments  
- 🧾 Order management (status, list, details)  
- 🏪 Multi-store support (`/[storeId]/settings`)  
- 🎨 Built with **Tailwind CSS** and **shadcn/ui** - ⚡ Fast, responsive, and accessible UI  

---

## 🧰 Tech Stack
- **Framework:** Next.js (App Router) + React + TypeScript  
- **UI:** Tailwind CSS + shadcn/ui + Radix  
- **Database:** PostgreSQL + Prisma  
- **Auth:** Clerk / NextAuth  
- **Payments:** Stripe  
- **Storage:** Cloudinary / UploadThing  
- **Deployment:** Vercel  
- **Testing:** Jest + React Testing Library  

---

## 📁 Project Structure

src/
app/
(dashboard)/
api/
[storeId]/settings/
components/
lib/
prisma/
styles/
public/
prisma/schema.prisma

## ⚙️ Setup Instructions
```bash
# 1️⃣ Clone the repository
git clone [https://github.com/Busra-Demirkesen/commerce-admin.git](https://github.com/Busra-Demirkesen/commerce-admin.git)
cd commerce-admin

# 2️⃣ Install dependencies
npm install
# or
yarn install

# 3️⃣ Configure environment variables
# Copy .env.example to .env and fill in the following:

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB

# Authentication (choose one)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
# or
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=

# File Upload
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
# or
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# 4️⃣ Run database migrations
npx prisma migrate dev

# 5️⃣ Start the development server
npm run dev
# http://localhost:3000




## 🧪 Useful Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Run production build
npx prisma studio # Open Prisma Studio UI


```


---
## 🔗 Related Links

🛒 Storefront Repo: [Commerce Storefront](https://github.com/Busra-Demirkesen/commerce-store)
🌐 Storefront Live Demo: [Live Demo](https://commerce-store-hazel.vercel.app/)

⚙️ Admin Live Demo: [Live Demo](https://commerce-admin-roan.vercel.app/8a2df2f4-9303-4feb-8caf-d0869eb9e6fd/products/new)

---

> ⭐ “Code is like humor. When you have to explain it, it’s bad.”

