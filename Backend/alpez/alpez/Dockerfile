## Stage 1: Build with OpenJDK 21
#FROM openjdk:21 AS build
#
## Install Maven
#RUN apt-get update && apt-get install -y maven
#
## Set the working directory for the build process
#WORKDIR /app
#
## Copy your project into the Docker container
#COPY . .
#
## Run Maven build (skip tests to speed up build in Docker)
#RUN mvn clean package -DskipTests
#
## Stage 2: Runtime with OpenJDK 21
#FROM openjdk:21-slim
#WORKDIR /app
#COPY --from=build /app/target/*.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]

# Build Stage
FROM openjdk:21-jdk-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy necessary files to the working directory
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy the source code to the container
COPY src src

# Make sure the Maven wrapper is executable
RUN chmod +x mvnw

# Run the build command (skipping tests)
RUN ./mvnw clean package -DskipTests

# Production Stage
FROM openjdk:21-slim

# Set the working directory for the app
WORKDIR /app

# Copy the packaged JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 for the app
EXPOSE 8080

# Set the entry point for the container
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "/app.jar"]

