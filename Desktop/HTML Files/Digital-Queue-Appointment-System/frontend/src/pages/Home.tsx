import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Chip,
  Avatar,
  Paper,
  useTheme,
} from '@mui/material';
import {
  EventNote,
  Queue as QueueIcon,
  Timer,
  People,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: <EventNote color="primary" sx={{ fontSize: 40 }} />,
      title: 'Book Appointments',
      description: 'Schedule your appointments online and avoid waiting in long queues.',
      action: () => navigate('/services'),
      buttonText: 'Book Now',
      color: '#007bff',
    },
    {
      icon: <QueueIcon color="secondary" sx={{ fontSize: 40 }} />,
      title: 'Join Virtual Queue',
      description: 'Join queues virtually and track your position in real-time.',
      action: () => navigate('/queue'),
      buttonText: 'Join Queue',
      color: '#28a745',
    },
    {
      icon: <Timer color="warning" sx={{ fontSize: 40 }} />,
      title: 'Real-time Updates',
      description: 'Get notified when your turn is approaching via SMS and email.',
      action: () => navigate('/services'),
      buttonText: 'Learn More',
      color: '#ffc107',
    },
    {
      icon: <People color="info" sx={{ fontSize: 40 }} />,
      title: 'Multi-language Support',
      description: 'Use the system in your preferred language for better accessibility.',
      action: () => navigate('/services'),
      buttonText: 'Explore',
      color: '#17a2b8',
    },
  ];

  const stats = [
    { icon: <CheckCircle />, number: '500+', label: 'Appointments Completed' },
    { icon: <People />, number: '1000+', label: 'Happy Customers' },
    { icon: <Timer />, number: '45%', label: 'Reduced Wait Time' },
    { icon: <TrendingUp />, number: '98%', label: 'Customer Satisfaction' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" flexWrap="wrap" gap={4} alignItems="center">
            <Box flex="1" minWidth="300px">
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Welcome to Digital Queue System
              </Typography>
              <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
                Skip the physical queues, book appointments online, and track your position in real-time. 
                Making service delivery efficient and customer-friendly.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ 
                        bgcolor: 'white', 
                        color: theme.palette.primary.main,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                      }}
                      onClick={() => navigate('/register')}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ 
                        borderColor: 'white', 
                        color: 'white',
                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                      }}
                      onClick={() => navigate('/services')}
                    >
                      View Services
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ 
                        bgcolor: 'white', 
                        color: theme.palette.primary.main,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                      }}
                      onClick={() => navigate('/appointments')}
                    >
                      My Appointments
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ 
                        borderColor: 'white', 
                        color: 'white',
                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                      }}
                      onClick={() => navigate('/queue')}
                    >
                      Check Queue
                    </Button>
                  </>
                )}
              </Box>
            </Box>
            <Box flex="1" minWidth="300px">
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 300,
                    height: 300,
                    fontSize: '6rem',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    margin: '0 auto',
                  }}
                >
                  🎫
                </Avatar>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && user && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: theme.palette.success.light, color: 'white' }}>
          <Typography variant="h5" gutterBottom>
            Welcome back, {user.firstName}! 👋
          </Typography>
          <Typography variant="body1">
            {user.role === 'admin' || user.role === 'staff' 
              ? 'Access your admin dashboard to manage queues and appointments.'
              : 'Book new appointments or check your queue status below.'
            }
          </Typography>
          <Box sx={{ mt: 2 }}>
            {user.role === 'admin' || user.role === 'staff' ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/admin/dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Chip label={`Role: ${user.role}`} color="secondary" />
            )}
          </Box>
        </Paper>
      )}

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          Everything you need for efficient queue and appointment management
        </Typography>
        
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={3}>
          {features.map((feature, index) => (
            <Box key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={feature.action}
                    sx={{
                      bgcolor: feature.color,
                      '&:hover': {
                        bgcolor: feature.color,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Stats Section */}
      <Paper sx={{ p: 4, mb: 6, bgcolor: theme.palette.grey[50] }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Our Impact
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Box key={index}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    margin: '0 auto 16px',
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" component="div" color="primary" fontWeight="bold">
                  {stat.number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: theme.palette.secondary.main,
          color: 'white',
          p: 6,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          Join thousands of satisfied customers who have switched to digital queuing
        </Typography>
        {!isAuthenticated ? (
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: theme.palette.secondary.main,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
            onClick={() => navigate('/register')}
          >
            Create Account
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: theme.palette.secondary.main,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
            onClick={() => navigate('/services')}
          >
            Explore Services
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Home;
