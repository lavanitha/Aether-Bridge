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

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => apiService.enrollInCourse(courseId),
    onSuccess: () => {
      toast({ title: "Enrolled", description: "You have been enrolled successfully." });
      // refetch course list or any other queries if needed
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to enroll in course.", variant: "destructive" });
    },
  });

  // Derived arrays
  const featuredCourses = courses?.filter((c) => c.isFeatured) || [];
  const allCourses = courses || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2 text-red-500">Unable to load courses</h3>
        <Button onClick={() => refetch()}>Retry</Button>
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
    </div>
  );
}