package com.iut.clearaid.model.entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;
import lombok.*;
import jakarta.persistence.*;


@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // primary key

    private Long authId;

    private String title;

    @Column(columnDefinition = "TEXT") // good for long post content
    private String post;

    private Double money;

    @Column(nullable = false)
    @Builder.Default
    private Boolean approved = false;
}
