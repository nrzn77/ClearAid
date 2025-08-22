# ClearAid API Documentation

This repository contains the backend API for ClearAid, a platform that helps connect people who need assistance with those who can provide help.

## Table of Contents
- [Authentication](#authentication)
- [Posts](#posts)
- [Test Endpoints](#test-endpoints)

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
