import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Calendar, Home, Download, ArrowRight, Filter, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import Layout from '@/components/Layout';
import heroBuilding from '@/assets/hero-building.jpg';
import amenitiesHero from '@/assets/amenities-hero.jpg';
import interiorSample from '@/assets/interior-sample.jpg';

interface Project {
  id: number;
  name: string;
  location: string;
  status: string;
  configurations: string[];
  areaRange: string;
  priceRange: string;
  possessionDate: string;
  reraId: string;
  description: string;
  highlights: string[];
  amenities: string[];
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
}

const Projects = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Fetch projects from API
  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => apiRequest('/api/projects'),
  });

  // Map API data to component format and add fallback images
  const projects = (projectsData || []).map((project: Project) => ({
    ...project,
    area: project.areaRange,
    possession: new Date(project.possessionDate).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    }),
    image: project.images?.[0] === 'hero-building.jpg' ? heroBuilding : 
           project.images?.[0] === 'amenities-hero.jpg' ? amenitiesHero : 
           project.images?.[0] === 'interior-sample.jpg' ? interiorSample : heroBuilding,
    status: project.status === 'ready_to_move' ? 'Ready to Move' : 
            project.status === 'ongoing' ? 'Ongoing' : 
            project.status === 'upcoming' ? 'Upcoming' : project.status
  }));

  const filterOptions = ['All', 'Ready to Move', 'Ongoing', 'Upcoming'];

  const filteredProjects = selectedFilter === 'All' 
    ? projects 
    : projects.filter(project => project.status === selectedFilter);

  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading projects. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </Layout>
    );
  }

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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="cta" className="flex-1" onClick={() => setSelectedProject(project)}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-primary">
                            {selectedProject?.name}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedProject && (
                          <div className="space-y-6">
                            {/* Project Image */}
                            <div className="relative h-64 rounded-lg overflow-hidden">
                              <img 
                                src={selectedProject.image} 
                                alt={selectedProject.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge 
                                  variant={selectedProject.status === 'Ready to Move' ? 'default' : 'secondary'}
                                  className={selectedProject.status === 'Ready to Move' ? 'bg-success' : 
                                           selectedProject.status === 'Ongoing' ? 'bg-warning' : 'bg-primary'}
                                >
                                  {selectedProject.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Project Info Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-lg mb-2">Location</h3>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{selectedProject.location}</span>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-lg mb-2">Configurations</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedProject.configurations?.map((config: string) => (
                                      <Badge key={config} variant="outline">
                                        {config}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-lg mb-2">Area Range</h3>
                                  <p className="text-muted-foreground">{selectedProject.area}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-lg mb-2">Price Range</h3>
                                  <p className="text-primary font-semibold text-xl">{selectedProject.priceRange}</p>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-lg mb-2">Possession</h3>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{selectedProject.possession}</span>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-lg mb-2">RERA ID</h3>
                                  <Badge variant="outline" className="bg-background/90">
                                    {selectedProject.reraId}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <h3 className="font-semibold text-lg mb-2">Description</h3>
                              <p className="text-muted-foreground leading-relaxed">{selectedProject.description}</p>
                            </div>

                            {/* Key Highlights */}
                            <div>
                              <h3 className="font-semibold text-lg mb-3">Key Highlights</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedProject.highlights?.map((highlight: string) => (
                                  <Badge key={highlight} variant="secondary">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Amenities */}
                            <div>
                              <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {selectedProject.amenities?.map((amenity: string) => (
                                  <Badge key={amenity} variant="outline" className="justify-center">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t">
                              <Button className="flex-1">
                                Schedule Site Visit
                              </Button>
                              <Button variant="outline" className="flex-1">
                                Contact Sales Team
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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