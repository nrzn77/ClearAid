import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Shadcn UI components
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu.js';
import { ChevronDown } from 'lucide-react';

const RegisterShadcn = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'VOLUNTEER', // default role
    fullName: '',
    phone: '',
    interests: '',
    organizationName: '',
    registrationNumber: '',
    address: '',
    description: ''
  });
  const [error, setError] = useState('');
  const { register, login, loading } = useAuth(); // include login here
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const validateForm = () => {
    // Common fields validation
    if (!formData.username.trim() || !formData.email.trim() || 
        !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('All common fields are required');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Role-specific validation
    if (formData.role === 'VOLUNTEER' && !formData.fullName.trim()) {
      setError('Full name is required for volunteers');
      return false;
    }
    
    if (formData.role === 'NGO' && !formData.organizationName.trim()) {
      setError('Organization name is required for NGOs');
      return false;
    }

    // Ensure valid account type is selected
    if (!['VOLUNTEER', 'NGO'].includes(formData.role)) {
      setError('Invalid account type selected');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Construct payload based on role
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      // Add role-specific fields
      if (formData.role === 'VOLUNTEER') {
        payload.fullName = formData.fullName;
        payload.phone = formData.phone;
        payload.interests = formData.interests;
      } else if (formData.role === 'NGO') {
        payload.organizationName = formData.organizationName;
        payload.registrationNumber = formData.registrationNumber;
        payload.address = formData.address;
        payload.description = formData.description;
      }
      
      // Step 1: Register user
      await register(payload);

      // Step 2: Auto-login the newly registered user
      await login(formData.username, formData.password);

      // Step 3: Redirect directly to home/dashboard
      navigate('/', { replace: true });

    } catch (err) {
      setError('Registration failed. The username or email may already be in use.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">Fill in your details to register</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 border-l-4 border-destructive">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Account Type
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.role === 'VOLUNTEER' ? 'Volunteer' : 
                     formData.role === 'NGO' ? 'NGO' : 'Select account type'}
                    <span className="ml-2 h-4 w-4 shrink-0 opacity-50">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => handleRoleChange('VOLUNTEER')}>
                    Volunteer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleChange('NGO')}>
                    NGO
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Common Fields */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            {/* Volunteer-specific fields */}
            {formData.role === 'VOLUNTEER' && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Volunteer Information</h3>
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="interests" className="text-sm font-medium">
                    Interests
                  </label>
                  <Input
                    type="text"
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Education, Healthcare, Environment"
                  />
                </div>
              </div>
            )}
            
            {/* NGO-specific fields */}
            {formData.role === 'NGO' && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">NGO Information</h3>
                <div className="space-y-2">
                  <label htmlFor="organizationName" className="text-sm font-medium">
                    Organization Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="registrationNumber" className="text-sm font-medium">
                    Registration Number
                  </label>
                  <Input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Street, City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Brief description of your organization"
                  />
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterShadcn;
