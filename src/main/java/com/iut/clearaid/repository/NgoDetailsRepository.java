package com.iut.clearaid.repository;

import com.iut.clearaid.model.entity.NgoDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NgoDetailsRepository extends JpaRepository<NgoDetails, Long> {
    NgoDetails findByUserId(Long userId);
}
