import { useState } from "react";
import { Link } from "wouter";
import { Star, Play, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { AnimeItem } from "@workspace/api-client-react";

interface AnimeCardProps {
  anime: AnimeItem;
  index?: number;
}

export default function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  const [imgError, setImgError] = useState(false);

  // Extract ID from the href if it exists, otherwise use animeId directly
  // The API seems to sometimes return full paths in animeId, or clean IDs.
  const detailPath = `/anime/${encodeURIComponent(anime.animeId)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5), ease: "easeOut" }}
    >
      <Link href={detailPath} className="group block h-full">
        <div className="relative flex flex-col h-full rounded-2xl overflow-hidden bg-secondary/30 border border-white/5 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
          
          {/* Image Container */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
            {!imgError && anime.poster ? (
              <img
                src={anime.poster}
                alt={anime.title}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary to-background flex items-center justify-center">
                <Play className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Hover Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
              <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              {anime.score && anime.score !== "N/A" && anime.score !== "?" && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-bold text-yellow-400 border border-white/10 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  {anime.score}
                </div>
              )}
              
              <div className="flex flex-col gap-1.5 items-end">
                {anime.type && (
                  <span className="px-2 py-1 rounded-md bg-primary/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                    {anime.type}
                  </span>
                )}
                {anime.status && (
                  <span className="px-2 py-1 rounded-md bg-accent/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                    {anime.status}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Info inside image */}
            <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {anime.episodes ? (
                <span className="inline-block px-2 py-1 mb-2 rounded bg-white/10 backdrop-blur-md text-xs font-medium text-white/90 border border-white/10">
                  {anime.episodes} Eps
                </span>
              ) : null}
              {anime.latestReleaseDate && (
                <div className="flex items-center gap-1.5 text-xs text-white/70 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>{anime.latestReleaseDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="p-4 flex-1 flex flex-col bg-gradient-to-b from-transparent to-background/50">
            <h3 className="font-display font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {anime.title}
            </h3>
            {anime.releaseDay && (
              <p className="text-sm text-muted-foreground mt-auto pt-2 font-medium">
                Rilis: <span className="text-primary/80">{anime.releaseDay}</span>
              </p>
            )}
          </div>
          
        </div>
      </Link>
    </motion.div>
  );
}
