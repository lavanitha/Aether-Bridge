import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, Course } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Courses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search / filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');

  // Fetch courses
  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useQuery<Course[]>({
    queryKey: ["courses", { searchTerm, categoryFilter }],
    queryFn: () =>
      apiService.getCourses({
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user's enrolled courses
  const { data: enrolledCourses } = useQuery<Course[]>({
    queryKey: ['enrolled-courses'],
    queryFn: () => apiService.getEnrolledCourses(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => apiService.enrollInCourse(courseId),
    onSuccess: () => {
      toast({ title: "Success", description: "Successfully enrolled in course!" });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to enroll in course. Please try again.", variant: "destructive" });
    },
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
  const userEnrolledCourses = enrolledCourses ?? [];

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
    <div className="space-y-4">
      {/* Featured Section */}
      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h1 className="text-3xl font-bold mb-2 text-white">Featured Courses</h1>
        <p className="mb-4 text-lg text-gray-300">
          Explore a wide range of academic courses from leading institutions worldwide.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-slate-800 rounded-xl shadow overflow-hidden flex flex-col p-4">
              <h2 className="text-xl font-semibold mb-2 text-white">{course.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{course.institution}</p>
              <p className="text-sm text-gray-400 mb-2">{course.description}</p>
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <BookOpen className="h-4 w-4 mr-1" /> {course.credits} Credits
              </div>
              <Badge variant="outline" className="mb-3 border-gray-600 text-white">
                {course.category}
              </Badge>
              <button
                className="mt-auto py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium"
                onClick={() => enrollMutation.mutate(course.id)}
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h2 className="text-xl font-semibold mb-4 text-white">Browse Courses</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 rounded bg-slate-900 text-white"
              placeholder="Search courses..."
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          {/* Category filter placeholder */}
          {/* You could map categories from backend in future */}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-white">Title</th>
                <th className="py-2 px-4 text-left text-white">Institution</th>
                <th className="py-2 px-4 text-left text-white">Category</th>
                <th className="py-2 px-4 text-left text-white">Credits</th>
                <th className="py-2 px-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map((course) => (
                <tr key={course.id} className="border-t border-slate-700">
                  <td className="py-2 px-4 text-white font-medium">{course.title}</td>
                  <td className="py-2 px-4 text-gray-300">{course.institution}</td>
                  <td className="py-2 px-4">
                    <Badge variant="secondary" className="text-white bg-slate-700">
                      {course.category}
                    </Badge>
                  </td>
                  <td className="py-2 px-4 text-gray-300">{course.credits}</td>
                  <td className="py-2 px-4">
                    <Button size="sm" onClick={() => enrollMutation.mutate(course.id)}>
                      Enroll
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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