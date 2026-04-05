import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Image, Sparkles, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MarketingDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [platforms, setPlatforms] = useState<("instagram" | "tiktok" | "facebook")[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("create");

  const createPostMutation = trpc.marketing.createPost.useMutation();
  const getPostsQuery = trpc.marketing.getPosts.useQuery({ page: 1, limit: 20 });
  const getAnalyticsQuery = trpc.marketing.getAnalytics.useQuery({ days: 30 });
  const publishPostMutation = trpc.marketing.publishPost.useMutation();
  const generateCaptionMutation = trpc.marketing.generateCaption.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please log in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You need to be logged in to access the marketing dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreatePost = async () => {
    if (!title || !content || platforms.length === 0) {
      toast.error("Please fill in title, content, and select at least one platform");
      return;
    }

    setIsLoading(true);
    try {
      await createPostMutation.mutateAsync({
        title,
        content,
        caption: caption || undefined,
        hashtags: hashtags ? hashtags.split(",").map((h) => h.trim()) : undefined,
        imageUrl: imageUrl || undefined,
        platforms,
        scheduledAt,
      });

      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setCaption("");
      setHashtags("");
      setImageUrl("");
      setPlatforms([]);
      setScheduledAt(undefined);
      getPostsQuery.refetch();
    } catch (error) {
      toast.error("Failed to create post");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCaption = async () => {
    if (!content) {
      toast.error("Please enter content first");
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateCaptionMutation.mutateAsync({ content });
      setCaption(result.caption);
      setHashtags(result.hashtags.join(", "));
      toast.success("Caption generated!");
    } catch (error) {
      toast.error("Failed to generate caption");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishPost = async (postId: number) => {
    try {
      await publishPostMutation.mutateAsync({ postId });
      toast.success("Post published!");
      getPostsQuery.refetch();
    } catch (error) {
      toast.error("Failed to publish post");
      console.error(error);
    }
  };

  const posts = getPostsQuery.data?.posts || [];
  const analytics = getAnalyticsQuery.data;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Create, schedule, and track your social media content across Instagram, TikTok, and Facebook.</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Create Post Tab */}
          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Post Creation Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                    <CardDescription>Write your content and schedule it for later</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Post Title</label>
                      <Input
                        placeholder="e.g., Summer Collection Launch"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <Textarea
                        placeholder="Write your post content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Platforms</label>
                      <div className="space-y-2">
                        {(["instagram", "tiktok", "facebook"] as const).map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={platform}
                              checked={platforms.includes(platform)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPlatforms([...platforms, platform]);
                                } else {
                                  setPlatforms(platforms.filter((p) => p !== platform));
                                }
                              }}
                            />
                            <label htmlFor={platform} className="text-sm capitalize cursor-pointer">
                              {platform}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Schedule (Optional)</label>
                      <Input
                        type="datetime-local"
                        onChange={(e) => setScheduledAt(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </div>

                    <Button onClick={handleCreatePost} disabled={isLoading} className="w-full">
                      {isLoading ? "Creating..." : "Create Post"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* AI Caption Generator */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Caption Generator
                    </CardTitle>
                    <CardDescription>Auto-generate captions and hashtags</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleGenerateCaption}
                      disabled={isLoading || !content}
                      variant="outline"
                      className="w-full"
                    >
                      Generate Caption
                    </Button>

                    {caption && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">Generated Caption</label>
                          <Textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows={4}
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Generated Hashtags</label>
                          <Textarea
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                            rows={3}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Posts Tab */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>My Posts</CardTitle>
                <CardDescription>Manage your social media content</CardDescription>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No posts yet. Create your first post!</p>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post: any) => (
                      <div key={post.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                          </div>
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : post.status === "scheduled"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {post.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(post.platforms || "[]").map((platform: string) => (
                            <Badge key={platform} variant="outline" className="capitalize">
                              {platform}
                            </Badge>
                          ))}
                        </div>

                        {post.scheduledAt && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(new Date(post.scheduledAt), "MMM dd, yyyy HH:mm")}
                          </div>
                        )}

                        {post.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={() => handlePublishPost(post.id)}
                            disabled={isLoading}
                          >
                            Publish Now
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalPosts || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.publishedPosts || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalEngagement || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalReach || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics?.byPlatform &&
                Object.entries(analytics.byPlatform).map(([platform, stats]: any) => (
                  <Card key={platform}>
                    <CardHeader>
                      <CardTitle className="capitalize">{platform}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Likes</span>
                        <span className="font-semibold">{stats.likes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Comments</span>
                        <span className="font-semibold">{stats.comments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shares</span>
                        <span className="font-semibold">{stats.shares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Views</span>
                        <span className="font-semibold">{stats.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reach</span>
                        <span className="font-semibold">{stats.reachCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
