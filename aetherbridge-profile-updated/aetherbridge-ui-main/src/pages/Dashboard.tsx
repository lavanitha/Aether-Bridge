import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, BookOpen, Award, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DashboardData {
  academicPassport: {
    totalCredits: number;
    completedCourses: number;
    gpa: number;
    institutions: string[];
    skills: string[];
  };
  verifiedCredits: number;
  pathwaySuggestions: Array<{
    id: string;
    title: string;
    description: string;
    confidence: number;
    courses: string[];
  }>;
  recentActivity: Array<{
    id: string;
    type: 'course_completed' | 'credential_issued' | 'assessment_passed' | 'application_submitted';
    title: string;
    description: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => apiService.getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch blockchain status
  const { data: blockchainStatus } = useQuery({
    queryKey: ['blockchain-status'],
    queryFn: () => apiService.getBlockchainStatus(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
        <p className="text-muted-foreground mb-4">Please check your connection and try again.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_completed':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'credential_issued':
        return <Award className="h-4 w-4 text-purple-500" />;
      case 'assessment_passed':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'application_submitted':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.displayName || user?.email}</h1>
          <p className="text-muted-foreground mt-1">Here's your academic mobility overview</p>
        </div>
        <div className="flex items-center space-x-4">
          {blockchainStatus && (
            <Badge variant={blockchainStatus.status === 'connected' ? 'default' : 'destructive'}>
              Blockchain: {blockchainStatus.status}
            </Badge>
          )}
          <Button onClick={() => refetch()} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="passport">Academic Passport</TabsTrigger>
          <TabsTrigger value="pathways">Pathway Suggestions</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Credits</CardTitle>
                <BookOpen className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboardData.academicPassport.totalCredits}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardData.verifiedCredits} verified
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">GPA</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboardData.academicPassport.gpa.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.academicPassport.completedCourses} courses completed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Institutions</CardTitle>
                <Award className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboardData.academicPassport.institutions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Academic partnerships
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Skills</CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboardData.academicPassport.skills.length}</div>
                <p className="text-xs text-muted-foreground">
                  Verified competencies
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Access your most common tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Browse Courses</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Award className="h-6 w-6" />
                  <span>View Credentials</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Take Assessment</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Submit Application</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passport" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Academic Passport</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your comprehensive academic profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Overview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Credit Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {dashboardData.verifiedCredits} / {dashboardData.academicPassport.totalCredits}
                  </span>
                </div>
                <Progress 
                  value={(dashboardData.verifiedCredits / dashboardData.academicPassport.totalCredits) * 100} 
                  className="h-2"
                />
              </div>

              {/* Institutions */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Institutions Attended</h4>
                <div className="space-y-2">
                  {dashboardData.academicPassport.institutions.map((institution, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-black/10 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{institution.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white">{institution}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Verified Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {dashboardData.academicPassport.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pathways" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">AI-Powered Pathway Suggestions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Personalized recommendations based on your academic profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.pathwaySuggestions.map((pathway) => (
                  <div key={pathway.id} className="p-4 border border-purple-500/20 rounded-lg bg-black/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-white">{pathway.title}</h4>
                        <p className="text-sm text-muted-foreground">{pathway.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-300">
                        {pathway.confidence}% match
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Recommended courses:</p>
                      <div className="flex flex-wrap gap-1">
                        {pathway.courses.map((course, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="mt-3" size="sm">
                      Explore Pathway
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your latest academic achievements and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-purple-500/20 rounded-lg bg-black/10">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;