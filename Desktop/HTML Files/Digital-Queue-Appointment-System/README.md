# Digital Queue & Appointment Booking System

A comprehensive web-based application that revolutionizes queue management and appointment booking for small to medium-sized institutions in developing countries. Now powered by Supabase for real-time database capabilities and scalable architecture.

## 🎯 Project Overview

This system seamlessly integrates appointment scheduling and real-time virtual queuing into a single platform, reducing physical congestion, improving customer experience, and providing valuable operational insights. Built with modern technologies including React, Node.js, and Supabase (PostgreSQL) for a robust and scalable solution.

## 🌟 Key Features

### For Clients
- **Online Appointment Booking** - Book, view, and manage appointments remotely
- **Virtual Queue Management** - Join virtual queues and track real-time position
- **Multi-language Support** - English + Local language support
- **Real-time Notifications** - SMS/Email notifications for updates
- **Mobile-first Design** - Responsive design for all devices

### For Staff/Admins
- **Admin Dashboard** - Overview of appointments and queue status
- **Queue Management** - Call next customer, serve, skip, or remove
- **Service Management** - CRUD operations for services and time slots
- **Analytics & Reporting** - Daily reports and performance metrics
- **User Management** - Manage staff accounts and permissions

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **Material-UI** - Component library for consistent design
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Nodemailer** - Email notifications
- **SMS Gateway** - SMS notifications (Africa's Talking/Twilio)

## 📁 Project Structure

```
digital-queue-system/
├── frontend/                 # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── locales/         # Language files
│   │   └── styles/          # CSS/styling
│   └── package.json
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── config/              # Configuration files
│   └── package.json
├── database/                 # Database scripts
│   ├── migrations/
│   └── seeds/
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-queue-system
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your database and API keys in .env
   npm run migrate
   npm run seed
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=digital_queue
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
SMS_API_KEY=your_sms_api_key
SMS_API_SECRET=your_sms_secret
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📊 Database Schema

The system uses MySQL with the following main tables:
- Users (customers and staff)
- Services
- Appointments
- Queue Tickets
- Notifications
- Analytics

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- SQL injection prevention

## 📱 Responsive Design

The application is designed mobile-first with:
- Responsive layouts for all screen sizes
- Touch-friendly interfaces
- Fast loading on 3G connections
- Accessible design following WCAG guidelines

## 🌍 Internationalization

- Multi-language support (English + Local language)
- Easy language switching
- Localized date/time formats
- Cultural considerations for UI/UX

## 📈 Analytics & Reporting

- Daily customer volume reports
- Average wait time analysis
- Service utilization metrics
- Customer satisfaction tracking
- Performance dashboards

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run integration tests
npm run test:integration
```

## 📦 Deployment

The application can be deployed on:
- VPS/Cloud servers (DigitalOcean, AWS, etc.)
- Shared hosting with Node.js support
- Docker containers

### Docker Deployment
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Project Lead**: Iddris Rashid
- **Type**: Academic Project
- **Target**: Small to medium-sized institutions in developing countries

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in the `/docs` folder

## 🎯 Success Metrics

- Reduction in average perceived wait time
- Increase in online appointment bookings
- Decrease in physical queue length
- User satisfaction score >4.5/5
- Notification delivery success rate >95%

---

**Built with ❤️ for improving service delivery in developing countries**
