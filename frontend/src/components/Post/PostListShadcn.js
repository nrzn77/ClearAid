import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';

// Shadcn UI components
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

const PostListShadcn = () => {
  const [posts, setPosts] = useState([]);       // default empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllPosts();
      setPosts(Array.isArray(data) ? data : []); // ensure posts is always an array
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchPosts();
      return;
    }

    try {
      setLoading(true);
      const results = await ApiService.searchPostsByTitle(searchTerm);
      setPosts(Array.isArray(results) ? results : []);
      setError(null);
    } catch (err) {
      setError('Failed to search posts. Please try again later.');
      console.error('Error searching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Posts</h2>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 border-l-4 border-destructive">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">No posts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{post.title || 'Untitled'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {post.post
                    ? post.post.length > 150
                      ? `${post.post.substring(0, 150)}...`
                      : post.post
                    : 'No content available'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  By: {post.authorName || 'Anonymous'}
                </span>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline" size="sm">Read More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostListShadcn;
