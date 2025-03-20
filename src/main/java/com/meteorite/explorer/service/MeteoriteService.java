package com.meteorite.explorer.service;

import com.meteorite.explorer.model.Meteorite;
import com.meteorite.explorer.repository.MeteoriteRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class MeteoriteService {

	private final MeteoriteRepository repository;

	public Optional<Meteorite> getMeteoriteById(Long id) {
		log.info("Getting meteorite by id: {}", id);
		return repository.findById(id);
	}

	public Page<Meteorite> getAllMeteorites(String name, Pageable pageable) {
		log.info("Getting all meteorites");
		if (name != null && !name.trim().isEmpty()) {
			return repository.findByNameContainingIgnoreCase(name, pageable);
		}
		return repository.findAll(pageable);
	}

	public Page<Meteorite> searchMeteorites(String name, String recclass, Integer year, String fall, Double minMass, Double maxMass, Pageable pageable) {
		log.info("Searching meteorites by name: {}, recclass: {}, year: {}, fall: {}, minMass: {}, maxMass: {}", name, recclass, year, fall, minMass, maxMass);
		return repository.searchMeteorites(name, recclass, year, fall, minMass, maxMass, pageable);
	}

	public Map<Integer, Long> getMeteoriteTrends() {
		log.info("Getting meteorite trends");
		return repository.getMeteoriteTrends()
				.stream()
				.collect(Collectors.toMap(o -> (Integer) o[0], o -> (Long) o[1]));
	}

	public Map<String, Long> getMassDistribution() {
		log.info("Getting mass distribution");
		return repository.getMassDistribution()
				.stream()
				.collect(Collectors.toMap(o -> (String) o[0], o -> (Long) o[1]));
	}

	public Map<String, Long> getClassificationBreakdown() {
		log.info("Getting classification breakdown");
		return repository.getClassificationBreakdown()
				.stream()
				.collect(Collectors.toMap(o -> (String) o[0], o -> (Long) o[1]));
	}

	public long count() {
		log.info("Counting meteorites");
		return repository.count();
	}

	@Transactional
	public void loadMeteoriteData() {
		log.info("Loading meteorite data");
		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(new ClassPathResource("Meteorite_landings.csv").getInputStream(), StandardCharsets.UTF_8))) {
			List<Meteorite> meteorites = reader.lines().skip(1).map(line -> {
				String[] data = line.split(",");
				return Meteorite.builder()
						.id(parseLong(getValue(data, 1)))
						.name(getValue(data, 0))
						.recclass(getValue(data, 3))
						.mass(parseDouble(getValue(data, 4)))
						.fall(getValue(data, 5))
						.year(parseInteger(getValue(data, 6)))
						.reclat(parseDouble(getValue(data, 7)))
						.reclong(parseDouble(getValue(data, 8)))
						.build();
			}).toList();
			repository.saveAll(meteorites);
		} catch (Exception e) {
			log.error("Error loading meteorite data", e);
		}
	}

	private String getValue(String[] data, int index) {
		return index < data.length && !data[index].isEmpty() ? data[index] : null;
	}

	private Double parseDouble(String value) {
		try {
			return value != null ? Double.parseDouble(value) : null;
		} catch (Exception e) {
			return null;
		}
	}

	private Integer parseInteger(String value) {
		try {
			return value != null ? Integer.parseInt(value) : null;
		} catch (Exception e) {
			return null;
		}
	}

	private Long parseLong(String value) {
		try {
			return value != null ? Long.parseLong(value) : null;
		} catch (Exception e) {
			return null;
		}
	}
}
