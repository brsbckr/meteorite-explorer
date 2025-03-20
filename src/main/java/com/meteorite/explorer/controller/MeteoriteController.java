package com.meteorite.explorer.controller;

import com.meteorite.explorer.model.Meteorite;
import com.meteorite.explorer.service.MeteoriteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/meteorites")
public class MeteoriteController {

	private final MeteoriteService service;

	public MeteoriteController(MeteoriteService service) {
		this.service = service;
	}

	@GetMapping
	public Page<Meteorite> getAllMeteorites(
			@RequestParam(required = false) String name,
			Pageable pageable) {
		log.info("Getting all meteorites");
		return service.getAllMeteorites(name, pageable);
	}
	@GetMapping("/{id}")
	public ResponseEntity<Meteorite> getMeteoriteById(@PathVariable Long id) {
		log.info("Getting meteorite by id: {}", id);
		Optional<Meteorite> meteorite = service.getMeteoriteById(id);
		return meteorite.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/search")
	public Page<Meteorite> searchMeteorites(
			@RequestParam(required = false) String name,
			@RequestParam(required = false) String recclass,
			@RequestParam(required = false) Integer year,
			@RequestParam(required = false) String fall,
			@RequestParam(required = false) Double minMass,
			@RequestParam(required = false) Double maxMass,
			Pageable pageable) {
		log.info("Searching meteorites by name: {}, recclass: {}, year: {}, fall: {}, minMass: {}, maxMass: {}", name, recclass, year, fall, minMass, maxMass);
		return service.searchMeteorites(name, recclass, year, fall, minMass, maxMass, pageable);
	}

	@GetMapping("/stats/trends")
	public Map<Integer, Long> getMeteoriteTrends() {
		log.info("Getting meteorite trends");
		return service.getMeteoriteTrends();
	}

	@GetMapping("/stats/mass-distribution")
	public Map<String, Long> getMassDistribution() {
		log.info("Getting mass distribution");
		return service.getMassDistribution();
	}

	@GetMapping("/stats/classification")
	public Map<String, Long> getClassificationBreakdown() {
		log.info("Getting classification breakdown");
		return service.getClassificationBreakdown();
	}
}