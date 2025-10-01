export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              Get in <span className="text-orange-500">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground">hello@suni.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground">1-800-SUNI-HELP</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Visit Our Store</h3>
              <p className="text-muted-foreground">
                123 Sunshine Blvd<br />
                San Francisco, CA 94102
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Customer Support Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 9AM - 8PM PST<br />
                Saturday - Sunday: 10AM - 6PM PST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

