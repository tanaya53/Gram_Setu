package com.gramsetu.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "villages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Village {
    @Id
    private String villageId; // Custom unique ID entered by user during signup

    @Column(nullable = false)
    private String villageName;
}
