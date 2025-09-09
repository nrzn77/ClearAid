import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Shadcn UI components
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const CreatePostShadcn = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    money: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token, currentUser } = useAuth(); // get both token and currentUser from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || formData.money < 0) {
      setError('Title, content, and valid reward amount are required');
      return;
    }

    if (!token) {
      setError('You must be logged in to create a post');
      return;
    }


    console.log('Current User:', currentUser);
    console.log('Current User Role:', currentUser?.role);
     if (!currentUser || currentUser.role !== 'ADMIN') {
      setError('Only administrators can create posts');
      return;
    }

    const postData = {
      title: formData.title,
      post: formData.content,
      money: formData.money
    };

    try {
      setLoading(true);
      setError(null);

      await ApiService.createPost(postData, token);
      navigate('/');
    } catch (err) {
      if (err.message === 'Only admins can create posts') {
        setError('You do not have permission to create posts. Only administrators can create posts.');
      } else {
        setError('Failed to create post. Please try again.');
      }
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 border-l-4 border-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                required
              />

              </div>
            <div className="space-y-2">
              <label htmlFor="money" className="text-sm font-medium">
                Reward Amount (in USD)
              </label>
              <Input
                type="number"
                id="money"
                name="money"
                value={formData.money}
                onChange={handleChange}
                disabled={loading}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
                disabled={loading}
                required
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </div>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate('/')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostShadcn;
