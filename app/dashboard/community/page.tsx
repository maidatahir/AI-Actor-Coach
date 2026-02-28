"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Play, 
  Star, 
  MessageSquare, 
  ThumbsUp,
  Send,
  Clock,
  Filter
} from "lucide-react"

const posts = [
  {
    id: 1,
    author: {
      name: "Sarah Mitchell",
      avatar: null,
      initials: "SM",
    },
    scene: "Hamlet - To Be or Not To Be",
    timeAgo: "2 hours ago",
    rating: 4.5,
    likes: 24,
    comments: [
      {
        author: { name: "James Lee", initials: "JL" },
        text: "Excellent emotional depth! The pauses were perfectly timed.",
        timeAgo: "1 hour ago",
      },
      {
        author: { name: "Maria Garcia", initials: "MG" },
        text: "I loved the way you conveyed the melancholy. Very authentic!",
        timeAgo: "45 min ago",
      },
    ],
  },
  {
    id: 2,
    author: {
      name: "Michael Chen",
      avatar: null,
      initials: "MC",
    },
    scene: "Romeo and Juliet - Balcony Scene",
    timeAgo: "5 hours ago",
    rating: 4.2,
    likes: 18,
    comments: [
      {
        author: { name: "Emma Wilson", initials: "EW" },
        text: "Beautiful delivery! The romantic emotion really came through.",
        timeAgo: "3 hours ago",
      },
    ],
  },
  {
    id: 3,
    author: {
      name: "Emily Rodriguez",
      avatar: null,
      initials: "ER",
    },
    scene: "A Streetcar Named Desire - Scene 4",
    timeAgo: "Yesterday",
    rating: 4.8,
    likes: 45,
    comments: [
      {
        author: { name: "David Brown", initials: "DB" },
        text: "One of the best performances I've seen on this platform!",
        timeAgo: "20 hours ago",
      },
      {
        author: { name: "Lisa Johnson", initials: "LJ" },
        text: "The desperation was palpable. Incredible work!",
        timeAgo: "18 hours ago",
      },
      {
        author: { name: "Robert Kim", initials: "RK" },
        text: "Your body language was spot on. Really impressive.",
        timeAgo: "12 hours ago",
      },
    ],
  },
]

export default function CommunityFeedbackPage() {
  const [newComment, setNewComment] = useState("")
  const [expandedPost, setExpandedPost] = useState<number | null>(null)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-500 fill-yellow-500"
            : i < rating
            ? "text-yellow-500 fill-yellow-500/50"
            : "text-muted"
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Feedback</h1>
          <p className="text-muted-foreground">Watch performances and share feedback with peers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            Share Your Performance
          </Button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {post.author.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{post.author.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {post.timeAgo}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">{renderStars(post.rating)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Preview */}
              <div className="relative aspect-video bg-sidebar rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-background/30 transition-colors">
                    <Play className="w-8 h-8 text-sidebar-foreground fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-background/80 backdrop-blur-sm text-foreground">
                    {post.scene}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  {post.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                >
                  <MessageSquare className="w-4 h-4" />
                  {post.comments.length} Comments
                </Button>
              </div>

              {/* Comments Section */}
              {expandedPost === post.id && (
                <div className="space-y-4 pt-4 border-t border-border">
                  {/* Existing Comments */}
                  {post.comments.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-muted">
                          {comment.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-xl p-3">
                          <p className="text-sm font-medium text-foreground">
                            {comment.author.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{comment.text}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-3">
                          {comment.timeAgo}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[40px] resize-none"
                        rows={1}
                      />
                      <Button size="icon" disabled={!newComment.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
