import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { OrderInputServiceType } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  clientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  clientEmail: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  clientPhone: z.string().min(6, "Número de teléfono inválido").optional().or(z.literal("")),
  serviceType: z.enum(["yoga_class", "carta_astral", "numerologia", "tarot", "radiomancia", "reiki", "pendulo"]),
  message: z.string().optional(),
}).refine(data => data.clientEmail || data.clientPhone, {
  message: "Debes proporcionar al menos un correo o un teléfono para contactarte",
  path: ["clientEmail"]
});

export function Order() {
  const createOrder = useCreateOrder();
  const [, setLocation] = useLocation();
  
  // Extract service from URL if present
  const params = new URLSearchParams(window.location.search);
  const defaultService = params.get("service") as OrderInputServiceType | null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      serviceType: defaultService && Object.values(OrderInputServiceType).includes(defaultService) 
        ? defaultService 
        : "yoga_class",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createOrder.mutate({ data: values }, {
      onSuccess: () => {
        toast.success("Solicitud enviada. Nos pondremos en contacto contigo a la brevedad.");
        setLocation("/");
      },
      onError: () => {
        toast.error("Hubo un problema al enviar tu solicitud. Intenta nuevamente.");
      }
    });
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Haz tu reserva</h1>
          <p className="text-lg text-muted-foreground">
            Déjanos tus datos y qué servicio te interesa. Nos comunicaremos contigo para coordinar horarios y detalles.
          </p>
        </div>

        <Card className="border shadow-md">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-serif">¿Qué servicio te interesa?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecciona un servicio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yoga_class">Clases de Yoga</SelectItem>
                          <SelectItem value="carta_astral">Carta Astral</SelectItem>
                          <SelectItem value="numerologia">Numerología</SelectItem>
                          <SelectItem value="tarot">Tarot Terapéutico</SelectItem>
                          <SelectItem value="radiomancia">Radiomancia</SelectItem>
                          <SelectItem value="reiki">Reiki</SelectItem>
                          <SelectItem value="pendulo">Péndulo Hebreo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" className="h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="tu@correo.com" type="email" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono / WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="+54 9 11..." type="tel" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Cuéntanos un poco sobre lo que buscas, si tienes experiencia previa o alguna consulta..." 
                          className="min-h-[120px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-serif rounded-xl"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
