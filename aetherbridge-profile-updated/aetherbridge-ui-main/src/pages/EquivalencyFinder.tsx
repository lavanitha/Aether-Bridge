import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiService, EquivalencyResult } from '@/lib/api';
import { Search, ArrowRight, CheckCircle, XCircle, AlertTriangle, BookOpen, Target, Brain, Download } from 'lucide-react';

const EquivalencyFinder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [searchData, setSearchData] = useState({
    sourceCourses: [] as string[],
    targetInstitution: '',
  });
  const [results, setResults] = useState<EquivalencyResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Equivalency Analysis Mutation
  const equivalencyMutation = useMutation({
    mutationFn: (data: { sourceCourses: string[]; targetInstitution: string }) =>
      apiService.findEquivalencies(data.sourceCourses, data.targetInstitution),
    onSuccess: (data) => {
      setResults(data);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: `Found ${data.length} potential equivalencies for your courses.`,
      });
    },
    onError: (error) => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze course equivalencies. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddCourse = () => {
    const courseInput = document.getElementById('course-input') as HTMLInputElement;
    const course = courseInput?.value.trim();
    
    if (course && !searchData.sourceCourses.includes(course)) {
      setSearchData(prev => ({
        ...prev,
        sourceCourses: [...prev.sourceCourses, course],
      }));
      courseInput.value = '';
    } else if (searchData.sourceCourses.includes(course)) {
      toast({
        title: "Course Already Added",
        description: "This course is already in your list.",
        variant: "destructive",
      });
    }
  };

  const removeCourse = (index: number) => {
    setSearchData(prev => ({
      ...prev,
      sourceCourses: prev.sourceCourses.filter((_, i) => i !== index),
    }));
  };

  const handleAnalyze = () => {
    if (searchData.sourceCourses.length === 0 || !searchData.targetInstitution) {
      toast({
        title: "Missing Information",
        description: "Please add at least one course and select a target institution.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    equivalencyMutation.mutate(searchData);
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'equivalent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'not_equivalent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'equivalent':
        return <Badge className="bg-green-500/20 text-green-300">Equivalent</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500/20 text-yellow-300">Partial Match</Badge>;
      case 'not_equivalent':
        return <Badge className="bg-red-500/20 text-red-300">Not Equivalent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const institutions = [
    'Harvard University',
    'Stanford University',
    'MIT',
    'University of Oxford',
    'University of Cambridge',
    'UC Berkeley',
    'University of Toronto',
    'University of Melbourne',
    'National University of Singapore',
    'University of Tokyo',
  ];

  const sampleCourses = [
    'Introduction to Computer Science',
    'Data Structures and Algorithms',
    'Calculus I',
    'Linear Algebra',
    'Probability and Statistics',
    'Machine Learning Fundamentals',
    'Database Systems',
    'Software Engineering',
    'Artificial Intelligence',
    'Computer Networks',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI-Powered Equivalency Finder</h1>
        <p className="text-muted-foreground mt-1">
          Use artificial intelligence to find course equivalencies across institutions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Find Equivalencies</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <span>Course Equivalency Analysis</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Add your courses and select a target institution for AI-powered equivalency analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Institution Selection */}
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-white">Target Institution *</Label>
                <Select
                  value={searchData.targetInstitution}
                  onValueChange={(value) => setSearchData(prev => ({ ...prev, targetInstitution: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution} value={institution}>
                        {institution}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course Input */}
              <div className="space-y-2">
                <Label htmlFor="course-input" className="text-white">Add Your Courses</Label>
                <div className="flex space-x-2">
                  <Input
                    id="course-input"
                    placeholder="Enter course name (e.g., Introduction to Computer Science)"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCourse()}
                  />
                  <Button onClick={handleAddCourse} variant="outline">
                    Add Course
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Enter or click Add Course to add to your list
                </p>
              </div>

              {/* Sample Courses */}
              <div className="space-y-2">
                <Label className="text-white">Quick Add Sample Courses</Label>
                <div className="flex flex-wrap gap-2">
                  {sampleCourses.slice(0, 5).map((course) => (
                    <Button
                      key={course}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!searchData.sourceCourses.includes(course)) {
                          setSearchData(prev => ({
                            ...prev,
                            sourceCourses: [...prev.sourceCourses, course],
                          }));
                        }
                      }}
                      disabled={searchData.sourceCourses.includes(course)}
                    >
                      {course}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Courses */}
              {searchData.sourceCourses.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white">Your Courses ({searchData.sourceCourses.length})</Label>
                  <div className="space-y-2">
                    {searchData.sourceCourses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-black/10 rounded-lg border border-purple-500/20">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-white">{course}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourse(index)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || searchData.sourceCourses.length === 0 || !searchData.targetInstitution}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Equivalencies
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {isAnalyzing ? (
            <Card className="bg-black/20 border-purple-500/20">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI Analysis in Progress</h3>
                    <p className="text-muted-foreground">
                      Our AI is analyzing your courses against {searchData.targetInstitution}'s curriculum...
                    </p>
                  </div>
                  <Progress value={65} className="w-full max-w-md mx-auto" />
                </div>
              </CardContent>
            </Card>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Analysis Summary</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Results for {searchData.sourceCourses.length} courses at {searchData.targetInstitution}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">
                        {results.filter(r => r.verdict === 'equivalent').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Equivalent</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="text-2xl font-bold text-yellow-400">
                        {results.filter(r => r.verdict === 'partial').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Partial Match</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">
                        {results.filter(r => r.verdict === 'not_equivalent').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Not Equivalent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card key={index} className="bg-black/20 border-purple-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getVerdictIcon(result.verdict)}
                          <div>
                            <h4 className="font-medium text-white">{result.sourceCourse}</h4>
                            <p className="text-sm text-muted-foreground">Source Course</p>
                          </div>
                        </div>
                        {getVerdictBadge(result.verdict)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        {/* Source Course */}
                        <div className="p-4 bg-black/10 rounded-lg border border-purple-500/20">
                          <h5 className="font-medium text-white mb-2">Source Course</h5>
                          <p className="text-sm text-muted-foreground">{result.sourceCourse}</p>
                        </div>

                        {/* Target Course */}
                        <div className="p-4 bg-black/10 rounded-lg border border-purple-500/20">
                          <h5 className="font-medium text-white mb-2">Target Course</h5>
                          <p className="text-sm text-muted-foreground">{result.targetCourse}</p>
                        </div>
                      </div>

                      {/* Confidence Score */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">AI Confidence Score</span>
                          <span className={`text-sm font-bold ${getConfidenceColor(result.confidenceScore)}`}>
                            {result.confidenceScore}%
                          </span>
                        </div>
                        <Progress value={result.confidenceScore} className="h-2" />
                      </div>

                      {/* Reasoning */}
                      <div className="mb-4">
                        <h5 className="font-medium text-white mb-2">AI Reasoning</h5>
                        <p className="text-sm text-muted-foreground bg-black/10 p-3 rounded-lg">
                          {result.reasoning}
                        </p>
                      </div>

                      {/* Bridging Courses */}
                      {result.suggestedBridgingCourses && result.suggestedBridgingCourses.length > 0 && (
                        <div>
                          <h5 className="font-medium text-white mb-2">Suggested Bridging Courses</h5>
                          <div className="flex flex-wrap gap-2">
                            {result.suggestedBridgingCourses.map((course, idx) => (
                              <Badge key={idx} variant="outline" className="bg-blue-500/20 text-blue-300">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button className="flex-1">
                  <Target className="h-4 w-4 mr-2" />
                  Apply for Transfer
                </Button>
              </div>
            </div>
          ) : (
            <Card className="bg-black/20 border-purple-500/20">
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">No Analysis Results</h3>
                <p className="text-muted-foreground mb-4">
                  Run an equivalency analysis to see results here.
                </p>
                <Button onClick={() => setActiveTab('search')}>
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquivalencyFinder; 