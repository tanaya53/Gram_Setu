package com.gramsetu.repository;

import com.gramsetu.model.RationStock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RationStockRepository extends JpaRepository<RationStock, Long> {
    List<RationStock> findByVillageId(String villageId);
    Optional<RationStock> findByItemNameAndVillageId(String itemName, String villageId);
}
