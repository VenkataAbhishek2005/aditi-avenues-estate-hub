import { useState } from 'react';
import { Grid, List, Filter, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import heroBuilding from '@/assets/hero-building.jpg';
import amenitiesHero from '@/assets/amenities-hero.jpg';
import interiorSample from '@/assets/interior-sample.jpg';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'

  const galleryItems = [
    {
      id: 1,
      title: 'Aditi Heights Exterior',
      category: 'Exterior',
      project: 'Aditi Heights',
      image: heroBuilding,
      description: 'Modern architectural design with premium finishes'
    },
    {
      id: 2,
      title: 'Swimming Pool & Recreation',
      category: 'Amenities',
      project: 'Aditi Paradise',
      image: amenitiesHero,
      description: 'Resort-style swimming pool with recreational facilities'
    },
    {
      id: 3,
      title: 'Premium Interior Design',
      category: 'Interiors',
      project: 'Aditi Grandeur',
      image: interiorSample,
      description: 'Elegant interior spaces with modern furnishing'
    },
    {
      id: 4,
      title: 'Landscaped Gardens',
      category: 'Amenities',
      project: 'Aditi Heights',
      image: heroBuilding,
      description: 'Beautiful landscaped gardens and walkways'
    },
    {
      id: 5,
      title: 'Construction Progress',
      category: 'Construction',
      project: 'Aditi Serene',
      image: amenitiesHero,
      description: 'Latest construction updates and progress photos'
    },
    {
      id: 6,
      title: 'Clubhouse Interior',
      category: 'Amenities',
      project: 'Aditi Paradise',
      image: interiorSample,
      description: 'Spacious clubhouse with modern amenities'
    },
    {
      id: 7,
      title: 'Master Bedroom',
      category: 'Interiors',
      project: 'Aditi Heights',
      image: heroBuilding,
      description: 'Luxurious master bedroom with premium finishes'
    },
    {
      id: 8,
      title: 'Building Facade',
      category: 'Exterior',
      project: 'Aditi Grandeur',
      image: amenitiesHero,
      description: 'Stunning building facade with modern architecture'
    }
  ];

  const categories = ['All', 'Exterior', 'Interiors', 'Amenities', 'Construction', 'Lifestyle'];

  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-primary">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative z-10 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Gallery</h1>
          <p className="text-xl">Explore Our Projects Through Images</p>
        </div>
      </section>

      {/* Filter and View Controls */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Filter:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View:</span>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'masonry' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('masonry')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className={`gap-6 ${
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 space-y-6'
          }`}>
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={`group overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer ${
                  viewMode === 'masonry' ? 'break-inside-avoid' : ''
                }`}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      viewMode === 'grid' ? 'h-64' : 'h-auto'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur">
                      {item.project}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Grid className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Images Found</h3>
              <p className="text-muted-foreground">No images match the selected category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Experience Virtual Tours
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't visit in person? Take a virtual tour of our projects from the comfort of your home. 
              Get a 360-degree view of our premium residential spaces.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 shadow-medium">
                <div className="h-48 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <ZoomIn className="h-16 w-16 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Aditi Heights Virtual Tour</h3>
                <p className="text-muted-foreground mb-4">
                  Explore our ongoing project with interactive 360° views of apartments and amenities.
                </p>
                <Button variant="cta" className="w-full">
                  Start Virtual Tour
                </Button>
              </Card>

              <Card className="p-6 shadow-medium">
                <div className="h-48 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <ZoomIn className="h-16 w-16 text-gold-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Aditi Paradise Virtual Tour</h3>
                <p className="text-muted-foreground mb-4">
                  Take a virtual walk through our ready-to-move project with detailed room views.
                </p>
                <Button variant="cta" className="w-full">
                  Start Virtual Tour
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Download Brochures */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want More Details?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Download detailed brochures with floor plans, pricing, and complete project information.
          </p>
          <Button variant="hero" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            Download Brochures
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;