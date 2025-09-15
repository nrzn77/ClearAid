package com.iut.clearaid.repository;

import com.iut.clearaid.model.entity.VolunteerDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerDetailsRepository extends JpaRepository<VolunteerDetails, Long> {
    VolunteerDetails findByUserId(Long userId);
}
