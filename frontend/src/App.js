import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './App.css';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { ThemeToggle } from './components/ui/theme-toggle';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const NavbarShadcn = lazy(() => import('./components/Layout/NavbarShadcn'));
const PostList = lazy(() => import('./components/Post/PostListShadcn'));
const PostDetail = lazy(() => import('./components/Post/PostDetailShadcn'));
const CreatePost = lazy(() => import('./components/Post/CreatePostShadcn'));
const Login = lazy(() => import('./components/Auth/SignInShadcn'));
const Register = lazy(() => import('./components/Auth/RegisterShadcn'));
const PrivateRoute = lazy(() => import('./components/Auth/PrivateRoute'));
const AdminRoute = lazy(() => import('./components/Auth/AdminRoute'));
const PendingPosts = lazy(() => import('./components/Post/PendingPostsShadcn'));

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastProvider>
        <Router>
          <AuthProvider>
            {/* Skip to main content link for accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
            >
              Skip to main content
            </a>
            
            <div className="App">
              <Suspense fallback={<div className="flex justify-center items-center min-h-16"><LoadingSpinner size="sm" /></div>}>
                <NavbarShadcn />
              </Suspense>

              <main className="main-content" id="main-content" role="main">
                <Suspense fallback={<div className="flex justify-center items-center p-8"><LoadingSpinner /></div>}>
                  <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PostList />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/posts/new" element={<CreatePost />} />
                  </Route>
  <Route element={<PrivateRoute />}>
    <Route path="/posts/:id" element={<PostDetail />} />
  </Route>
  <Route element={<AdminRoute />}>
    <Route path="/posts/pending" element={<PendingPosts />} />
  </Route>
                  
                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                </Suspense>
              </main>
            </div>
            <ToastContainer />
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
