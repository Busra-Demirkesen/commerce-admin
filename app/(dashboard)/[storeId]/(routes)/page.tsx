
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { CardTitle,Card, CardHeader, CardContent } from "@/components/ui/card";
import { formatter } from '@/lib/utils';
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { Overview } from "@/components/overview";
import { getGraphRevenue } from "@/actions/get-graph-revenue";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>; 
}


const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { storeId } = await params; // Await params here
const totalRevenue = await getTotalRevenue(storeId);
const salesCount = await getSalesCount(storeId);
const stockCount = await getStockCount(storeId);
const graphData = await getGraphRevenue(storeId);


  return (
    <div className="flex-col">
    
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store"/>
        <Separator/>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 bp-2'>
             <CardTitle className='text-sm font-medium'>
             Total Revenue
             </CardTitle>              
              <DollarSign className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 bp-2'>
             <CardTitle className='text-sm font-medium'>
             Sales
             </CardTitle>              
              <CreditCard className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
              +{salesCount}
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
             <CardTitle className='text-sm font-medium'>
             Product in Stock
             </CardTitle>              
              <Package className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              Overview
            </CardTitle>
          </CardHeader>
        <CardContent className="pl-2">
          <Overview data={graphData}/> 
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

