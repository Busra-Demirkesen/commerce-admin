"use client";

import { useState, useEffect } from "react";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Store } from "@prisma/client";

interface NavbarProps {
  stores: Store[];
  userId: string; // bu satır deploy hatası verdi
}

const Navbar: React.FC<NavbarProps> = ({ stores, userId }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
