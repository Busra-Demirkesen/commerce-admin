// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Burada public route'ları tanımlıyoruz
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/api/webhook", // Örneğin stripe webhook'un varsa
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return; // Bu route'lara auth gerekmez
  }

  // Auth gerektiren route'larda kullanıcı kontrolü otomatik yapılır
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // Static dosyaları hariç tutar
    "/api/(.*)",              // API route'larını da dahil eder
  ],
};
