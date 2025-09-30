import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input type="password" placeholder="Enter your password" />
          </div>
          <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
            Sign In
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="text-orange-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
