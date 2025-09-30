import { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  MapPin, 
  Calendar,
  Star,
  MessageCircle,
  Download,
  RotateCcw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    userId: '1',
    total: 244.97,
    status: 'delivered',
    orderDate: '2024-01-15',
    guestEmail: null,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    items: [
      {
        name: 'Luminous Home Diffuser',
        price: 89.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1757774636743-e5235c608fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGhvbWUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NTkyMDk5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ]
  }
];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(mockOrders[0]);
  const [trackingEmail, setTrackingEmail] = useState('');
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'processing': return <Package className="h-5 w-5 text-blue-600" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-600" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const TrackingProgress = ({ order }: { order: any }) => {
    const steps = [
      { status: 'pending', label: 'Order Placed', date: order.orderDate },
      { status: 'processing', label: 'Processing', date: '2024-01-16' },
      { status: 'shipped', label: 'Shipped', date: '2024-01-17' },
      { status: 'delivered', label: 'Delivered', date: order.status === 'delivered' ? '2024-01-19' : undefined }
    ];

    const currentStepIndex = steps.findIndex(step => step.status === order.status);

    return (
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.status} className="flex items-start space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              index <= currentStepIndex 
                ? 'bg-orange-500 border-orange-500 text-white' 
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {getStatusIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </h4>
                {step.date && (
                  <span className={`text-sm ${index <= currentStepIndex ? 'text-gray-600' : 'text-gray-400'}`}>
                    {step.date}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-px h-8 ml-4 mt-2 ${
                  index < currentStepIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const OrderHistoryContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order History</h2>
        <Button variant="outline" className="border-orange-200">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                  <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                {order.items.slice(0, 3).map((item: any, index: number) => (
                  <ImageWithFallback
                    key={index}
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-muted-foreground">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const OrderTrackingContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
        <p className="text-muted-foreground">
          Enter your order details to track your package
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
          <CardDescription>Enter your order information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="trackingEmail">Email Address</Label>
            <Input
              id="trackingEmail"
              type="email"
              value={trackingEmail}
              onChange={(e) => setTrackingEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="trackingOrderId">Order ID</Label>
            <Input
              id="trackingOrderId"
              value={trackingOrderId}
              onChange={(e) => setTrackingOrderId(e.target.value)}
              placeholder="ORD-001"
            />
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            disabled={!trackingEmail || !trackingOrderId}
          >
            Track Order
          </Button>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Order #{selectedOrder.id}</CardTitle>
            <CardDescription>Current status: {selectedOrder.status}</CardDescription>
          </CardHeader>
          <CardContent>
            <TrackingProgress order={selectedOrder} />
          </CardContent>
        </Card>
      )}
    </div>
  );

  const OrderConfirmationContent = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-xl text-muted-foreground">
          Thank you for your purchase. We've sent a confirmation email to your inbox.
        </p>
      </div>

      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <span className="font-medium">{selectedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Date:</span>
              <span className="font-medium">{selectedOrder.orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-medium">${selectedOrder.total.toFixed(2)}</span>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Shipping Address</h4>
              <p className="text-sm text-muted-foreground">
                {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                {selectedOrder.shippingAddress.address1}<br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline"
          className="border-orange-200"
        >
          Continue Shopping
        </Button>
        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
          Track Order
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Orders</h1>
          </div>

          <Tabs defaultValue="history" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="history">Order History</TabsTrigger>
              <TabsTrigger value="tracking">Track Order</TabsTrigger>
              <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <OrderHistoryContent />
            </TabsContent>

            <TabsContent value="tracking">
              <OrderTrackingContent />
            </TabsContent>

            <TabsContent value="confirmation">
              <OrderConfirmationContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
