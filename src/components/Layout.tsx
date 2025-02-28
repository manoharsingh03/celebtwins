
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Layout = ({ children, className, fullWidth = false }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={cn(
        "flex-1",
        fullWidth ? "w-full" : "container mx-auto px-4",
        className
      )}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
