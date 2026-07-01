package com.gramsetu.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "ration_stock", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"village_id", "item_name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RationStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "village_id", nullable = false)
    private String villageId;

    @Column(name = "item_name", nullable = false)
    private String itemName; // Wheat, Rice, Sugar, etc.

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String unit; // KG, Litre

    @UpdateTimestamp
    private LocalDateTime lastUpdated;
}
