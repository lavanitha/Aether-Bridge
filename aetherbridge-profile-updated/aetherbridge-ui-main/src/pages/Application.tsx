import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Application as ApplicationType } from '@/lib/api';
import { Upload, FileText, Clock, CheckCircle, XCircle, AlertCircle, Download, Eye } from 'lucide-react';

const Application = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('submit');
  const [formData, setFormData] = useState({
    targetInstitution: '',
    targetProgram: '',
    transcripts: [] as File[],
    additionalNotes: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch existing applications
  const { data: applications, isLoading: loadingApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: () => apiService.getApplications(),
  });

  // Submit application mutation
  const submitMutation = useMutation({
    mutationFn: (data: typeof formData) => apiService.submitApplication(data),
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully. You'll receive updates via email.",
      });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setFormData({
        targetInstitution: '',
        targetProgram: '',
        transcripts: [],
        additionalNotes: '',
      });
      setActiveTab('track');
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, JPEG, or PNG files only.",
          variant: "destructive",
        });
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
      }
      
      return isValidType && isValidSize;
    });
    
    setFormData(prev => ({
      ...prev,
      transcripts: [...prev.transcripts, ...validFiles],
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      transcripts: prev.transcripts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.targetInstitution || !formData.targetProgram || formData.transcripts.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload at least one transcript.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(formData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300">Pending Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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

  const programs = [
    'Computer Science',
    'Data Science',
    'Artificial Intelligence',
    'Business Administration',
    'Engineering',
    'Medicine',
    'Law',
    'Arts & Humanities',
    'Social Sciences',
    'Natural Sciences',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Credit Equivalency Application</h1>
        <p className="text-muted-foreground mt-1">
          Submit your transcripts for credit equivalency evaluation and transfer
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit">Submit Application</TabsTrigger>
          <TabsTrigger value="track">Track Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">New Application</CardTitle>
              <CardDescription className="text-muted-foreground">
                Upload your transcripts and provide target institution details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Target Institution */}
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-white">Target Institution *</Label>
                  <Select
                    value={formData.targetInstitution}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, targetInstitution: value }))}
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

                {/* Target Program */}
                <div className="space-y-2">
                  <Label htmlFor="program" className="text-white">Target Program *</Label>
                  <Select
                    value={formData.targetProgram}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, targetProgram: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transcript Upload */}
                <div className="space-y-2">
                  <Label className="text-white">Transcripts *</Label>
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your academic transcripts (PDF, JPEG, PNG)
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Maximum file size: 10MB per file
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="transcript-upload"
                    />
                    <Label htmlFor="transcript-upload" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        Choose Files
                      </Button>
                    </Label>
                  </div>
                  
                  {/* File List */}
                  {formData.transcripts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white">Selected Files:</p>
                      {formData.transcripts.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-black/10 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-white">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information you'd like to include..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="track" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Application Status</CardTitle>
              <CardDescription className="text-muted-foreground">
                Track the progress of your submitted applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingApplications ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="p-4 border border-purple-500/20 rounded-lg bg-black/10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(application.status)}
                          <div>
                            <h4 className="font-medium text-white">
                              {application.targetInstitution} - {application.targetProgram}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>

                      {application.adminComments && (
                        <Alert className="mb-3">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            {application.adminComments}
                          </AlertDescription>
                        </Alert>
                      )}

                      {application.equivalencyResults && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-white">Equivalency Results:</p>
                          <div className="space-y-1">
                            {application.equivalencyResults.map((result: any, index: number) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {result.sourceCourse} → {result.targetCourse} ({result.confidenceScore}% match)
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-white">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Submit your first application to get started with credit equivalency evaluation.
                  </p>
                  <Button onClick={() => setActiveTab('submit')}>
                    Submit Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Application; 