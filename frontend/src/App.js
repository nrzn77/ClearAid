import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Layout/Navbar';
import PostList from './components/Post/PostList';
import PostDetail from './components/Post/PostDetail';
import CreatePost from './components/Post/CreatePost';
import Login from './components/Auth/SignIn';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Auth/PrivateRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PostList />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/posts/new" element={<CreatePost />} />
              </Route>
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
