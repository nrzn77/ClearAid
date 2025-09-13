package com.iut.clearaid.service;

import com.iut.clearaid.model.entity.Post;
import com.iut.clearaid.repository.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Create or Update Post
    public Post savePost(Post post) {
        log.debug("Saving post with id: {}", post.getId());
        return postRepository.save(post);
    }


    public List<Post> getAllPosts() {
        log.debug("Retrieving all posts");
        return postRepository.findAll();
    }


    public Optional<Post> getPostById(Long id) {
        log.debug("Retrieving post with id: {}", id);
        return postRepository.findById(id);
    }


    public void deletePost(Long id) {
        log.debug("Deleting post with id: {}", id);
        postRepository.deleteById(id);
    }

    // Custom methods from repository
    public List<Post> getPostsByAuthId(Long authId) {
        log.debug("Retrieving posts by author id: {}", authId);
        return postRepository.findByAuthId(authId);
    }

    public List<Post> searchPostsByTitle(String keyword) {
        log.debug("Searching posts by title keyword: {}", keyword);
        return postRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<Post> getApprovedPosts() {
        log.debug("Retrieving approved posts");
        return postRepository.findByApprovedTrue();
    }

    public List<Post> getPendingPosts() {
        log.debug("Retrieving pending posts");
        return postRepository.findByApprovedFalse();
    }
}
