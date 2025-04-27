# Bituin Destinations - Backend

## Environment Variables Configuration

This project now uses environment variables for sensitive configuration values like OAuth client credentials and JWT settings. This improves security by keeping sensitive information out of the codebase.

### Setting Up Environment Variables

1. Create a `.env` file in the root directory of the project (if not already created)
2. Add the following environment variables to the file:

```
OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRATION_MS=3600000
```

3. Replace the placeholder values with your actual credentials:
   - `OAUTH_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `OAUTH_GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `OAUTH_REDIRECT_URI`: The redirect URI for OAuth (default is http://localhost:8080/login/oauth2/code/google)
   - `JWT_SECRET_KEY`: A secure random string to use as the JWT signing key
   - `JWT_EXPIRATION_MS`: JWT token expiration time in milliseconds (default is 3600000 = 1 hour)

### Important Notes

- **Never commit your `.env` file to version control**
- The `.env` file should already be in your `.gitignore` file
- If you need to share the project with others, provide them with a template `.env.example` file without actual credentials

### Running the Application

When running the application, the environment variables will be automatically loaded from the `.env` file. No additional configuration is needed.

## Authentication Testing

### Testing JWT Authentication

1. Register a new user:
   - POST to `http://localhost:8080/user/save`
   - Body: `{"name": "Test User", "email": "test@example.com", "password": "password123"}`

2. Login with the user:
   - POST to `http://localhost:8080/user/login`
   - Body: `{"email": "test@example.com", "password": "password123"}`
   - Response will include a JWT token

3. Use the token for authenticated requests:
   - Add header: `Authorization: Bearer your_jwt_token`
   - Try accessing a protected endpoint like `http://localhost:8080/user/getAll`

### Testing OAuth Authentication

1. Access the OAuth login URL in a browser: `http://localhost:8080/oauth2/authorization/google`
2. Complete the Google login process
3. You will be redirected back to the application with a token
