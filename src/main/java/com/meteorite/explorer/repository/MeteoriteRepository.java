package com.meteorite.explorer.repository;

import com.meteorite.explorer.model.Meteorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MeteoriteRepository extends JpaRepository<Meteorite, Long> {

	@Query("SELECT m FROM Meteorite m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))")
	Page<Meteorite> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

	@Query("SELECT m FROM Meteorite m WHERE " +
			"((LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))) OR :name IS NULL) " +
			"AND ((LOWER(m.recclass) = LOWER(:recclass)) OR :recclass IS NULL) " +
			"AND (:year IS NULL OR m.year = :year) " +
			"AND ((LOWER(m.fall) = LOWER(:fall)) OR :fall IS NULL) " +
			"AND (:minMass IS NULL OR m.mass >= :minMass) " +
			"AND (:maxMass IS NULL OR m.mass <= :maxMass)")
	Page<Meteorite> searchMeteorites(@Param("name") String name,
	                                 @Param("recclass") String recclass,
	                                 @Param("year") Integer year,
	                                 @Param("fall") String fall,
	                                 @Param("minMass") Double minMass,
	                                 @Param("maxMass") Double maxMass,
	                                 Pageable pageable);

	@Query("SELECT m.year, COUNT(m) FROM Meteorite m WHERE m.year IS NOT NULL GROUP BY m.year")
	List<Object[]> getMeteoriteTrends();

	@Query("SELECT CASE "+
			"WHEN m.mass < 1000 THEN '<1kg' " +
			"WHEN m.mass >= 1000 AND m.mass < 10000 THEN '1-10kg' " +
			"ELSE '>10kg' " +
			"END as massCategory, COUNT(m) " +
			"FROM Meteorite m WHERE m.mass IS NOT NULL " +
			"GROUP BY massCategory")
	List<Object[]> getMassDistribution();

	@Query("SELECT m.recclass, COUNT(m) FROM Meteorite m WHERE m.recclass IS NOT NULL GROUP BY m.recclass")
	List<Object[]> getClassificationBreakdown();
}