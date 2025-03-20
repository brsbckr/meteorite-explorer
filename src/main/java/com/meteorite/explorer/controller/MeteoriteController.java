package com.meteorite.explorer.controller;

import com.meteorite.explorer.model.Meteorite;
import com.meteorite.explorer.service.MeteoriteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

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
		return service.getAllMeteorites(name, pageable);
	}
	@GetMapping("/{id}")
	public ResponseEntity<Meteorite> getMeteoriteById(@PathVariable Long id) {
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
		return service.searchMeteorites(name, recclass, year, fall, minMass, maxMass, pageable);
	}

	@GetMapping("/stats/trends")
	public Map<Integer, Long> getMeteoriteTrends() {
		return service.getMeteoriteTrends();
	}

	@GetMapping("/stats/mass-distribution")
	public Map<String, Long> getMassDistribution() {
		return service.getMassDistribution();
	}

	@GetMapping("/stats/classification")
	public Map<String, Long> getClassificationBreakdown() {
		return service.getClassificationBreakdown();
	}
}