import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, PlayCircle, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
              <PlayCircle className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-white group-hover:text-primary transition-colors">
              Cip<span className="text-primary">Nime</span>
            </span>
          </Link>

          {/* Desktop Nav & Search */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-end ml-12">
            <nav className="flex items-center gap-1">
              <Link href="/">
                <Button variant={location === "/" ? "secondary" : "ghost"} className="rounded-full">
                  Home
                </Button>
              </Link>
              <Link href="/ongoing">
                <Button variant={location === "/ongoing" ? "secondary" : "ghost"} className="rounded-full">
                  <Flame className="w-4 h-4 mr-2 text-orange-500" />
                  Ongoing
                </Button>
              </Link>
            </nav>

            <form onSubmit={handleSearch} className="relative w-full max-w-xs group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="search"
                placeholder="Cari anime..."
                className="pl-10 rounded-full bg-secondary/50 border-white/5 focus-visible:bg-secondary focus-visible:ring-primary/30 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 glass-panel border-t-0 p-4 flex flex-col gap-4 md:hidden shadow-2xl"
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari anime..."
                className="pl-10 bg-secondary/80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="flex flex-col gap-2">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Button>
              </Link>
              <Link href="/ongoing">
                <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  <Flame className="w-5 h-5 mr-3 text-orange-500" />
                  Ongoing
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
