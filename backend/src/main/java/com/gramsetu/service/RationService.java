package com.gramsetu.service;

import com.gramsetu.model.*;
import com.gramsetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class RationService {
    @Autowired
    private RationStockRepository stockRepository;

    @Autowired
    private RationDistributionRepository distributionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RationStock> getStock(String villageId) {
        return stockRepository.findByVillageId(villageId);
    }

    public RationStock updateStock(RationStock stock, String villageId) {
        stock.setVillageId(villageId);
        RationStock existing = stockRepository.findByItemNameAndVillageId(stock.getItemName(), villageId)
                .orElse(stock);
        if (existing.getId() != null) {
            existing.setQuantity(stock.getQuantity());
            existing.setUnit(stock.getUnit());
            return stockRepository.save(existing);
        }
        return stockRepository.save(stock);
    }

    @Transactional
    public RationDistribution distribute(Long userId, String itemName, Double quantity, String adminVillageId) {
        User recipient = userRepository.findById(userId).orElseThrow();
        if (!recipient.getVillageId().equals(adminVillageId)) {
            throw new RuntimeException("Recipient belongs to a different village");
        }
        RationStock stock = stockRepository.findByItemNameAndVillageId(itemName, adminVillageId)
                .orElseThrow(() -> new RuntimeException("Item not in stock"));

        if (stock.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        stock.setQuantity(stock.getQuantity() - quantity);
        stockRepository.save(stock);

        RationDistribution log = RationDistribution.builder()
                .recipient(recipient)
                .itemName(itemName)
                .quantity(quantity)
                .build();
        
        return distributionRepository.save(log);
    }

    public List<RationDistribution> getMyRationLogs(Long userId) {
        return distributionRepository.findByRecipientId(userId);
    }

    public List<RationDistribution> getAllDistributions(String villageId) {
        return distributionRepository.findByRecipient_VillageId(villageId);
    }
}
