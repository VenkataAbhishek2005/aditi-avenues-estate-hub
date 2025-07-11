import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        project: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Office Address',
      details: ['Flat No-102, Vishali Nagar', 'Hyderabad, Telangana, India', 'PIN: 500072'],
      color: 'text-primary'
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['+91 9876543210', '+91 9876543211', 'Toll Free: 1800-123-4567'],
      color: 'text-success'
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: ['info@aditiavenues.com', 'sales@aditiavenues.com', 'support@aditiavenues.com'],
      color: 'text-gold'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Saturday: 9:00 AM - 7:00 PM', 'Sunday: 10:00 AM - 5:00 PM', 'Site Visits: By Appointment'],
      color: 'text-muted-foreground'
    }
  ];

  const projects = ['Aditi Heights', 'Aditi Paradise', 'Aditi Grandeur', 'Aditi Serene'];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-primary">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative z-10 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">Let's Discuss Your Dream Home</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Get In Touch With Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to find your dream home? Our team is here to help you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-0">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className={`text-sm ${info.color}`}>{detail}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <Card className="p-8 text-center shadow-medium">
                  <CardContent className="p-0">
                    <div className="bg-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-success-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-success mb-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground">
                      Thank you for your inquiry. Our team will contact you within 24 hours.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="p-6 shadow-medium">
                  <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="project">Interested Project</Label>
                          <select
                            id="project"
                            name="project"
                            value={formData.project}
                            onChange={handleInputChange}
                            className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          >
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                              <option key={project} value={project}>{project}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your requirements..."
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <Button type="submit" variant="cta" className="w-full">
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">Visit Our Office</h2>
                
                {/* Google Map Placeholder */}
                <Card className="overflow-hidden shadow-medium">
                  <div className="h-64 bg-gradient-primary flex items-center justify-center">
                    <div className="text-center text-primary-foreground">
                      <MapPin className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-semibold">Interactive Map</p>
                      <p className="text-sm opacity-90">Google Maps integration will be placed here</p>
                    </div>
                  </div>
                </Card>

                <div className="mt-4 p-4 bg-background rounded-lg border">
                  <h4 className="font-semibold text-primary mb-2">Directions:</h4>
                  <p className="text-sm text-muted-foreground">
                    Our office is conveniently located in Vishali Nagar, easily accessible by metro and bus. 
                    Nearest metro station is just 5 minutes walk away.
                  </p>
                </div>
              </div>

              {/* Quick Contact Options */}
              <Card className="p-6 shadow-medium">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-primary mb-4">Quick Contact Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Call Us Now</p>
                        <p className="text-sm text-muted-foreground">Instant support available</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg">
                      <Mail className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-semibold text-sm">WhatsApp Chat</p>
                        <p className="text-sm text-muted-foreground">Quick responses guaranteed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gold/5 rounded-lg">
                      <MapPin className="h-5 w-5 text-gold" />
                      <div>
                        <p className="font-semibold text-sm">Site Visit</p>
                        <p className="text-sm text-muted-foreground">Schedule a guided tour</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Visit Our Projects?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Experience our projects firsthand. Schedule a site visit and see why families choose Aditi Avenues.
          </p>
          <Button variant="hero" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            Schedule Site Visit
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;