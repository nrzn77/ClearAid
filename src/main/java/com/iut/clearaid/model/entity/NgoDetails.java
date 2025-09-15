package com.iut.clearaid.model.entity;

import com.iut.clearaid.model.User;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "ngo_details")
@Data
public class NgoDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "organization_name", nullable = false)
    private String organizationName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;
}
