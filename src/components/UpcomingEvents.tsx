import React from 'react';
import './UpcomingEvents.scss';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  isToday?: boolean;
}

interface UpcomingEventsProps {
  events?: Event[];
  onCalendarClick?: () => void;
  onEventClick?: (eventId: string) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events = [], onCalendarClick, onEventClick }) => {
  if (events.length === 0) {
    return (
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Upcoming</h2>
          <button className="view-all-link" onClick={onCalendarClick}>
            Calendar
          </button>
        </div>
        <div className="upcoming-list">
          <p className="empty-state">No upcoming events</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2>Upcoming</h2>
        <button className="view-all-link" onClick={onCalendarClick}>
          Calendar
        </button>
      </div>
      <div className="upcoming-list">
        {events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onClick={() => onEventClick && onEventClick(event.id)}
          />
        ))}
      </div>
    </section>
  );
};

interface EventItemProps {
  event: Event;
  onClick: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  const { name, date, time, isToday } = event;
  
  const eventDate = new Date(date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };

  return (
    <div
      className={`event-item ${isToday ? 'event-today' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <div className="event-date">
        <div className="event-day">{day}</div>
        <div className="event-month">{month}</div>
      </div>
      <div className="event-details">
        <div className="event-name">{name}</div>
        <div className="event-time">{time}</div>
      </div>
    </div>
  );
};

export default UpcomingEvents;