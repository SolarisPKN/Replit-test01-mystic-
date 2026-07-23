import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, Moon, Sun, Wind, Activity, Star, Eye } from "lucide-react";

export function Services() {
  return (
    <PublicLayout>
      <div className="bg-background py-20 border-b">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">Nuestros Servicios</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Prácticas para el cuerpo y lecturas para el alma.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10 border-b pb-6">
            <Activity className="w-10 h-10 text-primary" />
            <h2 className="text-4xl font-serif font-bold text-foreground">El Cuerpo: Yoga</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Nuestras clases de yoga están diseñadas para todos los niveles. Integramos asanas (posturas), pranayama (respiración) y dhyana (meditación) para crear una práctica completa que purifica el cuerpo y aquieta la mente.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✧</span>
                  <span className="text-foreground">Hatha Yoga (Fluidez y control)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✧</span>
                  <span className="text-foreground">Vinyasa (Movimiento dinámico)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✧</span>
                  <span className="text-foreground">Yin Yoga (Quietud y elongación profunda)</span>
                </li>
              </ul>
              <Button asChild size="lg" className="rounded-full font-serif">
                <Link href="/pedido?service=yoga_class">Reservar clase</Link>
              </Button>
            </div>
            <div className="bg-card rounded-2xl p-8 border">
              <h3 className="text-2xl font-serif font-bold mb-4">Modalidades</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-1">Pase Mensual</h4>
                  <p className="text-muted-foreground">Acceso ilimitado a todas las prácticas del mes. Para quienes buscan disciplina y transformación constante.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Pase Semanal</h4>
                  <p className="text-muted-foreground">Ideal para mantener un ritmo sostenido con flexibilidad.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Clase Suelta</h4>
                  <p className="text-muted-foreground">Ven cuando lo sientas. Tu mat siempre estará esperándote.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-10 border-b pb-6">
            <Sparkles className="w-10 h-10 text-primary" />
            <h2 className="text-4xl font-serif font-bold text-foreground">El Alma: Salud Energética</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              id="carta_astral"
              icon={<Moon className="w-6 h-6 text-primary" />}
              title="Carta Astral"
              desc="Interpretación profunda de tu mapa natal. Entiende tus patrones, talentos ocultos y la energía disponible para tu evolución."
            />
            <ServiceCard 
              id="numerologia"
              icon={<Star className="w-6 h-6 text-primary" />}
              title="Numerología"
              desc="El código secreto de tu fecha de nacimiento y nombre. Descubre tu misión de vida y los ciclos que atraviesas."
            />
            <ServiceCard 
              id="tarot"
              icon={<Eye className="w-6 h-6 text-primary" />}
              title="Tarot Terapéutico"
              desc="Una lectura orientada a la sanación y toma de consciencia, no adivinatoria. El tarot como espejo de tu psique."
            />
            <ServiceCard 
              id="radiomancia"
              icon={<Wind className="w-6 h-6 text-primary" />}
              title="Radiomancia"
              desc="Medición y diagnóstico de los campos electromagnéticos de tu cuerpo y espacios vitales."
            />
            <ServiceCard 
              id="reiki"
              icon={<Sun className="w-6 h-6 text-primary" />}
              title="Reiki"
              desc="Terapia de canalización de energía vital a través de las manos para promover la sanación física y emocional."
            />
            <ServiceCard 
              id="pendulo"
              icon={<Activity className="w-6 h-6 text-primary" />}
              title="Péndulo Hebreo"
              desc="Limpieza energética profunda, detección de bloqueos y armonización de chakras a través de la radiestesia."
            />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function ServiceCard({ id, icon, title, desc }: { id: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-card border rounded-2xl p-6 flex flex-col h-full">
      <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
      <div className="mt-6 pt-4 border-t">
        <Link href={`/pedido?service=${id}`} className="text-primary font-medium hover:underline flex items-center gap-2 text-sm">
          Solicitar sesión →
        </Link>
      </div>
    </div>
  );
}
