# ClearAid Backend Documentation

## 🏗️ Architecture Overview

ClearAid is a **Spring Boot REST API** application that serves as a crowdfunding and volunteering platform. The backend follows a **layered architecture** with JWT-based authentication and role-based access control.

### Technology Stack
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with JWT
- **Database**: JPA/Hibernate with relational database
- **Documentation**: Swagger/OpenAPI 3
- **Build Tool**: Maven

---

## 🔐 Authentication & Security

### JWT Token System
The application uses **JSON Web Tokens (JWT)** for stateless authentication:

```java
// JWT Structure
{
  "sub": "username",
  "userId": 123,
  "iat": 1694764800,
  "exp": 1694851200
}
```

### Security Configuration
- **Stateless Sessions**: No server-side session storage
- **CORS Disabled**: For API-first approach
- **CSRF Disabled**: Not needed for stateless JWT
- **Public Endpoints**: Authentication routes and GET requests to posts
- **Protected Endpoints**: All other operations require authentication

### User Roles
```java
public enum Users {
    ADMIN,     // Full access - can approve posts, manage all content
    NGO,       // Can create posts for fundraising
    VOLUNTEER  // Can view and donate to posts
}
```

---

## 📊 Database Schema

### User Entity
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'NGO', 'VOLUNTEER') DEFAULT 'VOLUNTEER'
);
```

### Post Entity
```sql
CREATE TABLE posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    auth_id BIGINT NOT NULL,           -- Foreign key to users.id
    title VARCHAR(255) NOT NULL,
    post TEXT,                         -- Post content
    money DOUBLE,                      -- Fundraising goal amount
    approved BOOLEAN DEFAULT FALSE,    -- Admin approval status
    FOREIGN KEY (auth_id) REFERENCES users(id)
);
```

---

## 🛡️ Security Flow

### 1. Authentication Filter Chain
```
Request → AuthTokenFilter → Controller
    ↓
Parse JWT → Validate Token → Set Security Context
```

### 2. Authorization Rules
- **Public Access**: `/api/auth/**`, `/api/posts/**` (GET only)
- **Authenticated Access**: All POST, PUT, DELETE operations
- **Role-Based Access**: Post creation limited to ADMIN and NGO roles

### 3. JWT Validation Process
```java
1. Extract "Authorization: Bearer <token>" header
2. Parse and validate JWT signature
3. Extract username and userId from token
4. Load user details from database
5. Set authentication in SecurityContext
```

---

## 🚀 API Endpoints

### Authentication APIs

#### 1. User Registration
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}

Response: "User registered successfully!"
```

#### 2. User Login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}

Response: "eyJhbGciOiJIUzI1NiJ9..." (JWT Token)
```

### Post Management APIs

#### 3. Create Post
```http
POST /api/posts
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Help Build School in Rural Area",
  "post": "We need funds to build a school...",
  "money": 5000.0
}

Response: {
  "id": 1,
  "authId": 123,
  "title": "Help Build School in Rural Area",
  "post": "We need funds to build a school...",
  "money": 5000.0,
  "approved": false
}
```

**Access Control**: Only ADMIN and NGO roles can create posts

#### 4. Get All Posts
```http
GET /api/posts

Response: [
  {
    "id": 1,
    "authId": 123,
    "title": "Help Build School",
    "post": "Content...",
    "money": 5000.0,
    "approved": true
  }
]
```

**Note**: Returns only approved posts for public access

#### 5. Get Post by ID
```http
GET /api/posts/{id}

Response: {
  "id": 1,
  "authId": 123,
  "title": "Help Build School",
  "post": "Full content...",
  "money": 5000.0,
  "approved": true
}
```

#### 6. Update Post
```http
PUT /api/posts/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "post": "Updated content...",
  "money": 6000.0
}
```

**Access Control**: Only post owner or ADMIN can update

#### 7. Delete Post
```http
DELETE /api/posts/{id}
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

**Access Control**: Only post owner or ADMIN can delete

#### 8. Search Posts
```http
GET /api/posts/search?keyword=school&page=0&size=10

Response: {
  "content": [...],
  "pageable": {...},
  "totalElements": 25,
  "totalPages": 3,
  "last": false,
  "first": true
}
```

**Features**: 
- Full-text search in post titles
- Case-insensitive search
- Pagination support
- Only searches approved posts

#### 9. Get Posts by Author
```http
GET /api/posts/author/{authId}

Response: [
  {
    "id": 1,
    "authId": 123,
    "title": "My Post",
    "approved": true
  }
]
```

#### 10. Get Pending Posts (Admin Only)
```http
GET /api/posts/pending
Authorization: Bearer <jwt_token>

Response: [
  {
    "id": 2,
    "title": "Pending Post",
    "approved": false
  }
]
```

**Access Control**: ADMIN role only

#### 11. Approve/Reject Post (Admin Only)
```http
PUT /api/posts/{id}/approve?approved=true
Authorization: Bearer <jwt_token>

Response: {
  "id": 2,
  "approved": true
}
```

**Access Control**: ADMIN role only

### Test APIs

#### 12. Public Test Endpoint
```http
GET /api/test/all

Response: "Public Content."
```

#### 13. Authenticated Test Endpoint
```http
GET /api/test/user
Authorization: Bearer <jwt_token>

Response: "username has access to 123"
```

---

## 🔄 Application Flow

### 1. User Registration & Login Flow
```
1. User registers via /api/auth/signup
   ↓
2. User details stored in database with default VOLUNTEER role
   ↓
3. User logs in via /api/auth/signin
   ↓
4. JWT token generated and returned
   ↓
5. Client stores token for subsequent requests
```

### 2. Post Creation Flow (NGO/Admin)
```
1. NGO/Admin sends POST /api/posts with JWT token
   ↓
2. AuthTokenFilter validates token
   ↓
3. PostController checks user role (ADMIN/NGO only)
   ↓
4. Post created with approved=false
   ↓
5. Admin approval required before public visibility
```

### 3. Post Approval Flow (Admin)
```
1. Admin gets pending posts via /api/posts/pending
   ↓
2. Admin reviews post content
   ↓
3. Admin approves via /api/posts/{id}/approve?approved=true
   ↓
4. Post becomes visible in public listings
```

### 4. Search & Discovery Flow
```
1. User searches via /api/posts/search?keyword=education
   ↓
2. System searches approved posts only
   ↓
3. Results returned with pagination
   ↓
4. User can view detailed post via /api/posts/{id}
```

---

## 🛠️ Service Layer Architecture

### PostService
- **Responsibility**: Business logic for post operations
- **Key Methods**:
  - `savePost()`: Create/update posts
  - `getApprovedPosts()`: Public post listings
  - `searchPostsByTitle()`: Search functionality
  - `getPendingPosts()`: Admin moderation queue

### CustomUserDetailsService
- **Responsibility**: User authentication integration
- **Integration**: Works with Spring Security for JWT validation

### JwtUtil
- **Responsibility**: JWT token management
- **Key Methods**:
  - `generateToken()`: Create JWT tokens
  - `validateJwtToken()`: Verify token integrity
  - `getUserIdFromToken()`: Extract user information

---

## 🔒 Security Features

### 1. Input Validation
- Username uniqueness enforcement
- Password encryption using BCrypt
- JWT token signature validation

### 2. Authorization Controls
- Role-based post creation (ADMIN/NGO only)
- Ownership-based edit/delete permissions
- Admin-only approval operations

### 3. Data Protection
- Stateless authentication (no session hijacking)
- Encrypted password storage
- Token expiration management

### 4. API Security
- CORS configuration for frontend integration
- Request filtering for protected endpoints
- Proper HTTP status codes for security events

---

## 📝 Error Handling

### Common HTTP Status Codes
- **200 OK**: Successful operations
- **201 Created**: Successful post creation
- **204 No Content**: Successful deletion
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing/invalid JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist

### Security Error Responses
```json
{
  "timestamp": "2024-09-15T10:30:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Only admins and NGOs can create posts",
  "path": "/api/posts"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- Database (H2/MySQL/PostgreSQL)

### Configuration
```properties
# application.properties
jwt.secret=your-secret-key
jwt.expiration=86400000
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=update
```

### Running the Application
```bash
mvn spring-boot:run
```

### API Documentation
Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

---

## 🎨 Frontend Architecture & Backend Integration

### Frontend Technology Stack
- **Framework**: React 18 with hooks
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Theme**: Dark/Light mode support

### Frontend Components Structure
```
src/
├── components/
│   ├── Auth/
│   │   ├── SignInShadcn.js
│   │   ├── RegisterShadcn.js
│   │   ├── PrivateRoute.js
│   │   └── AdminRoute.js
│   ├── Layout/
│   │   └── NavbarShadcn.js
│   ├── Post/
│   │   ├── PostListShadcn.js
│   │   ├── PostDetailShadcn.js
│   │   ├── CreatePostShadcn.js
│   │   └── PendingPostsShadcn.js
│   └── ui/ (shadcn components)
├── contexts/
│   └── AuthContext.js
├── services/
│   └── api.js
└── App.js
```

---

## 🔄 Frontend-Backend Integration Flow

### 1. Authentication Flow
```
Frontend (React)                    Backend (Spring Boot)
       │                                    │
   [Login Form] ─────POST /api/auth/signin──────► [AuthController]
       │                                    │
   [Username, Password]                     ├─► [AuthManager]
       │                                    │
       │ ◄────JWT Token Response────────────┤
       │                                    │
   [AuthContext]                            │
       │                                    │
   [Store in localStorage]                  │
       │                                    │
   [Set Authorization header]               │
       │                                    │
   [Protected API Calls] ─────────────────► [AuthTokenFilter]
       │                                    │
       │                                    ├─► [JWT Validation]
       │                                    │
       │ ◄────Authorized Response───────────┤
```

### 2. Authentication Context Implementation
```javascript
// AuthContext.js - Central authentication state
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Auto-login from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Login function
  const login = async (username, password) => {
    const response = await ApiService.login({ username, password });
    
    // Decode JWT to extract user info
    const decodedToken = parseJwt(response.token);
    const userData = { 
      username, 
      role: decodedToken?.role || 'VOLUNTEER',
      userId: decodedToken?.userId 
    };
    
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setToken(response.token);
    setCurrentUser(userData);
  };
};
```

### 3. API Service Layer
```javascript
// api.js - HTTP client with automatic JWT handling
const API_BASE_URL = 'http://localhost:8097/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const ApiService = {
  // Public endpoints (no auth required)
  getAllPosts: async () => {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return await response.json();
  },
  
  // Protected endpoints (auth required)
  createPost: async (postData, token) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    return await response.json();
  }
};
```

### 4. Route Protection System
```javascript
// App.js - Route structure
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<PostList />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected Routes - Requires Authentication */}
  <Route element={<PrivateRoute />}>
    <Route path="/posts/new" element={<CreatePost />} />
    <Route path="/posts/:id" element={<PostDetail />} />
  </Route>
  
  {/* Admin Only Routes */}
  <Route element={<AdminRoute />}>
    <Route path="/posts/pending" element={<PendingPosts />} />
  </Route>
</Routes>

// PrivateRoute.js - Authentication guard
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// AdminRoute.js - Admin role guard
const AdminRoute = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  return isAuthenticated && currentUser?.role === 'ADMIN' 
    ? <Outlet /> 
    : <Navigate to="/" />;
};
```

---

## 🚀 Complete User Journey Flows

### 1. User Registration & Login Journey
```
1. User visits homepage (/)
   ↓
2. Clicks "Register" → /register
   ↓
3. Fills registration form
   ↓
4. Frontend: POST /api/auth/signup
   ↓
5. Backend: Creates user with VOLUNTEER role
   ↓
6. User redirected to login page
   ↓
7. User enters credentials
   ↓
8. Frontend: POST /api/auth/signin
   ↓
9. Backend: Validates credentials → Returns JWT
   ↓
10. Frontend: Stores JWT in localStorage
    ↓
11. AuthContext updates global state
    ↓
12. Navbar shows authenticated UI
```

### 2. Post Creation Journey (NGO/Admin)
```
1. NGO user logs in
   ↓
2. NavbarShadcn checks user.role === 'NGO' || 'ADMIN'
   ↓
3. "Create Post" dropdown appears in navbar
   ↓
4. User clicks "Crowdfunding" → /posts/new
   ↓
5. PrivateRoute checks authentication
   ↓
6. CreatePostShadcn component loads
   ↓
7. Component checks user role (ADMIN/NGO only)
   ↓
8. User fills post form
   ↓
9. Frontend: POST /api/posts with JWT token
   ↓
10. Backend: AuthTokenFilter validates JWT
    ↓
11. PostController checks role permissions
    ↓
12. Post saved with approved=false
    ↓
13. User redirected to homepage
```

### 3. Post Search & Discovery Journey
```
1. User types in search box (PostListShadcn)
   ↓
2. Debounced search (500ms delay)
   ↓
3. Frontend: GET /api/posts/search?keyword=education&page=0&size=10
   ↓
4. Backend: PostRepository.searchPostsByTitle()
   ↓
5. Returns paginated results (approved posts only)
   ↓
6. Frontend updates post list with results
   ↓
7. User clicks "Load More" for pagination
   ↓
8. Frontend: GET /api/posts/search?page=1&size=10
   ↓
9. Append new results to existing list
```

### 4. Admin Approval Workflow
```
1. Admin logs in
   ↓
2. NavbarShadcn shows "Pending Posts" link
   ↓
3. Admin clicks → /posts/pending
   ↓
4. AdminRoute validates admin role
   ↓
5. Frontend: GET /api/posts/pending with JWT
   ↓
6. Backend: Checks admin role → Returns unapproved posts
   ↓
7. PendingPostsShadcn displays pending posts
   ↓
8. Admin clicks "Approve" on a post
   ↓
9. Frontend: PUT /api/posts/{id}/approve?approved=true
   ↓
10. Backend: Updates post.approved = true
    ↓
11. Post appears in public listings
```

---

## 🔐 Frontend Security Implementation

### 1. JWT Token Management
```javascript
// Automatic token attachment to requests
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Token expiration handling
const makeAuthenticatedRequest = async (url, options = {}) => {
  const headers = { ...getAuthHeader(), ...options.headers };
  
  try {
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};
```

### 2. Role-Based UI Rendering
```javascript
// NavbarShadcn.js - Conditional rendering based on role
const NavbarShadcn = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  return (
    <nav>
      {/* Always visible */}
      <Link to="/">Home</Link>
      
      {/* Only for ADMIN and NGO */}
      {isAuthenticated && (currentUser?.role === 'ADMIN' || currentUser?.role === 'NGO') && (
        <DropdownMenu>
          <DropdownMenuTrigger>Create Post</DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to="/posts/new">Crowdfunding</Link>
            <Link to="/posts/volunteer">Volunteering</Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {/* Only for ADMIN */}
      {isAuthenticated && currentUser?.role === 'ADMIN' && (
        <Link to="/posts/pending">Pending Posts</Link>
      )}
    </nav>
  );
};
```

### 3. Form Validation & Error Handling
```javascript
// CreatePostShadcn.js - Frontend validation before API call
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Client-side validation
  if (!formData.title.trim() || !formData.content.trim()) {
    setError('Title and content are required');
    return;
  }
  
  // Role validation
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'NGO')) {
    setError('Only administrators and NGOs can create posts');
    return;
  }
  
  try {
    await ApiService.createPost(postData, token);
    navigate('/');
  } catch (err) {
    if (err.message === 'Only admins and NGOs can create posts') {
      setError('You do not have permission to create posts.');
    } else {
      setError('Failed to create post. Please try again.');
    }
  }
};
```

---

## 📱 UI/UX Features

### 1. Responsive Design with Tailwind CSS
- **Mobile-first approach** with responsive breakpoints
- **Dark/Light theme** support with theme persistence
- **shadcn/ui components** for consistent design system

### 2. Loading States & Error Handling
```javascript
// PostListShadcn.js - Loading and error states
const PostListShadcn = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-muted-foreground">Loading posts...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-destructive/15 text-destructive p-3 rounded-md">
        {error}
      </div>
    );
  }
  
  return (
    // Post listing UI
  );
};
```

### 3. Search with Debouncing
```javascript
// Optimized search to prevent excessive API calls
const debouncedSearch = useMemo(
  () => debounce((term) => {
    if (term.trim()) {
      performSearch(term, 0, 10);
    } else {
      fetchPosts();
    }
  }, 500), // 500ms delay after user stops typing
  []
);
```

---

## 🔧 Development Workflow

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### 2. Environment Configuration
```javascript
// Configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api.com/api'
  : 'http://localhost:8097/api';
```

### 3. Error Boundary Implementation
```javascript
// Error handling for React components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}
```

---

## 🎯 Key Integration Points

### 1. Authentication Synchronization
- **Frontend**: JWT stored in localStorage, managed by AuthContext
- **Backend**: JWT validation on every protected request
- **Sync**: Token expiration handled gracefully with automatic logout

### 2. Role-Based Access Control
- **Frontend**: UI elements conditionally rendered based on user role
- **Backend**: API endpoints protected with role validation
- **Consistency**: Both layers enforce the same access rules

### 3. Real-time Data Updates
- **Search**: Debounced search with immediate UI feedback
- **Posts**: Pagination with "Load More" functionality
- **State**: Global state management prevents data inconsistencies

### 4. Error Handling Strategy
- **Network Errors**: Handled at API service level
- **Authentication Errors**: Automatic redirect to login
- **Validation Errors**: User-friendly error messages
- **Server Errors**: Graceful degradation with error boundaries

This comprehensive frontend-backend integration ensures a seamless user experience while maintaining security and performance standards.

---

## 📚 Additional Resources

- **Spring Security**: Role-based authentication
- **JPA Repositories**: Custom query methods
- **Pagination**: Spring Data pagination support
- **JWT**: Stateless token-based authentication
- **Swagger**: Interactive API documentation

This backend provides a robust foundation for a crowdfunding platform with proper security, role management, and scalable architecture.