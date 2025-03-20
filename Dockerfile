# Dockerfile for Meteorite Explorer Application

# Use an official Maven and OpenJDK image as a parent image
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and download dependencies in a separate step to leverage Docker caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the application source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use a lightweight JDK runtime for running the application
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy the built application JAR from the build stage
COPY --from=build /app/target/MeteoriteExplorerApplication-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Set environment variables for database connection
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/meteorite_db
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=validate

# Run the application
CMD ["java", "-jar", "app.jar"]