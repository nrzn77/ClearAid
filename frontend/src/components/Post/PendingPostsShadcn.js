import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

const PendingPostsShadcn = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8097/api/posts/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pending posts');
        setLoading(false);
      }
    };

    fetchPendingPosts();
  }, [token]);

  const handleApprove = async (postId) => {
    try {
await axios.put(`http://localhost:8097/api/posts/${postId}/approve?approved=true`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to approve post:', err);
    }
  };

  const handleReject = async (postId) => {
    try {
await axios.delete(`http://localhost:8097/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to reject post:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pending-posts">
      <h2 className="text-2xl font-bold mb-4">Pending Posts</h2>
      {posts.length === 0 ? (
        <p>No pending posts to review.</p>
      ) : (
        posts.map(post => (
          <Card key={post.id} className="mb-4">
            <CardContent>
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="mt-2">{post.post}</p>
              <p className="mt-2 font-medium">Requested Amount: ${post.money}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                onClick={() => handleApprove(post.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button 
                onClick={() => handleReject(post.id)}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Reject
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default PendingPostsShadcn;
