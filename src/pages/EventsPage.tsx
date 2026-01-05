import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import CreateEventModal from '../components/CreateEventModal';
import './EventsPage.scss';

interface EventData {
  id: string;
  title: string;
  date: string;
  month: string;
  fullDate: string;
  location: string;
  description?: string;
  image: string;
  invitedBy?: string;
  inviterPhoto?: string;
  hostedBy?: string;
  hostPhoto?: string;
  attending: number;
  attendees: string[];
  isNew?: boolean;
}

interface EventsData {
  pending: EventData[];
  upcoming: EventData[];
}

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState<boolean>(false);
  const [events] = useState<EventsData>({
    pending: [
      {
        id: '1',
        title: "Cousin Mike's Graduation Party",
        date: '12',
        month: 'NOV',
        fullDate: 'Saturday, 6:00 PM',
        location: 'The Rivera House, 42 Maple St.',
        description: '"We\'re so proud of Mike! Join us to celebrate his achievement. We\'ll be sharing photos and coordinating a group gift here."',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        invitedBy: 'Sarah Rivera',
        inviterPhoto: 'https://i.pravatar.cc/150?img=5',
        attending: 12,
        attendees: [
          'https://i.pravatar.cc/150?img=1',
          'https://i.pravatar.cc/150?img=2',
          'https://i.pravatar.cc/150?img=3',
        ],
        isNew: true,
      },
    ],
    upcoming: [
      {
        id: '2',
        title: 'Annual Thanksgiving Dinner',
        date: '24',
        month: 'NOV',
        fullDate: 'Thursday, 4:00 PM',
        location: "Grandma's House",
        image: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=800',
        hostedBy: 'Elena Rivera',
        hostPhoto: 'https://i.pravatar.cc/150?img=1',
        attending: 15,
        attendees: [
          'https://i.pravatar.cc/150?img=1',
          'https://i.pravatar.cc/150?img=2',
          'https://i.pravatar.cc/150?img=3',
        ],
      },
      {
        id: '3',
        title: "Leo's 5th Birthday",
        date: '05',
        month: 'DEC',
        fullDate: 'Sunday, 2:00 PM',
        location: 'City Park, Picnic Area B',
        image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
        hostedBy: 'Maria',
        hostPhoto: 'https://i.pravatar.cc/150?img=5',
        attending: 18,
        attendees: [
          'https://i.pravatar.cc/150?img=1',
          'https://i.pravatar.cc/150?img=2',
          'https://i.pravatar.cc/150?img=3',
        ],
      },
    ],
  });

  const handleCreateEvent = () => {
    setIsCreateEventModalOpen(true);
  };

  const handleJoinEvent = (eventId: string) => {
    console.log('Join event:', eventId);
  };

  const handleDeclineEvent = (eventId: string) => {
    console.log('Decline event:', eventId);
  };

  const handleViewDetails = (eventId: string) => {
    console.log('View details:', eventId);
  };

  return (
    <div className="events-page">
      <NavigationBar />
      <CreateEventModal 
        isOpen={isCreateEventModalOpen} 
        onClose={() => setIsCreateEventModalOpen(false)}
      />
      <main className="events-main">
        <div className="events-container">
          {/* Header */}
          <div className="events-header">
            <div>
              <h1 className="events-title">Family Events</h1>
              <p className="events-subtitle">Coordinate celebrations, reunions, and get-togethers.</p>
            </div>
            <button className="btn-create-event" onClick={handleCreateEvent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </button>
          </div>

          {/* Pending Invitations */}
          {events.pending.length > 0 && (
            <section className="events-section">
              <h2 className="section-title">
                Pending Invitations
                <span className="badge-count">{events.pending.length}</span>
              </h2>
              <div className="events-grid">
                {events.pending.map((event) => (
                  <div key={event.id} className="event-card event-card-pending">
                    <div className="event-image-container">
                      <img src={event.image} alt={event.title} className="event-image" />
                      {event.isNew && <span className="badge-new">NEW INVITE</span>}
                      <div className="event-date-badge">
                        <div className="date-number">{event.date}</div>
                        <div className="date-month">{event.month}</div>
                      </div>
                    </div>
                    <div className="event-content">
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-meta">
                        <div className="event-meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                          </svg>
                          <span>{event.fullDate}</span>
                        </div>
                        <div className="event-meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="event-description">{event.description}</div>
                      <div className="event-host">
                        <img src={event.inviterPhoto} alt={event.invitedBy} className="host-avatar" />
                        <span>Invited by <strong>{event.invitedBy}</strong></span>
                      </div>
                      <div className="event-footer">
                        <div className="event-attendees">
                          <div className="attendees-avatars">
                            {event.attendees.map((avatar, index) => (
                              <img key={index} src={avatar} alt="" className="attendee-avatar" />
                            ))}
                          </div>
                          <span className="attendees-count">{event.attending} attending</span>
                        </div>
                        <div className="event-actions">
                          <button 
                            className="btn-decline" 
                            onClick={() => handleDeclineEvent(event.id)}
                          >
                            Decline
                          </button>
                          <button 
                            className="btn-join" 
                            onClick={() => handleJoinEvent(event.id)}
                          >
                            Join Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Events */}
          <section className="events-section">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="events-grid">
              {events.upcoming.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image-container">
                    <img src={event.image} alt={event.title} className="event-image" />
                    <div className="event-date-badge">
                      <div className="date-number">{event.date}</div>
                      <div className="date-month">{event.month}</div>
                    </div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <div className="event-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                        </svg>
                        <span>{event.fullDate}</span>
                      </div>
                      <div className="event-meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="event-host">
                      <img src={event.hostPhoto} alt={event.hostedBy} className="host-avatar" />
                      <span>Hosted by <strong>{event.hostedBy}</strong></span>
                    </div>
                    <div className="event-footer">
                      <div className="event-attendees">
                        <div className="attendees-avatars">
                          {event.attendees.map((avatar, index) => (
                            <img key={index} src={avatar} alt="" className="attendee-avatar" />
                          ))}
                        </div>
                        <span className="attendees-count">+{event.attending}</span>
                      </div>
                      <button 
                        className="btn-view-details" 
                        onClick={() => handleViewDetails(event.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;
