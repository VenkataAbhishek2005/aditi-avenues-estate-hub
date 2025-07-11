import { ArrowRight, CheckCircle, Star, Building, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import heroBuilding from '@/assets/hero-building.jpg';
import amenitiesHero from '@/assets/amenities-hero.jpg';
import interiorSample from '@/assets/interior-sample.jpg';

const Index = () => {
  const featuredProjects = [
    {
      id: 1,
      name: 'Aditi Heights',
      location: 'Kompally, Hyderabad',
      status: 'Ongoing',
      configurations: '2BHK, 3BHK, 4BHK',
      priceRange: '₹45L - ₹85L',
      possession: 'Dec 2025',
      image: interiorSample,
      amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Security']
    },
    {
      id: 2,
      name: 'Aditi Paradise',
      location: 'Miyapur, Hyderabad',
      status: 'Ready to Move',
      configurations: '1BHK, 2BHK, 3BHK',
      priceRange: '₹35L - ₹65L',
      possession: 'Immediate',
      image: amenitiesHero,
      amenities: ['Garden', 'Parking', 'Power Backup', 'Security']
    }
  ];

  const whyChooseUs = [
    {
      icon: Building,
      title: 'Quality Construction',
      description: 'Premium materials and expert craftsmanship in every project'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Complete transparency in pricing, timelines, and documentation'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'Committed to delivering projects as per scheduled timelines'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: '24/7 customer support and after-sales service'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      project: 'Aditi Paradise',
      rating: 5,
      comment: 'Exceptional quality and timely delivery. The team was very professional throughout the process.'
    },
    {
      name: 'Priya Sharma',
      project: 'Aditi Heights',
      rating: 5,
      comment: 'Amazing amenities and great location. Perfect for family living with all modern facilities.'
    },
    {
      name: 'Vikram Reddy',
      project: 'Aditi Paradise',
      rating: 5,
      comment: 'Transparent pricing and excellent customer service. Highly recommend Aditi Avenues.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBuilding})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative z-10 text-center text-primary-foreground max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Crafting Modern Living Spaces in Hyderabad
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
            Building dreams with trust, quality, and transparency. Discover premium residential projects that combine luxury with affordability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              View Projects <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/10 backdrop-blur border-primary-foreground/30 text-primary-foreground hover:bg-background/20">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              About Aditi Avenues
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              With over a decade of experience in real estate development, Aditi Avenues has been synonymous with quality, trust, and innovation in Hyderabad. We specialize in creating modern residential spaces that enhance the quality of life for our customers.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">RERA Approved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our premium residential projects designed for modern living
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-64">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Ready to Move' 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-warning text-warning-foreground'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{project.name}</h3>
                  <p className="text-muted-foreground mb-4">{project.location}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-semibold">Configurations:</span>
                      <p className="text-muted-foreground">{project.configurations}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Price Range:</span>
                      <p className="text-muted-foreground">{project.priceRange}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Possession:</span>
                      <p className="text-muted-foreground">{project.possession}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                    {project.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{project.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <Button variant="cta" className="w-full">
                    View Details <ArrowRight className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Aditi Avenues?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to excellence sets us apart in the real estate industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-0">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from our satisfied homeowners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.project}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Explore our premium projects and experience the Aditi Avenues difference. Contact us today for a site visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              Schedule Site Visit
            </Button>
            <Button variant="outline" size="lg" className="bg-background/10 backdrop-blur border-primary-foreground/30 text-primary-foreground hover:bg-background/20">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
