# Recipe Finder API

This API allows you to generate recipes using AI based on provided ingredients, search for recipe images, save and delete recipes, and mark them as favorites. It integrates with the Gemini API for recipe generation and Google Custom Search for image searching.

## Table of Contents

1. [Setup](#setup)
2. [Environment Variables](#environment-variables)
3. [Endpoints](#endpoints)
4. [Usage](#usage)
5. [License](#license)

## Setup

### 1. User Authentication

To set up user authentication:
- Ensure that you have the `jsonwebtoken` library installed for handling JWT.
- Implement the login and registration endpoints to handle user authentication.
- Store user passwords securely using hashing (e.g., bcrypt).

### 2. Generate Recipe Using AI

To generate recipes using AI:
- Integrate with the Gemini API to generate recipes based on the given ingredients.
- Ensure you have the appropriate API key for accessing the Gemini API.

### 3. Save and Delete Recipes and Their Images

For saving and deleting recipes:
- Set up CRUD operations to manage recipes in your database.
- Implement functionality to save and delete associated images.

### 4. Mark Recipes as Favorites

To mark recipes as favorites:
- Implement endpoints that allow users to mark recipes as favorites and retrieve their favorite recipes.

### 5. Environment Variables

Create a `.env` file in the root directory of your project and add the following variables:

PORT=3100
JWT_SECRET=your_jwt_secret
DB_URL=your_database_url
API_KEY=your_gemini_api_key
GOOGLE_CSE_ID=your_google_cse_id
GOOGLE_API_KEY=your_google_api_key


## Usage

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-repo/recipe-finder-api.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd recipe-finder-api
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Create a `.env` file:**

    Copy the provided environment variables into a `.env` file in the root directory.

5. **Run the server:**

    ```bash
    npm start
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.