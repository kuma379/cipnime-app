import { Link } from "wouter";
import { ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
        <Ghost className="w-32 h-32 text-primary mx-auto mb-8 relative z-10 animate-bounce" style={{ animationDuration: "3s" }} />
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black font-display text-white mb-4 tracking-tighter">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Halaman Tersesat di Isekai
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
        Maaf, halaman yang kamu cari tidak dapat ditemukan. Mungkin sudah pindah dimensi atau memang tidak pernah ada.
      </p>
      
      <Link href="/">
        <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 px-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Dunia Asal (Beranda)
        </Button>
      </Link>
    </div>
  );
}
