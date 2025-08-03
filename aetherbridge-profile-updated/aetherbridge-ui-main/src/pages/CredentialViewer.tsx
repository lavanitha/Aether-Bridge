import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Credential } from '@/lib/api';
import { 
  Award, 
  Shield, 
  ExternalLink, 
  Copy, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles,
  Link,
  FileText,
  Calendar,
  Building,
  User,
  Search
} from 'lucide-react';

const CredentialViewer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('my-credentials');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [publicLookupId, setPublicLookupId] = useState('');

  // Fetch user credentials
  const { data: credentials, isLoading: loadingCredentials } = useQuery({
    queryKey: ['credentials'],
    queryFn: () => apiService.getCredentials(),
  });

  // Verify credential mutation
  const verifyMutation = useMutation({
    mutationFn: (credentialId: string) => apiService.verifyCredential(credentialId),
    onSuccess: (data) => {
      toast({
        title: "Verification Complete",
        description: data.verified ? "Credential verified successfully!" : "Credential verification failed.",
        variant: data.verified ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Failed to verify credential. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mint NFT mutation
  const mintMutation = useMutation({
    mutationFn: (credentialId: string) => apiService.mintCredentialAsNFT(credentialId),
    onSuccess: (data) => {
      toast({
        title: "NFT Minted Successfully",
        description: `Credential minted as NFT with token ID: ${data.tokenId}`,
      });
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
    onError: () => {
      toast({
        title: "NFT Minting Failed",
        description: "Failed to mint credential as NFT. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Public lookup mutation
  const lookupMutation = useMutation({
    mutationFn: (credentialId: string) => apiService.lookupCredential(credentialId),
    onSuccess: (data) => {
      setSelectedCredential(data);
    },
    onError: () => {
      toast({
        title: "Lookup Failed",
        description: "Credential not found or access denied.",
        variant: "destructive",
      });
    },
  });

  const handleVerify = (credentialId: string) => {
    verifyMutation.mutate(credentialId);
  };

  const handleMintNFT = (credentialId: string) => {
    mintMutation.mutate(credentialId);
  };

  const handlePublicLookup = () => {
    if (!publicLookupId.trim()) {
      toast({
        title: "Missing Credential ID",
        description: "Please enter a credential ID to lookup.",
        variant: "destructive",
      });
      return;
    }
    lookupMutation.mutate(publicLookupId);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'revoked':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-300">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300">Pending</Badge>;
      case 'revoked':
        return <Badge className="bg-red-500/20 text-red-300">Revoked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredCredentials = credentials?.filter(credential =>
    credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    credential.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Credential Viewer</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your blockchain-verified academic credentials
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-credentials">My Credentials</TabsTrigger>
          <TabsTrigger value="public-lookup">Public Lookup</TabsTrigger>
          <TabsTrigger value="verifier-mode">Verifier Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="my-credentials" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-400" />
                <span>My Credentials</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your blockchain-verified academic credentials and certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search" className="text-white">Search Credentials</Label>
                <Input
                  id="search"
                  placeholder="Search by title or issuer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-2"
                />
              </div>

              {loadingCredentials ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : filteredCredentials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCredentials.map((credential) => (
                    <Card key={credential.id} className="bg-black/10 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(credential.status)}
                            <div>
                              <CardTitle className="text-sm text-white">{credential.title}</CardTitle>
                              <CardDescription className="text-xs text-muted-foreground">
                                {credential.issuer}
                              </CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(credential.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>Issued: {new Date(credential.issueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-3 w-3" />
                            <span>Type: {credential.type}</span>
                          </div>
                          {credential.nftTokenId && (
                            <div className="flex items-center space-x-2">
                              <Sparkles className="h-3 w-3" />
                              <span>NFT: #{credential.nftTokenId}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black/90 border-purple-500/20">
                              <DialogHeader>
                                <DialogTitle className="text-white">Credential Details</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Complete credential information and blockchain verification
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Title:</span>
                                    <p className="text-white font-medium">{credential.title}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Issuer:</span>
                                    <p className="text-white font-medium">{credential.issuer}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Type:</span>
                                    <p className="text-white font-medium">{credential.type}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Status:</span>
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(credential.status)}
                                      <span className="text-white font-medium">{credential.status}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <span className="text-muted-foreground text-sm">Blockchain Hash:</span>
                                  <div className="flex items-center space-x-2 p-2 bg-black/20 rounded">
                                    <code className="text-xs text-purple-300 flex-1">{credential.blockchainHash}</code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(credential.blockchainHash, 'Blockchain hash')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <span className="text-muted-foreground text-sm">Transaction Hash:</span>
                                  <div className="flex items-center space-x-2 p-2 bg-black/20 rounded">
                                    <code className="text-xs text-purple-300 flex-1">{credential.transactionHash}</code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(credential.transactionHash, 'Transaction hash')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => handleVerify(credential.id)}
                                    disabled={verifyMutation.isPending}
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verify
                                  </Button>
                                  {!credential.nftTokenId && (
                                    <Button
                                      onClick={() => handleMintNFT(credential.id)}
                                      disabled={mintMutation.isPending}
                                      className="flex-1"
                                    >
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      Mint NFT
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-white">No Credentials Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'No credentials match your search.' : 'You haven\'t earned any credentials yet.'}
                  </p>
                  {searchQuery && (
                    <Button onClick={() => setSearchQuery('')} variant="outline">
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public-lookup" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Search className="h-5 w-5 text-purple-400" />
                <span>Public Credential Lookup</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Look up credentials by ID or DID for verification purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter credential ID or DID..."
                    value={publicLookupId}
                    onChange={(e) => setPublicLookupId(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handlePublicLookup} disabled={lookupMutation.isPending}>
                    {lookupMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1" />
                        Lookup
                      </>
                    )}
                  </Button>
                </div>

                {selectedCredential && (
                  <Card className="bg-black/10 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">{selectedCredential.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {selectedCredential.issuer}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="text-white font-medium">{selectedCredential.type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(selectedCredential.status)}
                              <span className="text-white font-medium">{selectedCredential.status}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-muted-foreground text-sm">Blockchain Hash:</span>
                          <div className="p-2 bg-black/20 rounded">
                            <code className="text-xs text-purple-300">{selectedCredential.blockchainHash}</code>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-muted-foreground text-sm">Transaction Hash:</span>
                          <div className="p-2 bg-black/20 rounded">
                            <code className="text-xs text-purple-300">{selectedCredential.transactionHash}</code>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifier-mode" className="space-y-6">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span>Verifier Mode</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                For institutions and employers to verify credential authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This mode allows you to verify credentials without accessing personal information. 
                  Only credential authenticity and blockchain verification status are displayed.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter credential ID for verification..."
                    className="flex-1"
                  />
                  <Button>
                    <Shield className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a credential ID to verify its authenticity on the blockchain.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CredentialViewer; 