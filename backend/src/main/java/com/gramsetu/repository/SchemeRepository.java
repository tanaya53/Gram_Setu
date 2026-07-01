package com.gramsetu.repository;

import com.gramsetu.model.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByVillageId(String villageId);
}
