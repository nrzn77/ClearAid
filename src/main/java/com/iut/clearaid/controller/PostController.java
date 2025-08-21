package com.iut.clearaid.controller;

import com.iut.clearaid.model.entity.Post;
import com.iut.clearaid.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Create a new Post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.savePost(post));
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
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post post) {
        return postService.getPostById(id)
                .map(existingPost -> {
                    post.setId(id); // ensure the ID stays the same
                    return ResponseEntity.ok(postService.savePost(post));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete Post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (postService.getPostById(id).isPresent()) {
            postService.deletePost(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Custom: Get Posts by Author ID
    @GetMapping("/author/{authId}")
    public ResponseEntity<List<Post>> getPostsByAuthId(@PathVariable("authId") Long authId) {
        System.out.println(">>> Received request for authorId = " + authId);
        return ResponseEntity.ok(postService.getPostsByAuthId(authId));
    }


    // Custom: Search Posts by Title
    @GetMapping("/search")
    public ResponseEntity<List<Post>> searchPosts(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.searchPostsByTitle(keyword));
    }
}