
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Upload", path: "/upload" },
    { title: "Profile", path: "/profile" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">CelebTwin</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="text-sm animate-fade-in">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
