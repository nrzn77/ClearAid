# ClearAid Application

This repository contains both the backend API and frontend application for ClearAid, a platform that helps connect people who need assistance with those who can provide help.

## Table of Contents
- [Getting Started](#getting-started)
- [Frontend Application](#frontend-application)
- [Backend API](#backend-api)
- [Authentication](#authentication)
- [Posts](#posts)
- [Test Endpoints](#test-endpoints)

## Getting Started

### Prerequisites

- Java 17
- Maven
- Node.js (v14 or higher)
- npm (v6 or higher)

### Running the Backend

1. Navigate to the root directory of the project

2. Run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```

3. The backend API will be available at [http://localhost:8080/api](http://localhost:8080/api)

### Running the Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will be available at [http://localhost:3000](http://localhost:3000)

## Frontend Application

The frontend is built with React and includes the following features:

- User authentication (login/register)
- View posts
- Create new posts
- Search posts by title
- Responsive design

## Backend API

## Authentication

### Sign In
Sign in to get a JWT token for authenticated requests.

```http
POST /api/auth/signin
```

**Request Body:**
```json
{
    "username": "johndoe",
    "password": "yourpassword"
}
```

## Posts

### Create New Post
Create a new assistance request post.

```http
POST /api/posts
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
    "title": "Need help with moving",
    "post": "Looking for assistance with moving furniture from my apartment to my new house",
    "money": 50.00
}
```

### Get All Posts
Retrieve all posts in the system.

```http
GET /api/posts
```

### Get Post by ID
Retrieve a specific post by its ID.

```http
GET /api/posts/{id}
```

### Update Post
Update an existing post. Only the post owner can update it.

```http
PUT /api/posts/{id}
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
    "title": "Updated: Need help with moving",
    "post": "Updated description: Looking for assistance with moving furniture",
    "money": 75.00
}
```

### Delete Post
Delete an existing post. Only the post owner can delete it.

```http
DELETE /api/posts/{id}
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

### Get Posts by Author
Retrieve all posts by a specific author.

```http
GET /api/posts/author/{authId}
```

### Search Posts
Search posts by title keyword.

```http
GET /api/posts/search?keyword=<search_term>
```

## Test Endpoints

### Public Access Test
Test endpoint accessible to all users.

```http
GET /api/test/all
```

### User Access Test
Test endpoint to verify authenticated user access.

```http
GET /api/test/user
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

## Authentication Notes
- All authenticated endpoints require a valid JWT token in the Authorization header
- The token must be included in the format: `Bearer <your_jwt_token>`
- Tokens are obtained through the signin endpoint

## Technical Details
- All requests and responses use JSON format
- Set Content-Type header to `application/json` for POST/PUT requests
- Successful responses will have appropriate HTTP status codes (200, 201, 204)
- Error responses will include appropriate HTTP status codes and error messages

## Models

### Post
```json
{
    "id": "Long",
    "authId": "Long",
    "title": "String",
    "post": "String",
    "money": "Double"
}
```

### User
```json
{
    "id": "Long",
    "username": "String",
    "password": "String"
}
```

## Error Handling
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side error

## Security
- Endpoints are protected using Spring Security
- JWT (JSON Web Tokens) are used for authentication
- Passwords are securely hashed before storage
- Each user can only modify their own posts
