import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Container,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  AccessTime,
  People,
  Star,
  EventNote,
  Queue as QueueIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Service {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  category: string;
  color_code: string;
  requires_appointment: boolean;
  currentQueueSize: number;
  totalServedToday: number;
  max_daily_capacity: number;
}

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiService.getServices(),
  });

  const {
    data: categoriesData,
  } = useQuery({
    queryKey: ['service-categories'],
    queryFn: () => apiService.getServiceCategories(),
  });

  const services: Service[] = servicesData?.data?.services || [];
  const categories = categoriesData?.data?.categories || [];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleBookAppointment = (serviceId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book-appointment/${serviceId}`);
  };

  const handleJoinQueue = (serviceId: number) => {
    navigate(`/queue/${serviceId}`);
  };

  if (servicesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (servicesError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load services. Please try again later.
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 2 }}>
        {/* Header */}
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Our Services
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Choose from our range of services and book appointments or join virtual queues
        </Typography>

        {/* Search and Filter */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 auto' }, minWidth: 200 }}>
              <TextField
                fullWidth
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 200px' } }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category: any) => (
                    <MenuItem key={category.category} value={category.category}>
                      {category.category} ({category.service_count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' } }}>
              <Typography variant="body2" color="text.secondary">
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Services Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredServices.map((service) => (
            <Box key={service.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Service Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: service.color_code,
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {service.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3">
                        {service.name}
                      </Typography>
                      <Chip
                        label={service.category}
                        size="small"
                        sx={{
                          bgcolor: service.color_code,
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Service Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {service.description}
                  </Typography>

                  {/* Service Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Duration: {service.duration_minutes} minutes
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Queue: {service.currentQueueSize} waiting
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Served today: {service.totalServedToday}/{service.max_daily_capacity}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Queue Status */}
                  <Box sx={{ mb: 2 }}>
                    {service.currentQueueSize === 0 ? (
                      <Chip
                        label="No Queue"
                        color="success"
                        size="small"
                        icon={<QueueIcon />}
                      />
                    ) : service.currentQueueSize < 5 ? (
                      <Chip
                        label="Short Queue"
                        color="warning"
                        size="small"
                        icon={<QueueIcon />}
                      />
                    ) : (
                      <Chip
                        label="Long Queue"
                        color="error"
                        size="small"
                        icon={<QueueIcon />}
                      />
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    {service.requires_appointment && (
                      <Box sx={{ flex: '0 0 calc(50% - 4px)' }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          startIcon={<EventNote />}
                          onClick={() => handleBookAppointment(service.id)}
                          sx={{
                            bgcolor: service.color_code,
                            '&:hover': {
                              bgcolor: service.color_code,
                              opacity: 0.9,
                            },
                          }}
                        >
                          Book
                        </Button>
                      </Box>
                    )}
                    <Box sx={{ flex: service.requires_appointment ? '0 0 calc(50% - 4px)' : '1' }}>
                      <Button
                        fullWidth
                        variant={service.requires_appointment ? "outlined" : "contained"}
                        size="small"
                        startIcon={<QueueIcon />}
                        onClick={() => handleJoinQueue(service.id)}
                        sx={service.requires_appointment ? {
                          borderColor: service.color_code,
                          color: service.color_code,
                          '&:hover': {
                            borderColor: service.color_code,
                            bgcolor: `${service.color_code}10`,
                          },
                        } : {
                          bgcolor: service.color_code,
                          '&:hover': {
                            bgcolor: service.color_code,
                            opacity: 0.9,
                          },
                        }}
                      >
                        Queue
                      </Button>
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>

        {filteredServices.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No services found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Services;
