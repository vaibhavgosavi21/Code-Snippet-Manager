# Code Snippet Manager - MERN Stack

A full-featured MERN stack application for managing code snippets with user authentication, admin dashboard, and MongoDB storage.

## Features

### User Features
- ✅ User registration and authentication
- ✅ Add, edit, and delete code snippets
- ✅ Categorize snippets by programming language
- ✅ Add multiple tags to each snippet
- ✅ Real-time search by title, tag, or content
- ✅ Syntax highlighting for multiple languages
- ✅ One-click copy to clipboard
- ✅ Responsive design with Tailwind CSS

### Admin Features
- ✅ Admin dashboard with user statistics
- ✅ View all users and their information
- ✅ Monitor user activity and actions
- ✅ View all snippets across all users
- ✅ Real-time activity tracking

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React 18, Vite, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: lucide-react
- **State Management**: Context API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### Quick Setup (Windows)
Run the setup script to install dependencies and create admin user:
```bash
setup.bat
```

### Manual Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd Code-Snippet-Manager-MERN
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/snippet-manager
JWT_SECRET=super-secret-jwt-key-for-snippet-manager-2024-secure
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system or update the connection string in `.env` for MongoDB Atlas.

### 5. Create Admin User
```bash
cd backend
npm run create-admin
```

### 6. Run the Application

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Admin Account

Use the setup script or create manually:

**Default Admin Credentials:**
- Email: admin@example.com
- Password: admin123

**To create admin manually:**
```bash
cd backend
npm run create-admin
```

**Or update existing user in MongoDB:**
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Snippets
- `GET /api/snippets` - Get user's snippets
- `POST /api/snippets` - Create new snippet
- `PUT /api/snippets/:id` - Update snippet
- `DELETE /api/snippets/:id` - Delete snippet

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users/:userId/activity` - Get user activity
- `GET /api/admin/snippets` - Get all snippets

## Project Structure

```
Code-Snippet-Manager-MERN/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Snippet.js
│   │   └── Activity.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── snippets.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── SnippetCard.jsx
│   │   │   └── SnippetForm.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Usage

### For Regular Users
1. Register or login to your account
2. Create code snippets with title, code, language, tags, and description
3. Search and filter your snippets
4. Edit or delete existing snippets
5. Copy code to clipboard with one click

### For Admins
1. Login with admin credentials
2. Access admin dashboard via the "Admin" button
3. View user statistics and system overview
4. Monitor user activities and snippet creation
5. View all users and their information

## Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy the backend folder
3. Update frontend API base URL

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Configure proxy/redirects for API calls

## License

MIT License"# Code-Snippet-Manager" 
