package com.iut.clearaid.service;

import com.iut.clearaid.model.entity.Post;
import com.iut.clearaid.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Create or Update Post
    public Post savePost(Post post) {
        return postRepository.save(post);
    }


    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }


    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }


    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    // Custom methods from repository
    public List<Post> getPostsByAuthId(Long authId) {
        return postRepository.findByAuthId(authId);
    }

    public List<Post> searchPostsByTitle(String keyword) {
        return postRepository.findByTitleContainingIgnoreCase(keyword);
    }
}