import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

// Shadcn UI components
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import debounce from 'lodash.debounce';

const PostListShadcn = React.memo(() => {
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
      setCurrentPage(0);
      setHasMore(false); // getAllPosts doesn't support pagination
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to fetch posts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Memoize the debounced search function
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      if (term.trim()) {
        performSearch(term, 0, 10);
      } else {
        fetchPosts();
      }
    }, 300),
    []
  );

  // Effect for search term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Search posts by title with pagination
  const performSearch = async (term, page = 0, size = 10) => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const response = await ApiService.searchPostsByTitle(term, page, size, {
        signal: controller.signal,
      });
      
      // Handle paginated response from backend
      const results = response.content || [];
      if (Array.isArray(results)) {
        setPosts(prev => page === 0 ? results : [...prev, ...results]);
        setHasMore(!response.last && results.length === size);
        setCurrentPage(page);
        setError(null);
      } else {
        setPosts([]);
        setHasMore(false);
        setCurrentPage(0);
        setError('No posts found.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to search posts. Please try again later.');
        setPosts([]);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };

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
        <label htmlFor="search-input" className="block text-sm font-medium mb-2">
          Search Posts
        </label>
        <div className="flex gap-2">
          <Input
            id="search-input"
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
            aria-describedby="search-help"
          />
          <span id="search-help" className="sr-only">
            Search for posts by entering keywords in the title
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 border-l-4 border-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No posts found.
        </div>
      ) : (
        <div>
          <h2 className="sr-only">Posts List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden" role="listitem">
              <CardHeader>
                <CardTitle className="text-lg">{post.title || 'Untitled'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3" aria-label="Post content">
                  {post.post
                    ? post.post.length > 150
                      ? `${post.post.substring(0, 150)}...`
                      : post.post
                    : 'No content available'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground" aria-label={`Author: ${post.authorName || 'Anonymous'}`}>
                  By: {post.authorName || 'Anonymous'}
                </span>
                <div className="flex space-x-2">
                  <Link 
                    to={`/posts/${post.id}`}
                    aria-label={`Read full post: ${post.title || 'Untitled'}`}
                  >
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
                    aria-label={isAuthenticated ? `Donate to post: ${post.title || 'Untitled'}` : 'Login required to donate'}
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
              <Button 
                variant="outline" 
                onClick={() => {
                  const nextPage = currentPage + 1;
                  setCurrentPage(nextPage);
                  if (searchTerm.trim()) {
                    performSearch(searchTerm, nextPage, 10);
                  } else {
                    // For regular posts, you'd need a paginated fetchPosts function
                    // Since the current fetchPosts doesn't support pagination,
                    // we'll keep the current behavior for now
                    fetchPosts();
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default PostListShadcn;
