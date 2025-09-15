package com.iut.clearaid.repository;


import com.iut.clearaid.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // custom query methods if needed
    List<Post> findByAuthId(Long authId);

    List<Post> findByTitleContainingIgnoreCase(String keyword);

    List<Post> findByApprovedTrue();

    List<Post> findByApprovedFalse();

    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.approved = true")
    Page<Post> searchPostsByTitle(@Param("keyword") String keyword, Pageable pageable);

}
