package com.iut.clearaid.repository;

import com.iut.clearaid.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);

    @Query("SELECT u.id FROM User u WHERE u.username = :username")
    Long findIdByUsername(String username);

    User findByUsername(String username);
    
    @Query("SELECT u.role FROM User u WHERE u.username = :username")
    String findRoleByUsername(String username);
}
