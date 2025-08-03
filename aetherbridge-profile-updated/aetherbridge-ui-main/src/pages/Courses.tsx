import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Clock, Users, Award, Star, Globe, CheckCircle, Search, Filter, Play, Download, Share2, Bookmark } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  institution: string;
  category: string;
  credits: number;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  rating: number;
  enrollmentCount: number;
  isFeatured: boolean;
  isEnrolled: boolean;
  progress?: number;
  equivalencyMetadata?: any;
  syllabus: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  instructors: Array<{
    name: string;
    title: string;
    institution: string;
    bio: string;
  }>;
  startDate: string;
  endDate: string;
  certificate: boolean;
  blockchain: boolean;
}

const Courses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch courses
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['courses', { searchTerm, selectedCategory, selectedLevel, selectedInstitution, sortBy }],
    queryFn: () => apiService.getCourses({
      search: searchTerm,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      level: selectedLevel !== 'all' ? selectedLevel : undefined,
      institution: selectedInstitution !== 'all' ? selectedInstitution : undefined,
      sortBy
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user's enrolled courses
  const { data: enrolledCourses } = useQuery<Course[]>({
    queryKey: ['enrolled-courses'],
    queryFn: () => apiService.getEnrolledCourses(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Enroll in course mutation
  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => apiService.enrollInCourse(courseId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully enrolled in course!",
      });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter and sort courses
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.institution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesInstitution = selectedInstitution === 'all' || course.institution === selectedInstitution;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesInstitution;
  }) || [];

  const featuredCourses = filteredCourses.filter(course => course.isFeatured);
  const allCourses = filteredCourses;
  const userEnrolledCourses = enrolledCourses || [];

  const categories = ['all', ...Array.from(new Set(courses?.map(c => c.category) || []))];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];
  const institutions = ['all', ...Array.from(new Set(courses?.map(c => c.institution) || []))];

  const handleEnroll = (courseId: string) => {
    enrollMutation.mutate(courseId);
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Error loading courses</h3>
        <p className="text-muted-foreground mb-4">Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Academic Courses</h1>
          <p className="text-muted-foreground mt-1">Explore global academic courses and find your perfect learning path</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-500/20 text-green-300">
            {allCourses.length} Courses Available
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
              <SelectTrigger>
                <SelectValue placeholder="Institution" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map((institution) => (
                  <SelectItem key={institution} value={institution}>
                    {institution === 'all' ? 'All Institutions' : institution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="enrollment">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-6">
          {/* Featured Courses Section */}
          {featuredCourses.length > 0 && (
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Featured Courses
                </CardTitle>
                <p className="text-muted-foreground">Handpicked courses from top institutions</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredCourses.slice(0, 6).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Courses Grid */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">All Courses</CardTitle>
              <p className="text-muted-foreground">Browse our complete course catalog</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Featured Courses</CardTitle>
              <p className="text-muted-foreground">Our most popular and highly-rated courses</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">My Enrolled Courses</CardTitle>
              <p className="text-muted-foreground">Continue your learning journey</p>
            </CardHeader>
            <CardContent>
              {userEnrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No enrolled courses</h3>
                  <p className="text-muted-foreground mb-4">Start exploring courses to begin your learning journey</p>
                  <Button onClick={() => setActiveTab('all')}>Browse Courses</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userEnrolledCourses.map((course) => (
                    <EnrolledCourseCard
                      key={course.id}
                      course={course}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recommended for You</CardTitle>
              <p className="text-muted-foreground">AI-powered course recommendations based on your profile</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.slice(0, 6).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Course Detail Dialog */}
      {selectedCourse && (
        <CourseDetailDialog
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={handleEnroll}
        />
      )}
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, onEnroll, onClick }: { course: Course; onEnroll: (id: string) => void; onClick: () => void }) => {
  return (
    <Card className="bg-black/10 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
              {course.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{course.institution}</p>
          </div>
          <Badge variant={course.isFeatured ? "default" : "secondary"} className="ml-2">
            {course.isFeatured ? "Featured" : course.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.credits} credits
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.enrollmentCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            {course.rating}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
            {course.blockchain && (
              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300">
                Blockchain
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClick}>
              Details
            </Button>
            {!course.isEnrolled ? (
              <Button size="sm" onClick={() => onEnroll(course.id)}>
                Enroll
              </Button>
            ) : (
              <Button size="sm" variant="secondary" disabled>
                Enrolled
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enrolled Course Card Component
const EnrolledCourseCard = ({ course, onClick }: { course: Course; onClick: () => void }) => {
  return (
    <Card className="bg-black/10 border-green-500/20 hover:border-green-500/40 transition-all cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{course.institution}</p>
          </div>
          <Badge variant="outline" className="bg-green-500/20 text-green-300">
            Enrolled
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-white">{course.progress || 0}%</span>
          </div>
          <Progress value={course.progress || 0} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {course.credits} credits
            </span>
          </div>
          <Button size="sm" onClick={onClick}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Course Detail Dialog Component
const CourseDetailDialog = ({ course, onClose, onEnroll }: { course: Course; onClose: () => void; onEnroll: (id: string) => void }) => {
  return (
    <Dialog open={!!course} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">{course.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {course.institution} • {course.category}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Course Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Course Overview</h3>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-white">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits:</span>
                  <span className="text-white">{course.credits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="text-white capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="text-white flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    {course.rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enrolled:</span>
                  <span className="text-white">{course.enrollmentCount} students</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Instructors</h3>
              <div className="space-y-3">
                {course.instructors.map((instructor, index) => (
                  <div key={index} className="p-3 bg-black/20 rounded-lg">
                    <h4 className="font-medium text-white">{instructor.name}</h4>
                    <p className="text-sm text-muted-foreground">{instructor.title}</p>
                    <p className="text-sm text-muted-foreground">{instructor.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Syllabus */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Syllabus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.syllabus.map((topic, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-black/20 rounded">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-muted-foreground">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Learning Outcomes</h3>
            <div className="space-y-2">
              {course.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {course.prerequisites.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Prerequisites</h3>
              <div className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span className="text-muted-foreground">{prereq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {course.isEnrolled ? (
                <Button size="lg" variant="secondary" disabled>
                  Already Enrolled
                </Button>
              ) : (
                <Button size="lg" onClick={() => onEnroll(course.id)}>
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Courses;