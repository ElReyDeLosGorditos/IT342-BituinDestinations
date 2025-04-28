# Stage 1: Build with OpenJDK 17 (most stable in Docker images)
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory for the build process
WORKDIR /app

# Copy your project into the Docker container
COPY . .

# Run Maven build (skip tests to speed up build in Docker)
RUN mvn clean package -DskipTests

# Stage 2: Runtime with OpenJDK 17
FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
