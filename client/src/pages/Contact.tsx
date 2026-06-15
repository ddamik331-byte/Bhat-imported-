import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const submitContactForm = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    await submitContactForm.mutateAsync(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-border py-12 md:py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 animate-fade-in">
          <h1 className="serif text-5xl md:text-6xl font-bold text-foreground mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-foreground/70">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Email */}
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-foreground/60">support@bhatimporter.com</p>
                  <p className="text-foreground/60">info@bhatimporter.com</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-foreground/60">+1 (555) 123-4567</p>
                  <p className="text-foreground/60">+1 (555) 987-6543</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Address</h3>
                  <p className="text-foreground/60">123 Fashion Street</p>
                  <p className="text-foreground/60">New York, NY 10001</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                  <p className="text-foreground/60">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-foreground/60">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-foreground/60">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/30 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={submitContactForm.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium transition-all duration-300 hover:shadow-lg"
              >
                {submitContactForm.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-12 md:py-16 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Find Us
          </h2>
          <div className="w-full h-96 rounded-lg overflow-hidden bg-foreground/10 flex items-center justify-center">
            <p className="text-foreground/60">Map integration coming soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
