import { useState } from 'react';
import { 
  Waves, 
  Dumbbell, 
  Building, 
  Shield, 
  Car, 
  TreePine, 
  Users, 
  Zap, 
  Droplets,
  Music,
  Camera,
  Gamepad2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import amenitiesHero from '@/assets/amenities-hero.jpg';

const Amenities = () => {
  const amenitiesList = [
    {
      icon: Waves,
      title: 'Swimming Pool',
      description: 'Resort-style swimming pool with separate kids pool and poolside deck',
      category: 'Recreation'
    },
    {
      icon: Dumbbell,
      title: 'Fitness Center',
      description: 'Fully equipped gymnasium with modern cardio and strength training equipment',
      category: 'Health & Fitness'
    },
    {
      icon: Building,
      title: 'Clubhouse',
      description: 'Multi-purpose clubhouse with event halls and recreational facilities',
      category: 'Community'
    },
    {
      icon: Shield,
      title: '24/7 Security',
      description: 'Round-the-clock security with CCTV surveillance and trained personnel',
      category: 'Safety'
    },
    {
      icon: TreePine,
      title: 'Landscaped Gardens',
      description: 'Beautifully designed gardens with walking paths and seating areas',
      category: 'Outdoor'
    },
    {
      icon: Users,
      title: 'Children\'s Play Area',
      description: 'Safe and fun play area designed specifically for children of all ages',
      category: 'Family'
    },
    {
      icon: Car,
      title: 'Covered Parking',
      description: 'Dedicated covered parking spaces for residents and visitors',
      category: 'Convenience'
    },
    {
      icon: Zap,
      title: 'Power Backup',
      description: '100% power backup for common areas and emergency lighting',
      category: 'Utilities'
    },
    {
      icon: Droplets,
      title: 'Rainwater Harvesting',
      description: 'Eco-friendly rainwater harvesting system for sustainable living',
      category: 'Sustainability'
    },
    {
      icon: Music,
      title: 'Multipurpose Hall',
      description: 'Spacious hall for events, celebrations, and community gatherings',
      category: 'Community'
    },
    {
      icon: Camera,
      title: 'CCTV Surveillance',
      description: 'Comprehensive CCTV coverage for enhanced security and peace of mind',
      category: 'Safety'
    },
    {
      icon: Gamepad2,
      title: 'Indoor Games',
      description: 'Indoor recreation area with table tennis, carrom, and other games',
      category: 'Recreation'
    }
  ];

  const categories = ['All', 'Recreation', 'Health & Fitness', 'Community', 'Safety', 'Outdoor', 'Family', 'Convenience', 'Utilities', 'Sustainability'];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAmenities = selectedCategory === 'All' 
    ? amenitiesList 
    : amenitiesList.filter(amenity => amenity.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative h-96 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${amenitiesHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative z-10 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Premium Amenities</h1>
          <p className="text-xl">Enhancing Your Lifestyle</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              World-Class Amenities for Modern Living
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Aditi Avenues, we believe that a home is more than just four walls. Our thoughtfully 
              designed amenities create a lifestyle that balances comfort, convenience, and community. 
              From fitness and recreation to safety and sustainability, every amenity is crafted to 
              enhance your quality of life.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
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
      </section>

      {/* Amenities Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAmenities.map((amenity, index) => (
              <Card key={index} className="p-6 text-center shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <amenity.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{amenity.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{amenity.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {amenity.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAmenities.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Amenities Found</h3>
              <p className="text-muted-foreground">No amenities match the selected category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Amenities */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Signature Amenities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our standout features that make Aditi Avenues projects truly special
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-medium">
              <div className="h-48 bg-gradient-primary flex items-center justify-center">
                <Waves className="h-16 w-16 text-primary-foreground" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Resort-Style Pool</h3>
                <p className="text-muted-foreground text-sm">
                  Experience luxury with our resort-style swimming pool featuring a separate kids area, 
                  poolside lounge, and professional lifeguard services.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-medium">
              <div className="h-48 bg-gradient-gold flex items-center justify-center">
                <Dumbbell className="h-16 w-16 text-gold-foreground" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">State-of-Art Gym</h3>
                <p className="text-muted-foreground text-sm">
                  Stay fit with our fully equipped fitness center featuring the latest cardio equipment, 
                  strength training machines, and professional trainers.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-medium">
              <div className="h-48 bg-gradient-primary flex items-center justify-center">
                <TreePine className="h-16 w-16 text-primary-foreground" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Zen Gardens</h3>
                <p className="text-muted-foreground text-sm">
                  Relax and rejuvenate in our beautifully landscaped gardens with meditation areas, 
                  walking paths, and serene water features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience These Amenities Yourself
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Visit our projects to see these world-class amenities in person. Book a site visit today.
          </p>
          <Button variant="hero" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            Schedule Site Visit
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Amenities;