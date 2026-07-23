import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListOrders, getListOrdersQueryKey, useUpdateOrder, OrderStatus, useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function OrderList() {
  const queryClient = useQueryClient();
  const updateOrder = useUpdateOrder();
  
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data: orders, isLoading } = useListOrders(undefined, {
    query: { queryKey: getListOrdersQueryKey() }
  });

  const handleStatusChange = (id: number, newStatus: OrderStatus) => {
    updateOrder.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => {
        toast.success("Estado actualizado");
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        if (selectedOrderId === id) {
           queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(id) });
        }
      },
      onError: () => {
        toast.error("Error al actualizar estado");
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Pedidos y Reservas</h1>
        <p className="text-muted-foreground">Gestiona las solicitudes de servicios de tus clientes.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay pedidos registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(order.createdAt), "d MMM, yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.clientName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5">
                          {formatServiceName(order.serviceType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={order.status} 
                          onValueChange={(val) => handleStatusChange(order.id, val as OrderStatus)}
                          disabled={updateOrder.isPending}
                        >
                          <SelectTrigger className={`w-[140px] h-8 text-xs ${getStatusColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="in_progress">En Progreso</SelectItem>
                            <SelectItem value="completed">Completado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="sm" onClick={() => setSelectedOrderId(order.id)}>
                            Ver detalles
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <OrderDetailDialog 
         orderId={selectedOrderId} 
         onClose={() => setSelectedOrderId(null)} 
      />
    </AdminLayout>
  );
}

function OrderDetailDialog({ orderId, onClose }: { orderId: number | null, onClose: () => void }) {
   const { data: order, isLoading } = useGetOrder(orderId as number, {
      query: {
         enabled: orderId !== null,
         queryKey: orderId ? getGetOrderQueryKey(orderId) : ["order", "null"]
      }
   });

   return (
      <Dialog open={orderId !== null} onOpenChange={(open) => !open && onClose()}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="font-serif text-2xl">Detalle del Pedido</DialogTitle>
               <DialogDescription>
                  Información completa de la reserva.
               </DialogDescription>
            </DialogHeader>
            
            {isLoading ? (
               <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               </div>
            ) : order ? (
               <div className="space-y-4 pt-4">
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                     <p className="text-lg font-medium">{order.clientName}</p>
                     {order.clientEmail && <p className="text-sm">{order.clientEmail}</p>}
                     {order.clientPhone && <p className="text-sm">{order.clientPhone}</p>}
                  </div>
                  
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">Servicio</p>
                     <p>{formatServiceName(order.serviceType)}</p>
                  </div>
                  
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">Mensaje</p>
                     <p className="text-sm bg-muted/50 p-3 rounded-md mt-1">
                        {order.message || "Sin mensaje adicional."}
                     </p>
                  </div>
                  
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">Fecha de solicitud</p>
                     <p className="text-sm">{format(new Date(order.createdAt), "PPP p", { locale: es })}</p>
                  </div>
               </div>
            ) : null}
         </DialogContent>
      </Dialog>
   );
}

function formatServiceName(type: string) {
  const map: Record<string, string> = {
    yoga_class: "Clase de Yoga",
    carta_astral: "Carta Astral",
    numerologia: "Numerología",
    tarot: "Tarot Terapéutico",
    radiomancia: "Radiomancia",
    reiki: "Reiki",
    pendulo: "Péndulo Hebreo",
  };
  return map[type] || type;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return "border-amber-200 bg-amber-50 text-amber-700";
    case 'in_progress': return "border-blue-200 bg-blue-50 text-blue-700";
    case 'completed': return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case 'cancelled': return "border-slate-200 bg-slate-50 text-slate-700";
    default: return "";
  }
}
