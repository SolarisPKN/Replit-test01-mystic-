import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Sun, Wind } from "lucide-react";

import heroImg from "@assets/generated_images/hero-yoga.jpg";

export function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Serene yoga pose at golden hour" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
            Donde el <span className="text-primary italic">movimiento</span><br/>encuentra el <span className="text-primary italic">misticismo</span>
          </h1>
          <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
            Clases de yoga y terapias holísticas para reconectar con tu esencia, alinear tu cuerpo y escuchar al cosmos.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 text-lg font-serif">
            <Link href="/pedido">Comienza tu viaje</Link>
          </Button>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-6 text-foreground">El cuerpo como templo</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Nuestras clases de yoga son el ancla. A través de la respiración consciente y el movimiento guiado, preparamos el cuerpo físico para recibir las energías más sutiles.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ya sea que busques flexibilidad, fuerza, o simplemente un momento de quietud en tu día, tenemos un lugar para ti en el mat.
              </p>
              <Button asChild variant="outline" className="mt-8 rounded-full">
                <Link href="/servicios">Conoce nuestras clases</Link>
              </Button>
            </div>
            <div className="aspect-square bg-muted rounded-2xl p-8 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 transition-colors group-hover:bg-primary/10"></div>
              <Wind className="w-32 h-32 text-primary/40 stroke-[1]" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Salud Energética</h2>
            <p className="text-lg text-muted-foreground">Más allá del plano físico, ofrecemos lecturas y canalizaciones para guiar tu espíritu.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ServiceCard 
              icon={<Moon className="w-8 h-8 text-primary" />}
              title="Carta Astral"
              desc="El mapa de los cielos en el momento de tu nacimiento. Descubre tus potencias y desafíos."
            />
            <ServiceCard 
              icon={<Sparkles className="w-8 h-8 text-primary" />}
              title="Tarot"
              desc="Espejo del alma. Una lectura intuitiva para encontrar claridad en momentos de incertidumbre."
            />
            <ServiceCard 
              icon={<Sun className="w-8 h-8 text-primary" />}
              title="Reiki"
              desc="Armonización energética para restablecer el flujo vital en tus centros de energía."
            />
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="link" className="text-lg font-serif">
              <Link href="/servicios">Ver todos los servicios holísticos →</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-background border rounded-2xl p-8 transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="mb-6 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-2xl font-serif font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
