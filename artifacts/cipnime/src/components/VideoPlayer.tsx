import { useState, useEffect } from "react";
import { ExternalLink, Play, MonitorPlay, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import type { StreamSource } from "@workspace/api-client-react";

interface VideoPlayerProps {
  sources: StreamSource[];
}

export default function VideoPlayer({ sources }: VideoPlayerProps) {
  const [activeSource, setActiveSource] = useState<StreamSource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sources && sources.length > 0 && !activeSource) {
      // Prefer iframe sources first
      const iframeSource = sources.find((s) => s.type === "iframe" || !s.isExternal);
      setActiveSource(iframeSource || sources[0]);
    }
  }, [sources, activeSource]);

  if (!sources || sources.length === 0) {
    return (
      <div className="w-full aspect-video bg-secondary/50 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-4 opacity-50 text-destructive" />
        <h3 className="text-xl font-bold text-foreground mb-2">Video Tidak Tersedia</h3>
        <p>Maaf, sumber video untuk episode ini belum tersedia atau sedang bermasalah.</p>
      </div>
    );
  }

  const handleSourceChange = (source: StreamSource) => {
    setIsLoading(true);
    setActiveSource(source);
  };

  return (
    <div className="space-y-6">
      {/* Player Container */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 group">
        
        {isLoading && activeSource?.type === 'iframe' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary/80 backdrop-blur-sm">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-5 h-5 text-primary opacity-50" />
              </div>
            </div>
          </div>
        )}

        {activeSource?.type === 'iframe' || (!activeSource?.isExternal && activeSource?.url.includes('http')) ? (
          <iframe
            src={activeSource.url}
            className="w-full h-full absolute inset-0 border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary/80 to-background p-8 text-center">
            <MonitorPlay className="w-20 h-20 text-primary mb-6 opacity-80" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              External Player Required
            </h3>
            <p className="text-muted-foreground max-w-md mb-8">
              Sumber video ini memerlukan pemutar eksternal atau dialihkan ke halaman penyedia.
            </p>
            <Button
              size="lg"
              className="rounded-full shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]"
              onClick={() => window.open(activeSource.url, "_blank")}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Buka di Tab Baru
            </Button>
          </div>
        )}
      </div>

      {/* Server Selection */}
      <div className="glass-panel rounded-2xl p-5 md:p-6">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <MonitorPlay className="w-4 h-4" />
          Pilih Server Video
        </h4>
        <div className="flex flex-wrap gap-3">
          {sources.map((source, idx) => {
            const isActive = activeSource?.url === source.url;
            return (
              <Button
                key={idx}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleSourceChange(source)}
                className={`rounded-xl transition-all duration-300 ${
                  isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                }`}
              >
                {source.isExternal && <ExternalLink className="w-3.5 h-3.5 mr-2 opacity-70" />}
                {source.server}
                {source.quality && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary/20 text-primary'
                  }`}>
                    {source.quality}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
