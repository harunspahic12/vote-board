# Vote Board 💡

A web application where users can submit ideas and upvote their favorites.

## Features

✅ **Display Ideas** - View all ideas with title, description, and vote count, sorted by votes  
✅ **Add Ideas** - Submit new ideas with a title (required) and description (optional)  
✅ **Vote on Ideas** - Upvote your favorite ideas with persistent vote counts  
✅ **Search/Filter** - Find ideas by searching title or description  
✅ **Loading States** - Visual feedback during data operations  
✅ **Error Handling** - Clear error messages when things go wrong  
✅ **Empty States** - Helpful messages when no ideas exist  
✅ **Delete Ideas** - Remove ideas (stretch goal)  

## Tech Stack

- **Backend**: Python + FastAPI
- **Database**: PostgreSQL
- **Frontend**: React + TypeScript + Vite
- **Styling**: Modern CSS with gradient backgrounds
- **Deployment**: Docker Compose

## Prerequisites

- Docker and Docker Compose
- Python 3.9+
- Node.js 18+ and npm

## Quick Start

### 1. Start the Database

```bash
cd /Users/harunspahic/projects/vote-board
docker-compose up -d
```

This will start PostgreSQL and automatically initialize the database schema with sample data.

### 2. Set Up the Backend

In a new terminal:

```bash
cd /Users/harunspahic/projects/vote-board/backend

# Create a virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (or use the default values)
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voteboard" > .env
echo "PORT=3001" >> .env

# Run the backend server
python main.py
```

The backend API will be available at `http://localhost:3001`

### 3. Set Up the Frontend

In another new terminal:

```bash
cd /Users/harunspahic/projects/vote-board/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Open the Application

Visit `http://localhost:5173` in your browser and start voting! 🚀

## Project Structure

```
vote-board/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── init.sql             # Database initialization
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx          # Main app component
│   │   ├── types.ts         # TypeScript types
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docker-compose.yml       # Docker configuration
└── README.md
```

## API Endpoints

- `GET /api/ideas` - Get all ideas (with optional `?search=term` query)
- `POST /api/ideas` - Create a new idea
- `POST /api/ideas/:id/vote` - Upvote an idea
- `DELETE /api/ideas/:id` - Delete an idea

## Environment Variables

Backend (`.env` file in `backend/` directory):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voteboard
PORT=3001
```

## Development Tips

- The frontend proxies API requests to the backend automatically
- Hot reload is enabled for both frontend and backend
- Vote counts persist in PostgreSQL across restarts
- Search uses debouncing (300ms) for better UX

## Stopping the Application

```bash
# Stop the frontend and backend with Ctrl+C in their terminals

# Stop the database
docker-compose down

# To remove database data as well
docker-compose down -v
```

## Troubleshooting

**Database connection errors?**
- Make sure Docker is running
- Check that port 5432 is not in use by another PostgreSQL instance
- Wait a few seconds for the database to initialize

**Frontend not connecting to backend?**
- Ensure the backend is running on port 3001
- Check the browser console for CORS errors

**Port already in use?**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`
- Database: Change ports in `docker-compose.yml`

## Future Enhancements

- Sort toggle between "Newest" and "Most Voted"
- Edit functionality for ideas
- User authentication
- Categories/tags for ideas
- Comments on ideas
- Vote limits per user

---

Built with ❤️ using Python, FastAPI, React, and TypeScript

