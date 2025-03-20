CREATE TABLE IF NOT EXISTS meteorites (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recclass VARCHAR(255),
    mass DOUBLE PRECISION,
    fall VARCHAR(50),
    year INTEGER,
    reclat DOUBLE PRECISION,
    reclong DOUBLE PRECISION
);