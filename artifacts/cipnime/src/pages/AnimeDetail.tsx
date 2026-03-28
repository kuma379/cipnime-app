import { useRoute } from "wouter";
import { useGetAnimeDetail } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Play, Star, Calendar, Clock, Film, ListVideo, ArrowLeft, Loader2, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AnimeDetail() {
  const [, params] = useRoute("/anime/:animeId");
  const animeId = params?.animeId || "";

  const { data: anime, isLoading, isError } = useGetAnimeDetail(
    { animeId },
    { query: { enabled: !!animeId } }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">Memuat detail anime...</p>
        </div>
      </div>
    );
  }

  if (isError || !anime) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center max-w-lg w-full">
            <h3 className="text-2xl font-bold text-destructive mb-3">Anime Tidak Ditemukan</h3>
            <p className="text-muted-foreground mb-6">Mungkin ID anime salah atau data telah dihapus.</p>
            <Link href="/">
              <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const firstEpisode = anime.episodeList?.[anime.episodeList.length - 1]; // Assuming desc order, last is eps 1
  const latestEpisode = anime.episodeList?.[0]; // First is newest

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Banner Hero */}
        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-40"
            style={{ backgroundImage: `url(${anime.poster})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 -mt-[30vh] md:-mt-[40vh]">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Poster Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.6 }}
              className="shrink-0 mx-auto md:mx-0 w-64 md:w-72 lg:w-80 flex flex-col gap-6"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-white/5 bg-secondary group">
                <img 
                  src={anime.poster} 
                  alt={anime.title} 
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {latestEpisode && (
                <Link href={`/watch/${latestEpisode.episodeId}`}>
                  <Button size="lg" className="w-full text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                    <Play className="w-5 h-5 mr-2" fill="currentColor" />
                    Tonton Sekarang
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col pt-4 md:pt-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.status && (
                    <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-sm font-bold uppercase tracking-wide">
                      {anime.status}
                    </span>
                  )}
                  {anime.type && (
                    <span className="px-3 py-1 bg-white/10 text-white/90 border border-white/10 rounded-full text-sm font-semibold">
                      {anime.type}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-white mb-2 leading-tight">
                  {anime.title}
                </h1>
                {anime.japanese && (
                  <h2 className="text-lg md:text-xl text-muted-foreground font-medium mb-6">
                    {anime.japanese}
                  </h2>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm md:text-base text-white/80">
                  {anime.score && anime.score !== '?' && anime.score !== 'N/A' && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white text-lg">{anime.score}</span>
                    </div>
                  )}
                  {anime.episodes && (
                    <div className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-muted-foreground" />
                      <span>{anime.episodes} Episode</span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span>{anime.duration}</span>
                    </div>
                  )}
                  {anime.aired && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span>{anime.aired}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {anime.genreList?.map((genre) => (
                    <Link key={genre.genreId} href={`/search?q=${genre.title}`}>
                      <span className="px-4 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full text-sm font-medium transition-colors cursor-pointer border border-white/5">
                        {genre.title}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="glass-panel rounded-2xl p-6 md:p-8 mb-12">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" /> Sinopsis
                  </h3>
                  <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-base md:text-lg">
                    {anime.synopsis ? (
                      <p>{anime.synopsis}</p>
                    ) : (
                      <p className="italic">Sinopsis belum tersedia untuk anime ini.</p>
                    )}
                  </div>
                  
                  {anime.studios && (
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-muted-foreground">
                      <span className="font-semibold text-white/80">Studio:</span> {anime.studios}
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Episodes Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold font-display text-white flex items-center gap-3">
                    <ListVideo className="w-7 h-7 text-primary" /> Daftar Episode
                  </h3>
                  <span className="text-muted-foreground font-medium">{anime.episodeList?.length || 0} eps</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {anime.episodeList?.map((ep, idx) => (
                    <Link key={ep.episodeId} href={`/watch/${ep.episodeId}`}>
                      <div className="group flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-white/5 hover:border-primary/50 hover:bg-secondary transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-background group-hover:bg-primary/20 text-muted-foreground group-hover:text-primary transition-colors font-display font-bold text-xl">
                            {ep.eps}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium line-clamp-1 group-hover:text-primary transition-colors">
                              Episode {ep.eps}
                            </span>
                            {ep.date && (
                              <span className="text-xs text-muted-foreground mt-1">{ep.date}</span>
                            )}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-primary text-white transition-colors">
                          <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {(!anime.episodeList || anime.episodeList.length === 0) && (
                    <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                      <p className="text-muted-foreground">Belum ada episode yang tersedia.</p>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
