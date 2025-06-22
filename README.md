# The Glen

The Glen is a property rental and booking application with a full-stack architecture, featuring a React frontend and Node.js backend.

## Project Structure

The project is organized into two main directories:

-   **Frontend**: A React application built with TypeScript, Vite, and Redux
-   **Backend**: A Node.js server using Express and MongoDB

## Features

-   User authentication and authorization
-   Property listings with search functionality
-   Interactive map for property locations
-   Booking system for rentals
-   Responsive design for mobile and desktop

## Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/the-glen.git
    cd the-glen
    ```

2. Install dependencies for both frontend and backend:

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3. Create a `.env` file in the backend directory with the following variables:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/theglen
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1. Start the backend server:

    ```bash
    cd backend
    npm start
    ```

2. In a separate terminal, start the frontend development server:

    ```bash
    cd frontend
    npm run dev
    ```

3. Access the application in your browser at `http://localhost:5173`

## Backend API Endpoints

-   **Authentication**

    -   POST `/api/users/register` - Register a new user
    -   POST `/api/users/login` - Login a user

-   **Listings**

    -   GET `/api/listings` - Get all listings
    -   GET `/api/listings/:id` - Get a specific listing
    -   POST `/api/listings` - Create a new listing (authenticated)

-   **Bookings**
    -   GET `/api/bookings` - Get user bookings (authenticated)
    -   POST `/api/bookings` - Create a new booking (authenticated)

## Frontend Components

-   **Authentication**

    -   Login and Signup pages
    -   Protected routes

-   **Listings**

    -   Property listings with search and filter functionality
    -   Property details page
    -   Create listing page for property owners

-   **Bookings**
    -   Booking form with date selection
    -   Booking confirmation and management

## License

This project is licensed under the MIT License - see the LICENSE file for details.
