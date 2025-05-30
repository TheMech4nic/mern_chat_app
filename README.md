# Real-Time Chat Application

A simple chat application built with React, Node.js, Express, Socket.IO, and MongoDB.

## Features

- User registration and authentication
- Real-time messaging
- Online/offline status indicators
- "User is typing" indicators
- One-to-one chat functionality

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.IO
- **Authentication**: JSON Web Tokens (JWT)

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

4. The application will be available at `http://localhost:3000`

## Usage

1. Register a new account or login with existing credentials
2. View available users in the sidebar
3. Click on a user to start a conversation
4. Type and send messages in real-time
5. Observe user's online/offline status and typing indicators

## Project Structure

### Backend
- `server.js` - Main entry point for the Express server
- `controllers/` - Request handlers for API endpoints
- `models/` - Mongoose schemas for database models
- `routes/` - API route definitions
- `socket/` - Socket.IO event handlers
- `middleware/` - Express middleware (authentication, etc.)

### Frontend
- `src/components/` - React components
- `src/context/` - React Context API for state management
- `src/hooks/` - Custom React hooks
- `src/pages/` - Page components
- `src/App.js` - Main application component
- `src/App.css` - Application styles

## License

MIT #   m e r n _ c h a t _ a p p  
 