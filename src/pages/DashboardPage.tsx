import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import { selectProfile } from '../redux/slices/userSlice';
import { 
  loadDashboardData, 
  selectDashboardData, 
  selectDashboardLoading,
  selectSectionLoading,
  selectSectionError 
} from '../redux/slices/dashboardSlice';
import NavigationBar from '../components/NavigationBar';
import RecentUpdates from '../components/RecentUpdates';
import QuickActions from '../components/QuickActions';
import UpcomingEvents from '../components/UpcomingEvents';
import OnlineNow from '../components/OnlineNow';
import AddRelativeModal from '../components/AddRelativeModal';
import { useAppDispatch, useAppSelector } from '../redux/store';
import './DashboardPage.scss';

interface MockUpdate {
  id: string;
  type: 'birthday' | 'photo' | 'new_member';
  data: any;
}

interface MockEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  isToday: boolean;
}

interface MockUser {
  id: string;
  name: string;
  photoUrl: string | null;
}

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const profile = useAppSelector(selectProfile);
  const dashboardData = useAppSelector(selectDashboardData);
  const isLoading = useAppSelector(selectDashboardLoading);
  const [isAddRelativeModalOpen, setIsAddRelativeModalOpen] = useState<boolean>(false);

  // Load dashboard data on mount
  useEffect(() => {
    dispatch(loadDashboardData());
  }, [dispatch]);
  
  // Get user's first name from profile or auth user
  const firstName = profile?.firstName || user?.fullName?.split(' ')[0] || 'User';
  const fullName = profile?.firstName && profile?.lastName 
    ? `${profile?.firstName} ${profile?.lastName}` 
    : user?.fullName || 'User';

  // Mock data for Recent Updates (will be replaced with Redux data)
  const mockUpdates: MockUpdate[] = [
    {
      id: '1',
      type: 'birthday',
      data: {
        relativeName: 'Elena Rivera',
        age: 54,
        date: new Date(2025, 9, 25).toISOString(),
      },
    },
    {
      id: '2',
      type: 'photo',
      data: {
        uploaderName: 'Antonio',
        albumName: 'Havana 1950s',
        photoUrls: [
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
          'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb',
        ],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      id: '3',
      type: 'new_member',
      data: {
        relativeName: 'Sofia Rivera',
        joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  ];

  const handleViewAll = () => {
    console.log('View all updates');
  };

  // Mock data for Upcoming Events (will be replaced with Redux data)
  const mockEvents: MockEvent[] = [
    {
      id: '1',
      name: "Elena's Birthday",
      date: new Date(2025, 9, 25).toISOString(),
      time: 'All Day',
      isToday: false,
    },
    {
      id: '2',
      name: 'Family Dinner',
      date: new Date(2025, 9, 28).toISOString(),
      time: "6:00 PM • Grandma's",
      isToday: false,
    },
    {
      id: '3',
      name: 'Halloween',
      date: new Date(2025, 9, 31).toISOString(),
      time: "7:00 PM • Mike's House",
      isToday: false,
    },
  ];

  // Mock data for Online Users (will be replaced with Redux data)
  const mockOnlineUsers: MockUser[] = [
    {
      id: '1',
      name: 'Maria',
      photoUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '2',
      name: 'Carlos',
      photoUrl: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: '3',
      name: 'Sofia',
      photoUrl: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '4',
      name: 'Diego',
      photoUrl: null,
    },
  ];

  const handleCalendarClick = () => {
    console.log('Calendar clicked');
  };

  const handleEventClick = (eventId: string) => {
    console.log('Event clicked:', eventId);
  };

  const handleUserClick = (userId: string) => {
    console.log('User clicked:', userId);
  };

  // Show loading state
  if (isLoading && !dashboardData) {
    return (
      <div className="dashboard-page">
        <NavigationBar />
        <main className="dashboard-main">
          <div className="dashboard-container">
            <div className="dashboard-loading">Loading dashboard...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <NavigationBar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header Section with Greeting */}
          <div className="dashboard-header">
            <h1 className="dashboard-greeting">Good Morning, {firstName}</h1>
            <p className="dashboard-date">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • You have 3 new updates
            </p>
          </div>

          {/* Quick Actions Row */}
          <div className="dashboard-quick-actions-row">
            <QuickActions onActionClick={(actionId: string) => {
              if (actionId === 'add-relative') {
                setIsAddRelativeModalOpen(true);
                return false; // Prevent navigation
              }
            }} />
          </div>

          {/* Add Relative Modal */}
          <AddRelativeModal 
            isOpen={isAddRelativeModalOpen} 
            onClose={() => setIsAddRelativeModalOpen(false)}
            userName={fullName}
          />

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* Left Column - Latest Activity */}
            <div className="dashboard-main-content">
              <RecentUpdates updates={mockUpdates} onViewAll={handleViewAll} />
            </div>

            {/* Right Column - Up Next & Online Now */}
            <div className="dashboard-sidebar">
              <UpcomingEvents
                events={mockEvents}
                onCalendarClick={handleCalendarClick}
                onEventClick={handleEventClick}
              />
              
              <OnlineNow
                onlineUsers={mockOnlineUsers}
                onUserClick={handleUserClick}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
