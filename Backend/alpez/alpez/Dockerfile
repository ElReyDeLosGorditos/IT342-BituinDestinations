# Use a base image that includes OpenJDK
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file of the application (ensure this is built first)
COPY target/*.jar app.jar

# Expose the port the app runs on (default Spring Boot port)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
