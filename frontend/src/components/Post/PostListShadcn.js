import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

// Shadcn UI components
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import debounce from 'lodash.debounce';

const PostListShadcn = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch all posts (initial load)
  const fetchPosts = async (signal) => {
    try {
      setLoading(true);
      const data = await ApiService.getAllPosts({ signal });
      setPosts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to fetch posts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Search posts by title with pagination
  const performSearch = async (term, page = 0, size = 10) => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const results = await ApiService.searchPostsByTitle(term, page, size, {
        signal: controller.signal,
      });
      if (Array.isArray(results)) {
        setPosts(prev => page === 0 ? results : [...prev, ...results]);
        setHasMore(results.length === size);
        setError(null);
      } else {
        setPosts([]);
        setHasMore(false);
        setError('No posts found.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to search posts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        if (term.trim()) {
          performSearch(term, 0, 10); // Reset to page 0 on new search
        } else {
          fetchPosts();
        }
      }, 500), // waits 500ms after typing stops
    []
  );

  // Trigger search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Initial load
  useEffect(() => {
    const controller = new AbortController();
    fetchPosts(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Posts</h2>

      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 border-l-4 border-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-lg text-muted-foreground">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No posts found.
        </div>
      ) : (
        <div>
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
                <div className="flex space-x-2">
                  <Link to={`/posts/${post.id}`}>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </Link>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                      } else {
                        navigate(`/donate/${post.id}`);
                      }
                    }}
                  >
                    Donate
                  </Button>
                </div>
              </CardFooter>
            </Card>
            ))}
          </div>
          {hasMore && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => {
                setCurrentPage(prev => prev + 1);
                performSearch(searchTerm, currentPage + 1, 10);
              }}>
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostListShadcn;
