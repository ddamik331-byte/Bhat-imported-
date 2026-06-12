import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background to-muted">
        <div className="container">
          <h1 className="serif text-4xl md:text-5xl font-bold mb-6">
            About Bhat Importer Clothes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover the story behind our brand and our commitment to quality, style, and sustainability
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="serif text-3xl md:text-4xl font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Bhat Importer Clothes was founded with a simple vision: to bring premium, carefully curated clothing to fashion enthusiasts who value quality and style.
                </p>
                <p>
                  Each piece in our collection is handpicked from the finest suppliers around the world. We believe that fashion should be accessible, sustainable, and timeless.
                </p>
                <p>
                  Our commitment extends beyond just selling clothes. We're dedicated to supporting ethical manufacturing practices and reducing our environmental impact.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-lg aspect-square flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Brand Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <h2 className="serif text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality",
                description:
                  "We never compromise on quality. Every item is inspected to ensure it meets our high standards.",
              },
              {
                title: "Sustainability",
                description:
                  "We're committed to reducing our environmental impact through ethical sourcing and packaging.",
              },
              {
                title: "Style",
                description:
                  "Fashion should be timeless and elegant. We curate collections that transcend trends.",
              },
            ].map((value, index) => (
              <div key={index} className="bg-background rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="serif text-3xl md:text-4xl font-bold mb-8">
                Get In Touch
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:info@bhatimporter.com"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      info@bhatimporter.com
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a
                      href="tel:+1234567890"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      123 Fashion Street<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-muted rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea placeholder="Your message..." rows={4} />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
