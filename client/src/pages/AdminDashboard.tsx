import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Building2, 
  MessageSquare, 
  Settings,
  LogOut,
  Home,
  PlusCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been securely logged out",
    });
    navigate('/');
  };

  const stats = [
    {
      title: "Total Projects",
      value: "4",
      change: "+1 this month",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      title: "Inquiries",
      value: "23",
      change: "+5 this week",
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      title: "Gallery Images",
      value: "48",
      change: "+12 recently",
      icon: Eye,
      color: "text-purple-600"
    },
    {
      title: "Active Users",
      value: "156",
      change: "+8% growth",
      icon: Users,
      color: "text-red-600"
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Aditi Heights",
      status: "Ongoing",
      location: "Kompally",
      units: "120 units",
      badge: "In Progress"
    },
    {
      id: 2,
      name: "Aditi Paradise",
      status: "Ready to Move",
      location: "Miyapur", 
      units: "80 units",
      badge: "Completed"
    },
    {
      id: 3,
      name: "Aditi Grandeur",
      status: "Upcoming",
      location: "Kondapur",
      units: "200 units",
      badge: "Planning"
    }
  ];

  const recentInquiries = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@email.com",
      project: "Aditi Heights",
      date: "2024-01-15",
      status: "New"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@email.com",
      project: "Aditi Paradise",
      date: "2024-01-14", 
      status: "Contacted"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-gold p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Aditi Avenues Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                View Website
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Projects Management</CardTitle>
                    <CardDescription>Manage all your real estate projects</CardDescription>
                  </div>
                  <Button className="btn-primary">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.location} • {project.units}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={project.status === 'Ready to Move' ? 'default' : 'secondary'}>
                          {project.badge}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Customer Inquiries</CardTitle>
                <CardDescription>Manage customer inquiries and leads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                        <p className="text-xs text-gray-500">Interested in {inquiry.project}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={inquiry.status === 'New' ? 'destructive' : 'default'}>
                          {inquiry.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{inquiry.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gallery Management</CardTitle>
                    <CardDescription>Manage project images and media</CardDescription>
                  </div>
                  <Button className="btn-primary">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Gallery Management</h3>
                  <p className="text-gray-600">Upload and organize project images, virtual tours, and media files</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure website settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
                  <p className="text-gray-600">Manage site configuration, user permissions, and system preferences</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;