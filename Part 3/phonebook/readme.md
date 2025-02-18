# Phonebook

A full-stack phonebook application built with Node.js, Express, and MongoDB for backend, and a React-based frontend.

You can find a hosted version of the application here: https://phonebook-backend-part-3.fly.dev/
## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) 
- [MongoDB](https://www.mongodb.com/) 
- [Fly.io CLI](https://fly.io/docs/hands-on/install-flyctl/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/phonebook.git
   cd phonebook
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   PORT=3001
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

   The server will start on `http://localhost:3001/`.

### Running in Production

To run the application in a production environment:
```sh
npm start
```

## Frontend Integration

The frontend UI is built separately and needs to be bundled before deployment.

To build the UI from Part 2 of the project:
```sh
npm run build:ui
```
## Deployment

The app is deployed using **Fly.io**.

1. Deploy to Fly.io:
   ```sh
   npm run deploy
   ```

2. Full deployment including UI build:
   ```sh
   npm run deploy:full
   ```

3. View production logs:
   ```sh
   npm run logs:prod
   ```

## API Endpoints

| Method | Endpoint       | Description              |
|--------|--------------|--------------------------|
| GET    | `/api/persons` | Get all contacts        |
| GET    | `/api/persons/:id` | Get contact by ID  |
| POST   | `/api/persons` | Add a new contact       |
| DELETE | `/api/persons/:id` | Delete a contact    |

### Notes
- The `deploy:full` command builds the UI and deploys both frontend and backend.

