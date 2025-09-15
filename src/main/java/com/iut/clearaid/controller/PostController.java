package com.iut.clearaid.controller;

import com.iut.clearaid.model.User;
import com.iut.clearaid.model.entity.Post;
import com.iut.clearaid.model.enums.Users;
import com.iut.clearaid.repository.UserRepository;
import com.iut.clearaid.security.JwtUtil;
import com.iut.clearaid.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Slf4j
public class PostController {

    private final PostService postService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public PostController(PostService postService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.postService = postService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // Create a new Post
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Post post) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        String jwtToken = token.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(jwtToken);

        User user = userRepository.findById(userId).orElse(null);
        if (user == null || (user.getRole() != Users.ADMIN && user.getRole() != Users.NGO)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins and NGOs can create posts");
        }

        // NGOs can only create posts for themselves
        if (user.getRole() == Users.NGO) {
Post newPost = Post.builder()
                    .id(null)
                    .authId(userId)
                    .title(post.getTitle())
                    .post(post.getPost())
                    .money(post.getMoney())
                    .approved(false)
                    .build();
            return ResponseEntity.ok(postService.savePost(newPost));
        }

        // Admin can specify authId
        if (post.getAuthId() != null) {
Post newPost = Post.builder()
                    .id(null)
                    .authId(post.getAuthId())
                    .title(post.getTitle())
                    .post(post.getPost())
                    .money(post.getMoney())
                    .approved(false)
                    .build();
            return ResponseEntity.ok(postService.savePost(newPost));
        }

        // Admin creating for themselves
Post newPost = Post.builder()
                .id(null)
                .authId(userId)
                .title(post.getTitle())
                .post(post.getPost())
                .money(post.getMoney())
                .approved(false)
                .build();
        return ResponseEntity.ok(postService.savePost(newPost));
    }

    // Get all Posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getApprovedPosts());
    }

    // Get Post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update Post
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id,
            @RequestBody Post updatedPost) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        String jwtToken = token.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(jwtToken);
        boolean isAdmin = jwtUtil.isAdmin(jwtToken);

        return postService.getPostById(id)
                .map(existingPost -> {
                    if (!isAdmin && !existingPost.getAuthId().equals(userId)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed to update this post");
                    }

                    existingPost.setTitle(updatedPost.getTitle());
                    existingPost.setPost(updatedPost.getPost());
                    existingPost.setMoney(updatedPost.getMoney());

                    return ResponseEntity.ok(postService.savePost(existingPost));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete Post
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        String jwtToken = token.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(jwtToken);
        boolean isAdmin = jwtUtil.isAdmin(jwtToken);

        return postService.getPostById(id)
                .map(existingPost -> {
                    if (!isAdmin && !existingPost.getAuthId().equals(userId)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed to delete this post");
                    }

                    postService.deletePost(id);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Approve Post
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approvePost(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id,
            @RequestParam boolean approved) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        String jwtToken = token.substring(7);
        boolean isAdmin = jwtUtil.isAdmin(jwtToken);

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can approve posts");
        }

        return postService.getPostById(id)
                .map(existingPost -> {
                    existingPost.setApproved(approved);
                    return ResponseEntity.ok(postService.savePost(existingPost));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get Posts by Author ID
    @GetMapping("/author/{authId}")
    public ResponseEntity<List<Post>> getPostsByAuthId(@PathVariable("authId") Long authId) {
        log.info("Received request for authorId = {}", authId);
        return ResponseEntity.ok(postService.getPostsByAuthId(authId));
    }

    // Search Posts by Title
    @GetMapping("/search")
    public ResponseEntity<Page<Post>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.searchPostsByTitle(keyword, pageable));
    }

    // Get Pending Posts (unapproved)
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingPosts(
            @RequestHeader(value = "Authorization", required = false) String token) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        String jwtToken = token.substring(7);
        boolean isAdmin = jwtUtil.isAdmin(jwtToken);

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can view pending posts");
        }

        return ResponseEntity.ok(postService.getPendingPosts());
    }
}
