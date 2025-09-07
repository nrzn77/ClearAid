package com.iut.clearaid.controller;

import com.iut.clearaid.model.entity.Post;
import com.iut.clearaid.security.JwtUtil;
import com.iut.clearaid.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Slf4j
public class PostController {

    private final PostService postService;
    private final JwtUtil jwtUtil;

    public PostController(PostService postService, JwtUtil jwtUtil) {
        this.postService = postService;
        this.jwtUtil = jwtUtil;
    }

    // Create a new Post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestHeader("Authorization") String token, @RequestBody Post post) {
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        Post newPost = new Post(
                null,
                userId,
                post.getTitle(),
                post.getPost(),
                post.getMoney()
        );
        return ResponseEntity.ok(postService.savePost(newPost));
    }

    // Get all Posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // Get Post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Post
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Post updatedPost) {

        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));

        return (ResponseEntity<Post>) postService.getPostById(id)
                .map(existingPost -> {
                    // ensure the post belongs to the user
                    if (!existingPost.getAuthId().equals(userId)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }

                    // update only allowed fields
                    existingPost.setTitle(updatedPost.getTitle());
                    existingPost.setPost(updatedPost.getPost());
                    existingPost.setMoney(updatedPost.getMoney());

                    return ResponseEntity.ok(postService.savePost(existingPost));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete Post
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {

        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));

        return postService.getPostById(id)
                .map(existingPost -> {
                    // ensure the post belongs to the user
                    if (!existingPost.getAuthId().equals(userId)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }

                    postService.deletePost(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Custom: Get Posts by Author ID
    @GetMapping("/author/{authId}")
    public ResponseEntity<List<Post>> getPostsByAuthId(@PathVariable("authId") Long authId) {
        log.info("Received request for authorId = {}", authId);
        return ResponseEntity.ok(postService.getPostsByAuthId(authId));
    }


    // Custom: Search Posts by Title
    @GetMapping("/search")
    public ResponseEntity<List<Post>> searchPosts(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.searchPostsByTitle(keyword));
    }
}