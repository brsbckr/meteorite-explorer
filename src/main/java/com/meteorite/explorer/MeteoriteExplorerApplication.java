package com.meteorite.explorer;

import com.meteorite.explorer.service.MeteoriteService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;

import com.meteorite.explorer.model.Meteorite;
import com.meteorite.explorer.repository.MeteoriteRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootApplication
public class MeteoriteExplorerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MeteoriteExplorerApplication.class, args);
	}

	@Bean
	CommandLineRunner loadData(MeteoriteService meteoriteService) {
		return args -> {
			if (meteoriteService.count() == 0) {
				meteoriteService.loadMeteoriteData();
			}
		};
	}
}
