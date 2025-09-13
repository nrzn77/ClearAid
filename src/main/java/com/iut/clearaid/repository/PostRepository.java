package com.iut.clearaid.repository;




import com.iut.clearaid.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // custom query methods if needed
    List<Post> findByAuthId(Long authId);

    List<Post> findByTitleContainingIgnoreCase(String keyword);

    List<Post> findByApprovedTrue();

    List<Post> findByApprovedFalse();

   

}

