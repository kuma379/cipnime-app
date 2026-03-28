import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSearchAnime } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Loader2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  // Debounce effect isn't needed if we use explicit search button, but useful for typing
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== activeQuery) {
      setActiveQuery(query.trim());
      setPage(1);
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const { data, isLoading, isError, isFetching } = useSearchAnime(
    { q: activeQuery, page },
    { query: { enabled: activeQuery.length > 0 } }
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
            Eksplorasi <span className="text-gradient">Anime</span>
          </h1>
          
          <form onSubmit={handleSearch} className="relative flex items-center gap-3">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik judul anime..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-secondary/50 border-white/10 text-lg shadow-inner focus-visible:bg-secondary"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 rounded-2xl px-8" disabled={isFetching}>
              {isFetching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cari"}
            </Button>
          </form>
        </div>

        {activeQuery && (
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Hasil pencarian untuk <span className="text-primary">"{activeQuery}"</span>
            </h2>
            {data && (
              <p className="text-muted-foreground text-sm">
                Menampilkan halaman {data.currentPage}
              </p>
            )}
          </div>
        )}

        {!activeQuery ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <SearchIcon className="w-20 h-20 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Mulai Pencarian</h3>
            <p className="text-muted-foreground max-w-md">Ketik judul anime yang ingin kamu tonton di kolom pencarian di atas.</p>
          </div>
        ) : isLoading || isFetching ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium animate-pulse">Mencari anime...</p>
          </div>
        ) : isError ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-destructive mb-2">Pencarian Gagal</h3>
            <p className="text-muted-foreground">Terjadi kesalahan saat mencari anime. Silakan coba kata kunci lain.</p>
          </div>
        ) : data?.animeList?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <XCircle className="w-20 h-20 text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Tidak Ditemukan</h3>
            <p className="text-muted-foreground max-w-md">Maaf, kami tidak menemukan anime yang cocok dengan kata kunci "{activeQuery}".</p>
          </div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-16"
            >
              {data?.animeList?.map((anime, i) => (
                <AnimeCard key={anime.animeId} anime={anime} index={i} />
              ))}
            </motion.div>

            {/* Pagination */}
            {data && (data.hasNextPage || page > 1) && (
              <div className="flex items-center justify-center gap-4 pt-8 border-t border-white/5">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Sebelumnya
                </Button>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary font-bold font-display text-xl">
                  {page}
                </div>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.hasNextPage || isFetching}
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
