"use client";

import { useEffect, useState } from "react";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Store } from "@prisma/client";

interface NavbarProps {
  stores: Store[];
  userId: string;
}

const Navbar: React.FC<NavbarProps> = ({ stores, userId: _userId }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:gap-4 lg:px-8">
        <StoreSwitcher items={stores} />
        <div className="flex flex-1 items-center justify-end lg:justify-start">
          <MainNav className="justify-end lg:justify-start" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
