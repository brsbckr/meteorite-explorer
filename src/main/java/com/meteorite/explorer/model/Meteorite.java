package com.meteorite.explorer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "meteorites")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Meteorite {

	@Id
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "name", columnDefinition = "VARCHAR")
	private String name;

	@Column(name = "recclass", columnDefinition = "VARCHAR")
	private String recclass;

	@Column(name = "fall", columnDefinition = "VARCHAR")
	private String fall;

	@Column(name = "mass")
	private Double mass;

	@Column(name = "year")
	private Integer year;

	@Column(name = "reclat")
	private Double reclat;

	@Column(name = "reclong")
	private Double reclong;
}