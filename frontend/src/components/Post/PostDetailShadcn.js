import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';

const PostDetailShadcn = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getPostById(id);
        setPost(data ?? {});  // ensure post is never undefined
        setError(null);
      } catch (err) {
        setError('Failed to fetch post. It may have been removed or you may not have permission to view it.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center p-8 text-lg text-muted-foreground">Loading post...</div>;
  if (error) return <div className="container mx-auto px-4 py-8"><div className="bg-destructive/15 text-destructive p-4 rounded-md border-l-4 border-destructive">{error}</div></div>;
  if (!post) return <div className="container mx-auto px-4 py-8 text-center text-lg text-muted-foreground">Post not found</div>;

  const isAuthor = currentUser && currentUser.id === post.authorId;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <span>←</span> Back to Posts
          </Button>
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{post.title || 'Untitled'}</CardTitle>
          <CardDescription className="flex justify-between items-center text-sm text-muted-foreground">
            <span>By: {post.authorName || 'Anonymous'}</span>
            <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          {(post.content ?? '').split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph || 'No content available'}</p>
          ))}
        </CardContent>

        {isAuthor && (
          <CardFooter>
            <Link to={`/posts/${post.id}/edit`}>
              <Button variant="outline">Edit Post</Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PostDetailShadcn;
