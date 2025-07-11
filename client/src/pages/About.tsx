import { Users, Award, Target, Eye, Building2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import interiorSample from '@/assets/interior-sample.jpg';

const About = () => {
  const teamMembers = [
    {
      name: 'Raj Reddy',
      position: 'Founder & CEO',
      experience: '15+ years',
      description: 'Visionary leader with extensive experience in real estate development'
    },
    {
      name: 'Priya Sharma',
      position: 'Head of Operations',
      experience: '12+ years',
      description: 'Expert in project management and quality assurance'
    },
    {
      name: 'Vikram Kumar',
      position: 'Chief Architect',
      experience: '10+ years',
      description: 'Award-winning architect specializing in modern residential design'
    }
  ];

  const milestones = [
    { year: '2012', event: 'Aditi Avenues Founded' },
    { year: '2015', event: 'First Major Project Completed' },
    { year: '2018', event: 'RERA Registration Achieved' },
    { year: '2020', event: '1000+ Happy Families' },
    { year: '2022', event: '25+ Projects Delivered' },
    { year: '2024', event: 'Expansion to New Locations' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'We never compromise on the quality of materials and construction standards'
    },
    {
      icon: CheckCircle,
      title: 'Transparency',
      description: 'Complete transparency in pricing, timelines, and project documentation'
    },
    {
      icon: Users,
      title: 'Customer Centric',
      description: 'Our customers are at the heart of everything we do'
    },
    {
      icon: Award,
      title: 'Trust & Reliability',
      description: 'Building lasting relationships through trust and reliable service'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative h-96 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${interiorSample})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative z-10 text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Aditi Avenues</h1>
          <p className="text-xl">Building Dreams Since 2012</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2012 with a vision to transform the real estate landscape in Hyderabad, 
                Aditi Avenues has emerged as a trusted name in residential development. Our journey 
                began with a simple belief - that everyone deserves a home that reflects their 
                aspirations and provides comfort for generations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">Mission</h3>
                <p className="text-muted-foreground mb-6">
                  To create exceptional residential spaces that enhance the quality of life for our 
                  customers while maintaining the highest standards of quality, transparency, and 
                  customer service.
                </p>

                <h3 className="text-2xl font-bold text-primary mb-4">Vision</h3>
                <p className="text-muted-foreground mb-6">
                  To be the most trusted real estate developer in Hyderabad, known for innovative 
                  designs, timely delivery, and creating communities that foster modern living.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">12+</div>
                  <div className="text-sm text-muted-foreground">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">25+</div>
                  <div className="text-sm text-muted-foreground">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Families</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">RERA Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-0">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the experienced professionals leading Aditi Avenues
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-0">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-gold font-semibold mb-2">{member.position}</p>
                  <p className="text-sm text-muted-foreground mb-3">{member.experience}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our growth story
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone, index) => (
                <Card key={index} className="p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;