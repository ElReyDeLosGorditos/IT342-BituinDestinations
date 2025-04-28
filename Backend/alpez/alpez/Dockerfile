# Build stage using Maven with OpenJDK 17
FROM maven:3-eclipse-temurin-17 AS build

# Copy the project files into the container
COPY . .

# Run Maven build and skip tests
RUN mvn clean package -DskipTests

# Run stage using a minimal Alpine-based OpenJDK image
FROM eclipse-temurin:17-alpine

# Copy the generated .jar file from the build stage
COPY --from=build /target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Set the entry point for the container
ENTRYPOINT ["java", "-jar", "app.jar"]
