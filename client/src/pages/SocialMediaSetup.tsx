import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Instagram, Music, Facebook } from "lucide-react";
import { toast } from "sonner";

export default function SocialMediaSetup() {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<"instagram" | "tiktok" | "facebook">("instagram");
  const [accountName, setAccountName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const connectAccountMutation = trpc.marketing.connectSocialAccount.useMutation();
  const getAccountsQuery = trpc.marketing.getSocialAccounts.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please log in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You need to be logged in to set up social media accounts.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleConnect = async () => {
    if (!accountName || !accessToken) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      await connectAccountMutation.mutateAsync({
        platform: selectedPlatform,
        accountName,
        accessToken,
        refreshToken: refreshToken || undefined,
      });

      toast.success(`${selectedPlatform} account connected!`);
      setAccountName("");
      setAccessToken("");
      setRefreshToken("");
      getAccountsQuery.refetch();
    } catch (error) {
      toast.error("Failed to connect account");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectedAccounts = getAccountsQuery.data || [];
  const isConnected = connectedAccounts.some((acc: any) => acc.platform === selectedPlatform);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Social Media Marketing</h1>
          <p className="text-muted-foreground">Connect your Instagram, TikTok, and Facebook accounts to manage posts and track metrics.</p>
        </div>

        <Tabs value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              TikTok
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook
            </TabsTrigger>
          </TabsList>

          {/* Instagram Tab */}
          <TabsContent value="instagram">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Business Account</CardTitle>
                <CardDescription>
                  Connect your Instagram account to post content and track engagement metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isConnected ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Instagram account connected: {connectedAccounts.find((a: any) => a.platform === "instagram")?.accountName}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Setup Instructions:</strong>
                        <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                          <li>Go to <a href="https://www.instagram.com/" target="_blank" className="text-blue-600 underline">Instagram.com</a></li>
                          <li>Create a business account or convert existing account to business</li>
                          <li>Go to <a href="https://developers.facebook.com/" target="_blank" className="text-blue-600 underline">Facebook Developers</a></li>
                          <li>Create an app and get your Access Token</li>
                          <li>Paste your credentials below</li>
                        </ol>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Account Username</label>
                        <Input
                          placeholder="@naild_nails"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Access Token *</label>
                        <Input
                          type="password"
                          placeholder="Paste your Instagram Graph API access token"
                          value={accessToken}
                          onChange={(e) => setAccessToken(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Get this from: Facebook Developers → Your App → Instagram Graph API
                        </p>
                      </div>

                      <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                        {isLoading ? "Connecting..." : "Connect Instagram"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TikTok Tab */}
          <TabsContent value="tiktok">
            <Card>
              <CardHeader>
                <CardTitle>TikTok Business Account</CardTitle>
                <CardDescription>
                  Connect your TikTok account to schedule posts and track video performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isConnected ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      TikTok account connected: {connectedAccounts.find((a: any) => a.platform === "tiktok")?.accountName}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Setup Instructions:</strong>
                        <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                          <li>Go to <a href="https://www.tiktok.com/signup" target="_blank" className="text-blue-600 underline">TikTok.com</a></li>
                          <li>Create a business account</li>
                          <li>Go to <a href="https://developer.tiktok.com/" target="_blank" className="text-blue-600 underline">TikTok Developer</a></li>
                          <li>Register as developer and create an app</li>
                          <li>Get your Client Key and Client Secret</li>
                          <li>Paste credentials below</li>
                        </ol>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Account Username</label>
                        <Input
                          placeholder="@naild_nails"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Client Key *</label>
                        <Input
                          type="password"
                          placeholder="Paste your TikTok Client Key"
                          value={accessToken}
                          onChange={(e) => setAccessToken(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Client Secret</label>
                        <Input
                          type="password"
                          placeholder="Paste your TikTok Client Secret"
                          value={refreshToken}
                          onChange={(e) => setRefreshToken(e.target.value)}
                        />
                      </div>

                      <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                        {isLoading ? "Connecting..." : "Connect TikTok"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facebook Tab */}
          <TabsContent value="facebook">
            <Card>
              <CardHeader>
                <CardTitle>Facebook Business Page</CardTitle>
                <CardDescription>
                  Connect your Facebook page to publish content and track page insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isConnected ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Facebook account connected: {connectedAccounts.find((a: any) => a.platform === "facebook")?.accountName}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Setup Instructions:</strong>
                        <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                          <li>Go to <a href="https://www.facebook.com/pages/create/" target="_blank" className="text-blue-600 underline">Facebook Pages</a></li>
                          <li>Create a new business page for "Nail'd"</li>
                          <li>Go to <a href="https://developers.facebook.com/" target="_blank" className="text-blue-600 underline">Facebook Developers</a></li>
                          <li>Create an app and get your Page Access Token</li>
                          <li>Paste credentials below</li>
                        </ol>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Page Name</label>
                        <Input
                          placeholder="Nail'd - Luxury Nail Art"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Page Access Token *</label>
                        <Input
                          type="password"
                          placeholder="Paste your Facebook Page Access Token"
                          value={accessToken}
                          onChange={(e) => setAccessToken(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Get this from: Facebook Developers → Your App → Messenger Platform
                        </p>
                      </div>

                      <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                        {isLoading ? "Connecting..." : "Connect Facebook"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Connected Accounts Summary */}
        {connectedAccounts.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connectedAccounts.map((account: any) => (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {account.platform === "instagram" && <Instagram className="h-5 w-5" />}
                      {account.platform === "tiktok" && <Music className="h-5 w-5" />}
                      {account.platform === "facebook" && <Facebook className="h-5 w-5" />}
                      <div>
                        <p className="font-medium capitalize">{account.platform}</p>
                        <p className="text-sm text-muted-foreground">{account.accountName}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
