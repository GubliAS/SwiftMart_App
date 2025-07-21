package com.example.address.entity;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "country")
@Data
public class Country {
    @Id
    private Long id;
    private String countryname;
}
