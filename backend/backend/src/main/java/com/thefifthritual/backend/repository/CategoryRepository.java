package com.thefifthritual.backend.repository;

import com.thefifthritual.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}