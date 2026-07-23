import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  useGetStudent, getGetStudentQueryKey, 
  useUpdateStudent, 
  useDeleteStudent,
  useListStudentPayments, getListStudentPaymentsQueryKey,
  useCreatePayment,
  useDeletePayment
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Trash2, CalendarPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Slider } from "@/components/ui/slider";
import { useEffect } from "react";

// Same schema as NewStudent, but with flexibility fields
const formSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  paymentType: z.enum(["monthly", "weekly", "per_class"]).optional(),
  active: z.boolean(),
  medicalNotes: z.string().optional(),
  observations: z.string().optional(),
  flexForwardBend: z.number().min(0).max(10),
  flexBackwardBend: z.number().min(0).max(10),
  flexSideBend: z.number().min(0).max(10),
  flexSeatedTwist: z.number().min(0).max(10),
});

const paymentSchema = z.object({
  paymentType: z.enum(["monthly", "weekly", "per_class"]),
  amount: z.coerce.number().min(1, "Monto requerido"),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
  notes: z.string().optional(),
});

export function StudentDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const createPayment = useCreatePayment();
  const removePayment = useDeletePayment();

  const { data: student, isLoading } = useGetStudent(id, {
    query: { 
      enabled: !isNaN(id), 
      queryKey: getGetStudentQueryKey(id) 
    }
  });

  const { data: payments } = useListStudentPayments(id, {
    query: {
      enabled: !isNaN(id),
      queryKey: getListStudentPaymentsQueryKey(id)
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      active: true,
      medicalNotes: "",
      observations: "",
      flexForwardBend: 0,
      flexBackwardBend: 0,
      flexSideBend: 0,
      flexSeatedTwist: 0,
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentType: "monthly",
      amount: 0,
      periodStart: "",
      periodEnd: "",
      notes: "",
    }
  });

  // Init form
  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        email: student.email || "",
        phone: student.phone || "",
        paymentType: student.paymentType || "monthly",
        active: student.active,
        medicalNotes: student.medicalNotes || "",
        observations: student.observations || "",
        flexForwardBend: student.flexForwardBend || 0,
        flexBackwardBend: student.flexBackwardBend || 0,
        flexSideBend: student.flexSideBend || 0,
        flexSeatedTwist: student.flexSeatedTwist || 0,
      });
      
      // Auto-set payment type
      if (student.paymentType) {
        paymentForm.setValue("paymentType", student.paymentType);
      }
    }
  }, [student, form, paymentForm]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateStudent.mutate({ id, data: values }, {
      onSuccess: () => {
        toast.success("Datos guardados exitosamente");
        queryClient.invalidateQueries({ queryKey: getGetStudentQueryKey(id) });
      },
      onError: () => {
        toast.error("Error al guardar los datos");
      }
    });
  };

  const onPaymentSubmit = (values: z.infer<typeof paymentSchema>) => {
    createPayment.mutate({ id, data: values }, {
      onSuccess: () => {
        toast.success("Pago registrado");
        paymentForm.reset({ ...paymentForm.getValues(), amount: 0, periodStart: "", periodEnd: "", notes: "" });
        queryClient.invalidateQueries({ queryKey: getListStudentPaymentsQueryKey(id) });
      },
      onError: () => {
        toast.error("Error al registrar pago");
      }
    });
  };

  const handleDelete = () => {
    if (confirm("¿Estás segura de eliminar esta alumna? Se borrará todo su historial.")) {
      deleteStudent.mutate({ id }, {
        onSuccess: () => {
          toast.success("Alumna eliminada");
          setLocation("/admin/alumnas");
        }
      });
    }
  };

  const handleDeletePayment = (paymentId: number) => {
    if (confirm("¿Eliminar este pago?")) {
      removePayment.mutate({ id: paymentId }, {
        onSuccess: () => {
          toast.success("Pago eliminado");
          queryClient.invalidateQueries({ queryKey: getListStudentPaymentsQueryKey(id) });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!student) return null;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="ghost" className="mb-2 -ml-4 text-muted-foreground" onClick={() => setLocation("/admin/alumnas")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a alumnas
          </Button>
          <h1 className="text-3xl font-serif font-bold text-foreground">{student.name}</h1>
          <p className="text-muted-foreground">Registrada el {format(new Date(student.createdAt), "d MMM, yyyy", { locale: es })}</p>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Eliminar Alumna
        </Button>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="evolucion">Evolución</TabsTrigger>
          <TabsTrigger value="pagos">Pagos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="paymentType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pase Preferido</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Mensual</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="per_class">Por Clase</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="active" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="m-0">Alumna Activa</FormLabel>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="medicalNotes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Médicas / Lesiones</FormLabel>
                      <FormControl><Textarea {...field} className="h-24" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="observations" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones de Práctica</FormLabel>
                      <FormControl><Textarea {...field} className="h-24" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={updateStudent.isPending}>
                      {updateStudent.isPending ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evolucion">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Flexibilidad (0-10)</CardTitle>
              <CardDescription>
                Evalúa el progreso de las asanas principales. 10 representa la máxima expresión de la postura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    
                    <FormField control={form.control} name="flexForwardBend" render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-end mb-4">
                          <FormLabel className="text-base font-serif">Paschimottanasana</FormLabel>
                          <span className="font-bold text-primary">{field.value} / 10</span>
                        </div>
                        <FormControl>
                          <Slider 
                            min={0} max={10} step={1} 
                            value={[field.value]} 
                            onValueChange={(vals) => field.onChange(vals[0])} 
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-2">Flexión hacia adelante. Evalúa isquiotibiales y espalda baja.</p>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="flexBackwardBend" render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-end mb-4">
                          <FormLabel className="text-base font-serif">Ustrasana</FormLabel>
                          <span className="font-bold text-primary">{field.value} / 10</span>
                        </div>
                        <FormControl>
                          <Slider 
                            min={0} max={10} step={1} 
                            value={[field.value]} 
                            onValueChange={(vals) => field.onChange(vals[0])} 
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-2">Flexión hacia atrás. Evalúa apertura de pecho y psoas.</p>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="flexSideBend" render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-end mb-4">
                          <FormLabel className="text-base font-serif">Trikonasana</FormLabel>
                          <span className="font-bold text-primary">{field.value} / 10</span>
                        </div>
                        <FormControl>
                          <Slider 
                            min={0} max={10} step={1} 
                            value={[field.value]} 
                            onValueChange={(vals) => field.onChange(vals[0])} 
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-2">Flexión lateral. Evalúa oblicuos y caderas.</p>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="flexSeatedTwist" render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-end mb-4">
                          <FormLabel className="text-base font-serif">Ardha Matsyendrasana</FormLabel>
                          <span className="font-bold text-primary">{field.value} / 10</span>
                        </div>
                        <FormControl>
                          <Slider 
                            min={0} max={10} step={1} 
                            value={[field.value]} 
                            onValueChange={(vals) => field.onChange(vals[0])} 
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-2">Torsión espinal. Evalúa movilidad de columna.</p>
                      </FormItem>
                    )} />
                    
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={updateStudent.isPending}>
                      {updateStudent.isPending ? "Guardando..." : "Guardar Métricas"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Registrar Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                      <FormField control={paymentForm.control} name="amount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monto ($)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={paymentForm.control} name="paymentType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Pase</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="monthly">Mensual</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="per_class">Por Clase</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={paymentForm.control} name="periodStart" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inicio del período</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={paymentForm.control} name="periodEnd" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fin del período</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={paymentForm.control} name="notes" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <Button type="submit" className="w-full" disabled={createPayment.isPending}>
                        <CalendarPlus className="w-4 h-4 mr-2" />
                        Registrar
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Historial de Pagos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha de Pago</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(!payments || payments.length === 0) ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No hay pagos registrados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{format(new Date(payment.paidAt), "d MMM yyyy", { locale: es })}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatPaymentType(payment.paymentType)}
                                {(payment.periodStart || payment.periodEnd) && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {payment.periodStart ? format(new Date(payment.periodStart), "d MMM", { locale: es }) : "?"} 
                                    {" - "} 
                                    {payment.periodEnd ? format(new Date(payment.periodEnd), "d MMM", { locale: es }) : "?"}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {payment.amount ? `$${payment.amount}` : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeletePayment(payment.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

function formatPaymentType(type: string) {
  const map: Record<string, string> = {
    monthly: "Mensual",
    weekly: "Semanal",
    per_class: "Por Clase",
  };
  return map[type] || type;
}
