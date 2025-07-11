# ParentO - Parent-Teacher Communication Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-8.10.1-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8.1-orange?style=for-the-badge&logo=socket.io" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
</div>

## 📖 Overview

ParentO is a comprehensive parent-teacher communication platform designed to bridge the gap between educators and parents. The platform facilitates real-time communication, activity tracking, progress monitoring, and collaborative learning experiences. Built with modern web technologies, ParentO provides an intuitive interface for both teachers and parents to stay connected and engaged in their children's educational journey.

## 🎥 Demo Video

📹 **[Watch the Demo Video](https://drive.google.com/file/d/1jb65ki7ymuosj4fy8ig7m98j_aZqz5A6/view?usp=drive_link)**

## ✨ Key Features

### 🏫 For Teachers
- **Classroom Management**: Create and manage virtual classrooms with unique class codes
- **Activity Creation**: Design and assign educational activities with customizable tasks
- **Real-time Announcements**: Send instant notifications to all parents in the classroom
- **Progress Tracking**: Monitor student and parent engagement through comprehensive analytics
- **Attendance Management**: Track student attendance and participation
- **Marks & Feedback**: Provide grades and personalized feedback to students
- **Leaderboard System**: Gamify learning with points-based leaderboards
- **Student-Parent Directory**: Access complete contact information for all families

### 👨‍👩‍👧‍👦 For Parents
- **Classroom Joining**: Join classrooms using unique class codes
- **Activity Participation**: Complete assigned activities and earn points
- **Real-time Notifications**: Receive instant updates on new activities and announcements
- **Progress Monitoring**: Track your child's academic performance and engagement
- **Communication Hub**: Stay connected with teachers through the platform
- **Multilingual Support**: Access the platform in 8 different languages
- **Profile Management**: Update personal and student information
- **Activity History**: View completed activities and earned points

### 🌐 Platform Features
- **Real-time Communication**: WebSocket-based instant messaging and notifications
- **Multilingual Support**: Available in English, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, and Malayalam
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Cloud Storage**: Integrated with Cloudinary for media file management
- **Progressive Web App**: PWA capabilities for enhanced user experience

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks and functional components
- **Vite** - Fast build tool and development server
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router DOM 7.2.0** - Client-side routing
- **Socket.IO Client 4.8.1** - Real-time communication
- **React i18next** - Internationalization support
- **Axios** - HTTP client for API communication
- **React Hot Toast** - User notification system

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.2** - Web application framework
- **MongoDB 8.10.1** - NoSQL database with Mongoose ODM
- **Socket.IO 4.8.1** - Real-time bidirectional communication
- **JWT (jsonwebtoken 9.0.2)** - Authentication and authorization
- **bcrypt 5.1.1** - Password hashing and security
- **Multer** - File upload handling
- **Cloudinary** - Cloud media storage and management
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Nodemon** - Development server with auto-restart

## 🚀 Installation & Setup

### Prerequisites
- Node.js (>= 14.0.0)
- MongoDB database
- Cloudinary account (for media storage)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ParentO/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the Backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Usage Guide

### For Teachers

1. **Registration & Login**
   - Visit the platform and click "Login as Teacher"
   - Create an account or sign in with existing credentials

2. **Creating a Classroom**
   - Navigate to the dashboard
   - Click "Create Class" to generate a new classroom
   - Share the unique class code with parents

3. **Managing Activities**
   - Create educational activities with descriptions and tasks
   - Set completion requirements (text, photo, video)
   - Assign points for completed activities

4. **Communication**
   - Send announcements to all parents
   - Monitor real-time engagement
   - Track student progress and attendance

### For Parents

1. **Joining a Classroom**
   - Register or login to the platform
   - Use the class code provided by the teacher
   - Enter student and parent information

2. **Participating in Activities**
   - View assigned activities on the dashboard
   - Complete tasks and submit responses
   - Earn points for participation

3. **Staying Connected**
   - Receive real-time notifications
   - View announcements and updates
   - Monitor student progress

## 🌍 Internationalization

ParentO supports 8 languages:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Bengali (bn)
- Marathi (mr)
- Malayalam (ml)

Language files are located in `Frontend/public/locales/` and can be easily extended.

## 🔧 API Endpoints

### Authentication
- `POST /api/teacher/signup` - Teacher registration
- `POST /api/teacher/login` - Teacher login
- `POST /api/parent/signup` - Parent registration
- `POST /api/parent/login` - Parent login

### Classroom Management
- `POST /api/classroom/create` - Create classroom
- `GET /api/classroom/teacher/:teacherId` - Get teacher's classrooms
- `POST /api/classroom/join` - Join classroom
- `DELETE /api/classroom/:classCode` - Delete classroom

### Activities
- `POST /api/activities/create` - Create activity
- `GET /api/activities/classroom/:classCode` - Get classroom activities
- `POST /api/activities/:id/complete` - Complete activity
- `DELETE /api/activities/:id` - Delete activity

### Announcements
- `POST /api/announcement/create` - Create announcement
- `GET /api/announcement/classroom/:classCode` - Get classroom announcements

## 🏗️ Project Structure

```
ParentO/
├── Backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route handlers
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Main server file
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context providers
│   │   ├── lib/         # Utility libraries
│   │   └── App.jsx      # Main application component
│   ├── public/
│   │   ├── locales/     # Translation files
│   │   └── assets/      # Static assets
│   └── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for user passwords
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **Role-based Access**: Different permissions for teachers and parents

## 🚀 Deployment

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

### Frontend Deployment
The frontend is optimized for deployment on:
- Vercel (recommended)
- Netlify
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
---

<div align="center">
  <p>Made with ❤️ for better parent-teacher communication</p>
  <p>ParentO - Empowering students through parents</p>
</div> 