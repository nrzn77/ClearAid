import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import NavbarShadcn from './components/Layout/NavbarShadcn';
import PostList from './components/Post/PostListShadcn';
import PostDetail from './components/Post/PostDetailShadcn';
import CreatePost from './components/Post/CreatePostShadcn';
import Login from './components/Auth/SignInShadcn';
import Register from './components/Auth/RegisterShadcn';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { ThemeToggle } from './components/ui/theme-toggle';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <div className="App">
            <NavbarShadcn />
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PostList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/posts/new" element={<CreatePost />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/posts/:id" element={<PostDetail />} />
                </Route>
                
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
