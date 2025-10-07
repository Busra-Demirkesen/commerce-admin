🛍️ Commerce Admin Dashboard

Full-featured admin panel for managing products, categories, orders, and stores.
Companion project: Commerce Storefront

✨ Overview

The Commerce Admin Dashboard provides a modern, scalable way to manage e-commerce data including products, categories, stock, images, and orders.
It connects seamlessly with the Commerce Storefront app for a full-stack experience.

🔑 Key Features

🔐 Authentication (Clerk or NextAuth)

📦 Product & Category CRUD operations

🖼️ Image uploads (Cloudinary / UploadThing)

💳 Stripe integration for payments

🧾 Order management (status, list, details)

🏪 Multi-store support (/[storeId]/settings)

🎨 Built with Tailwind CSS and shadcn/ui

⚡ Fast, responsive, and accessible UI

🧰 Tech Stack

Framework: Next.js (App Router) + React + TypeScript

UI: Tailwind CSS + shadcn/ui + Radix

Database: PostgreSQL + Prisma

Auth: Clerk / NextAuth

Payments: Stripe

Storage: Cloudinary / UploadThing

Deployment: Vercel

Testing: Jest + React Testing Library

📁 Project Structure
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

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/Busra-Demirkesen/commerce-admin.git
cd commerce-admin

2️⃣ Install dependencies
npm install
# or
yarn install

3️⃣ Configure environment variables

Copy .env.example to .env and fill in the following:

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

4️⃣ Run database migrations
npx prisma migrate dev

5️⃣ Start the development server
npm run dev
# http://localhost:3000

🧪 Useful Scripts
npm run dev       # Start dev server
npm run build     # Build for production
npm start         # Run production build
npx prisma studio # Open Prisma UI

🚀 Deployment

Deploy easily to Vercel
.

Don’t forget to add all required .env keys.

For Stripe webhooks (local development):

stripe listen --forward-to localhost:3000/api/stripe/webhook

🔗 Related Links

🛒 Storefront: Commerce Storefront

📘 Docs / Design: (add your Figma or Notion link)

🌐 Live Demo: (add your Vercel deployment link)

⭐ “Code is like humor. When you have to explain it, it’s bad.”
