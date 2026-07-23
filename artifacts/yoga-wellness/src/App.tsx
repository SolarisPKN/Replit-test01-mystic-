import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Home } from '@/pages/public/Home';
import { Services } from '@/pages/public/Services';
import { Order } from '@/pages/public/Order';
import { Dashboard } from '@/pages/admin/Dashboard';
import { StudentList } from '@/pages/admin/StudentList';
import { StudentDetail } from '@/pages/admin/StudentDetail';
import { NewStudent } from '@/pages/admin/NewStudent';
import { OrderList } from '@/pages/admin/OrderList';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600">Página no encontrada</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/servicios" component={Services} />
      <Route path="/pedido" component={Order} />
      
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/alumnas" component={StudentList} />
      <Route path="/admin/alumnas/nueva" component={NewStudent} />
      <Route path="/admin/alumnas/:id" component={StudentDetail} />
      <Route path="/admin/pedidos" component={OrderList} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster position="top-center" richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
