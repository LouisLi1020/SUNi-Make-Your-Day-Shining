interface LoginProps {
  onNavigate: (page: string) => void;
  onLogin: (email: string, admin?: boolean) => void;
}

export default function Login({ onNavigate, onLogin }: LoginProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Suni account</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => onLogin('john.doe@email.com', false)}
              className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Login as Customer</div>
              <div className="text-sm text-muted-foreground">john.doe@email.com</div>
            </button>
            <button
              onClick={() => onLogin('admin@suni.com', true)}
              className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Login as Admin</div>
              <div className="text-sm text-muted-foreground">admin@suni.com</div>
            </button>
            <button
              onClick={() => onNavigate('guest-lookup')}
              className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Guest Order Lookup</div>
              <div className="text-sm text-muted-foreground">Find your orders without an account</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

