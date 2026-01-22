# Recipe Organizer Backend

Backend API server for the Recipe Organizer application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Start production server:
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if the server is running

### Authentication
- **POST** `/api/auth/register` - Register new user
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
  Returns JWT token in response.

### Recipes

- **GET** `/api/recipes` - Get all recipes
  - Query params: `?search=query` - Search recipes by title, ingredients, or instructions
  - If authenticated, returns only user's recipes
  
- **GET** `/api/recipes/:id` - Get recipe by ID

- **POST** `/api/recipes` - Create new recipe
  ```json
  {
    "title": "Recipe Title",
    "ingredients": ["ingredient1", "ingredient2"],
    "instructions": "Step by step instructions",
    "imageDataUrl": "optional base64 image"
  }
  ```

- **PUT** `/api/recipes/:id` - Update recipe
  ```json
  {
    "title": "Updated Title",
    "ingredients": ["new", "ingredients"],
    "instructions": "Updated instructions"
  }
  ```

- **DELETE** `/api/recipes/:id` - Delete recipe

### File Upload
- **POST** `/api/upload` - Upload image file
  - Content-Type: `multipart/form-data`
  - Field name: `image`
  - Returns base64 encoded image data URL

### API Documentation
- **GET** `/api-docs` - Swagger UI documentation

## Data Storage

Recipes are stored in SQLite database at `data/recipes.db`. The database is automatically created and initialized on first run.

Database schema:
- `users` - User accounts
- `recipes` - Recipe data
- `ingredients` - Recipe ingredients (linked to recipes)

## Development

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable.

## Project Structure

```
server/
├── src/
│   ├── index.ts              # Main server file
│   ├── types/
│   │   └── recipe.ts         # TypeScript types
│   ├── services/
│   │   ├── database.ts       # File storage service
│   │   └── recipeService.ts  # Business logic
│   ├── routes/
│   │   └── recipeRoutes.ts   # API routes
│   └── middleware/
│       ├── errorHandler.ts   # Error handling
│       └── validation.ts     # Request validation
├── data/                     # Data storage (auto-created)
└── dist/                     # Compiled JavaScript
```

