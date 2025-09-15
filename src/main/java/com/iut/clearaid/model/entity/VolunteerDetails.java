package com.iut.clearaid.model.entity;

import com.iut.clearaid.model.User;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "volunteer_details")
@Data
public class VolunteerDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "interests")
    private String interests;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;
}
