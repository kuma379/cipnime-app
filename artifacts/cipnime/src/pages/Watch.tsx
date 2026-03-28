import { useRoute, Link } from "wouter";
import { useGetEpisodeSources } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Tv, Info, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";

export default function Watch() {
  const [, params] = useRoute("/watch/:episodeId");
  const episodeId = params?.episodeId || "";

  // The episode ID usually contains the anime ID pattern, but not strictly parseable.
  // We'll provide a simple back button.
  
  const { data: episode, isLoading, isError } = useGetEpisodeSources(
    { episodeId },
    { query: { enabled: !!episodeId } }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">Menyiapkan video player...</p>
        </div>
      </div>
    );
  }

  if (isError || !episode) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center max-w-lg w-full">
            <h3 className="text-2xl font-bold text-destructive mb-3">Gagal Memuat Video</h3>
            <p className="text-muted-foreground mb-6">Sumber video tidak ditemukan atau sedang gangguan.</p>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
        
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
              </Button>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black font-display text-white leading-tight">
                {episode.title}
              </h1>
              <p className="text-primary font-medium mt-1 text-lg">
                {episode.episode}
              </p>
            </div>
          </div>

          {/* Player Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <VideoPlayer sources={episode.sources} />
          </motion.div>

          {/* Info & Downloads */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Informasi
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Jika video tidak dapat diputar, coba ganti server video pada opsi di atas. Server dengan tipe <span className="text-primary font-semibold border border-primary/30 px-1 rounded">iframe</span> biasanya lebih stabil. Jika mengalami masalah buffering, turunkan kualitas video jika tersedia.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-accent" /> Link Download
              </h3>
              
              {episode.downloadLinks && episode.downloadLinks.length > 0 ? (
                <div className="space-y-3">
                  {episode.downloadLinks.map((link, idx) => (
                    <Button 
                      key={idx} 
                      variant="secondary" 
                      className="w-full justify-start overflow-hidden border border-white/5 hover:border-accent/30 hover:bg-accent/10"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      <Download className="w-4 h-4 mr-3 text-muted-foreground" />
                      <span className="flex-1 text-left truncate">{link.server}</span>
                      {link.quality && (
                        <span className="text-xs bg-black/40 px-2 py-1 rounded text-white font-mono">
                          {link.quality}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-black/20 rounded-xl border border-white/5">
                  <p className="text-muted-foreground text-sm">Link download belum tersedia.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}
