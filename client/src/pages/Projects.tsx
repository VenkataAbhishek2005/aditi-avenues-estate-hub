import { useState } from 'react';
import { MapPin, Calendar, Home, Download, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import heroBuilding from '@/assets/hero-building.jpg';
import amenitiesHero from '@/assets/amenities-hero.jpg';
import interiorSample from '@/assets/interior-sample.jpg';

const Projects = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const projects = [
    {
      id: 1,
      name: 'Aditi Heights',
      location: 'Kompally, Hyderabad',
      status: 'Ongoing',
      configurations: ['2BHK', '3BHK', '4BHK'],
      area: '1200-2400 sq ft',
      priceRange: '₹45L - ₹85L',
      possession: 'Dec 2025',
      reraId: 'P02400004321',
      image: heroBuilding,
      amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Security', 'Garden', 'Parking'],
      description: 'Modern residential complex with premium amenities and strategic location.',
      highlights: ['RERA Approved', 'Near IT Hub', 'Metro Connectivity', 'Premium Location']
    },
    {
      id: 2,
      name: 'Aditi Paradise',
      location: 'Miyapur, Hyderabad',
      status: 'Ready to Move',
      configurations: ['1BHK', '2BHK', '3BHK'],
      area: '850-1800 sq ft',
      priceRange: '₹35L - ₹65L',
      possession: 'Immediate',
      reraId: 'P02400004322',
      image: amenitiesHero,
      amenities: ['Garden', 'Parking', 'Power Backup', 'Security', 'Playground'],
      description: 'Ready to move homes with excellent connectivity and modern amenities.',
      highlights: ['Ready to Move', 'Metro Station', 'Schools Nearby', 'Hospital Access']
    },
    {
      id: 3,
      name: 'Aditi Grandeur',
      location: 'Kondapur, Hyderabad',
      status: 'Upcoming',
      configurations: ['2BHK', '3BHK', '4BHK', '5BHK'],
      area: '1400-3000 sq ft',
      priceRange: '₹65L - ₹1.2Cr',
      possession: 'Jun 2026',
      reraId: 'P02400004323',
      image: interiorSample,
      amenities: ['Rooftop Pool', 'Spa', 'Gym', 'Clubhouse', 'Theatre', 'Garden'],
      description: 'Luxury residential project with world-class amenities and premium location.',
      highlights: ['Luxury Living', 'Premium Location', 'World-class Amenities', 'High-end Finishes']
    },
    {
      id: 4,
      name: 'Aditi Serene',
      location: 'Gachibowli, Hyderabad',
      status: 'Ongoing',
      configurations: ['2BHK', '3BHK'],
      area: '1100-1900 sq ft',
      priceRange: '₹55L - ₹95L',
      possession: 'Mar 2026',
      reraId: 'P02400004324',
      image: heroBuilding,
      amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Security', 'Garden'],
      description: 'Peaceful residential community in the heart of IT corridor.',
      highlights: ['IT Corridor', 'Peaceful Environment', 'Modern Design', 'Investment Opportunity']
    }
  ];

  const filterOptions = ['All', 'Ready to Move', 'Ongoing', 'Upcoming'];

  const filteredProjects = selectedFilter === 'All' 
    ? projects 
    : projects.filter(project => project.status === selectedFilter);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-primary">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative z-10 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Projects</h1>
          <p className="text-xl">Discover Your Perfect Home</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Filter by Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option}
                  variant={selectedFilter === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300">
                <div className="relative h-64">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={project.status === 'Ready to Move' ? 'default' : 'secondary'}
                      className={project.status === 'Ready to Move' ? 'bg-success' : 
                               project.status === 'Ongoing' ? 'bg-warning' : 'bg-primary'}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur">
                      RERA: {project.reraId}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-2">{project.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{project.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="font-semibold text-sm">Configurations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.configurations.map((config) => (
                          <Badge key={config} variant="outline" className="text-xs">
                            {config}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-sm">Area:</span>
                      <p className="text-muted-foreground text-sm">{project.area}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-sm">Price Range:</span>
                      <p className="text-primary font-semibold text-sm">{project.priceRange}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-sm">Possession:</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <p className="text-muted-foreground text-sm">{project.possession}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="font-semibold text-sm mb-2 block">Key Highlights:</span>
                    <div className="flex flex-wrap gap-1">
                      {project.highlights.map((highlight) => (
                        <Badge key={highlight} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="font-semibold text-sm mb-2 block">Amenities:</span>
                    <div className="flex flex-wrap gap-1">
                      {project.amenities.slice(0, 4).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {project.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="cta" className="flex-1">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">No projects match the selected filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Interested in Any of Our Projects?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Schedule a site visit or get detailed information about any project. Our team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              Schedule Site Visit
            </Button>
            <Button variant="outline" size="lg" className="bg-background/10 backdrop-blur border-primary-foreground/30 text-primary-foreground hover:bg-background/20">
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;