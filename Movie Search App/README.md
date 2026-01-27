# Movie Search App

A React-based movie search application using the OMDB API.allows users to search for movies using the OMDB API and view details.

## Features

- Search for movies by title
- View movie details (poster, year, plot, etc.)
- Responsive design
- Clean user interface

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- An API key from [OMDB API](http://www.omdbapi.com/)

## Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd movie-search-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Locate the `.env.example` file in the root directory.
   - Create a copy of it and rename it to `.env`:
     ```bash
     cp .env.example .env
     # OR on Windows
     copy .env.example .env
     ```
   - Open the `.env` file and replace `your_api_key_here` with your actual OMDB API key.
     ```env
     VITE_OMDB_API_KEY=your_actual_api_key_12345
     ```

## Running the Project

To start the development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.
