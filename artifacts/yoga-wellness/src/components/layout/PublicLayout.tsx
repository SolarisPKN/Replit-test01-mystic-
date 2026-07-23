import { Link } from "wouter";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
            Yoga & Bienestar
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/servicios" className="text-sm font-medium hover:text-primary transition-colors">
              Servicios
            </Link>
            <Link href="/pedido" className="text-sm font-medium hover:text-primary transition-colors">
              Reservar
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-xl font-semibold mb-4 text-primary">Yoga & Bienestar</p>
          <p className="text-sm text-muted-foreground">Un espacio sagrado para el cuerpo y el cosmos.</p>
          <p className="text-xs text-muted-foreground mt-8">&copy; {new Date().getFullYear()} Yoga & Bienestar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
