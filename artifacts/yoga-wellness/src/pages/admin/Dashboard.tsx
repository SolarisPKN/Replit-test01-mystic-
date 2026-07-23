import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Inbox, CalendarClock, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function Dashboard() {
  const { data: stats, isLoading } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey() }
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const chartData = stats?.ordersByService?.map(item => ({
    name: formatServiceName(item.serviceType),
    total: item.count
  })) || [];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground">Resumen de actividad del estudio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard 
          title="Total Alumnas" 
          value={stats?.totalStudents ?? 0} 
          icon={<Users className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Alumnas Activas" 
          value={stats?.activeStudents ?? 0} 
          icon={<UserCheck className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Pedidos Pendientes" 
          value={stats?.pendingOrders ?? 0} 
          icon={<Inbox className="w-5 h-5 text-amber-500" />} 
        />
        <StatCard 
          title="Pedidos (Mes)" 
          value={stats?.ordersThisMonth ?? 0} 
          icon={<CalendarClock className="w-5 h-5 text-blue-500" />} 
        />
        <StatCard 
          title="Pagos (Mes)" 
          value={stats?.paymentsThisMonth ?? 0} 
          icon={<CreditCard className="w-5 h-5 text-emerald-500" />} 
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pedidos por Servicio</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="total" fill="hsl(15 45% 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No hay datos suficientes
              </div>
            )}
          </CardContent>
        </Card>

        {/* Can add recent pending orders list here later if needed */}
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 bg-muted rounded-full">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function formatServiceName(type: string) {
  const map: Record<string, string> = {
    yoga_class: "Yoga",
    carta_astral: "C. Astral",
    numerologia: "Numerología",
    tarot: "Tarot",
    radiomancia: "Radiomancia",
    reiki: "Reiki",
    pendulo: "Péndulo",
  };
  return map[type] || type;
}
