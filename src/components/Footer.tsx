
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CelebTwin</h3>
            <p className="text-muted-foreground">
              Discover your celebrity doppelgänger using our advanced AI technology.
              Upload your photo and see which celebrities share your looks.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-muted-foreground hover:text-foreground transition-colors">
                  Upload
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CelebTwin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
