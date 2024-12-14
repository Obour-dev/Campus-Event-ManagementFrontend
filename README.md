# Campus Events Platform

## Project Overview
Campus Events is a web-based platform designed to streamline and enhance the campus event experience. It serves as a centralized hub where students can discover, track, and participate in various campus activities including workshops, seminars, and club events. The platform aims to improve student engagement and make event management more efficient.

## Login Credentials
- Email: obourtawiah@gmail.com
- Password: hello

## Feature Checklist

### Core Features
- [x] Homepage with feature overview
- [ ] Event browsing and search functionality
- [ ] Interactive event calendar
- [ ] User profile management
- [ ] Event RSVP system

### User Authentication
- [ ] User registration
- [ ] User login/logout
- [ ] Password recovery

### Event Management
- [ ] Event creation
- [ ] Event editing
- [ ] Event deletion
- [ ] Event categories
- [ ] Event details view

### User Features
- [ ] Personal event calendar
- [ ] RSVP tracking
- [ ] Event reminders
- [ ] Profile customization

### Administrative Features
- [ ] Event approval system
- [ ] User management
- [ ] Analytics dashboard
- [ ] Content moderation

## Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Local Setup
1. Clone the repository
   ```bash
   git clone https://github.com/your-username/campus-events-frontend.git
   cd campus-events-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create environment variables
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```env
   REACT_APP_API_URL=your_backend_api_url
   REACT_APP_BASE_URL=http://localhost:3000
   ```

4. Start the development server
   ```bash
   npm start
   ```

5. For production build
   ```bash
   npm run build
   ```

### Testing
Run the test suite:
```bash
npm test
```

### Available Scripts
- `npm start`: Starts the development server
- `npm test`: Runs the test suite
- `npm run build`: Creates a production build
- `npm run eject`: Ejects from Create React App
- `npm run lint`: Runs ESLint for code quality

### Frontend Deployment Link
https://campus-event-zeta.vercel.app
