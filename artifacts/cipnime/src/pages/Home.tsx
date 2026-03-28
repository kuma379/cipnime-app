import { useState } from "react";
import { Link } from "wouter";
import { useGetOngoingAnime } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Flame, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useGetOngoingAnime({ page });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          {/* Abstract glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container relative mx-auto px-4 md:px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              <span>Update Anime Tercepat Setiap Hari</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white mb-6 leading-[1.1]">
              Nonton Anime <br />
              <span className="text-gradient">Sub Indo</span> Gratis
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Nikmati ribuan koleksi anime terbaru dan terlengkap dengan subtitle Indonesia. Streaming cepat, tanpa batas, dan kualitas HD.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Button size="lg" className="rounded-full w-full sm:w-auto text-lg px-8 shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]">
                <Flame className="w-5 h-5 mr-2" />
                Lihat Ongoing
              </Button>
              <Link href="/search?q=">
                <Button variant="glass" size="lg" className="rounded-full w-full sm:w-auto text-lg px-8">
                  Eksplorasi Anime
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ongoing Anime Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3 flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                Anime Ongoing
              </h2>
              <p className="text-muted-foreground">Update episode terbaru minggu ini</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium animate-pulse">Memuat daftar anime...</p>
            </div>
          ) : isError ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-destructive mb-2">Gagal Memuat Data</h3>
              <p className="text-muted-foreground mb-6">Terjadi kesalahan saat mengambil data anime. Silakan coba lagi.</p>
              <Button variant="outline" onClick={() => window.location.reload()}>Muat Ulang</Button>
            </div>
          ) : (
            <>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-16"
              >
                {data?.animeList?.map((anime, i) => (
                  <AnimeCard key={anime.animeId} anime={anime} index={i} />
                ))}
              </motion.div>

              {/* Pagination */}
              {data && (
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
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-white/5 bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CipNime. Dibuat untuk tujuan demonstrasi.
          </p>
        </div>
      </footer>
    </div>
  );
}
