import React, { useState, useEffect } from 'react';

const EventListenerComponent = () => {
  const [eventMessage, setEventMessage] = useState('');

  useEffect(() => {
    // Fetch the event message from the backend
    const fetchEventMessage = async () => {
      try {
        const response = await fetch('http://localhost:3001/listen-for-event');
        if (response.ok) {
          const data = await response.json();
          setEventMessage(data.message);
        } else {
          console.error('Failed to fetch event message');
        }
      } catch (error) {
        console.error('Error fetching event message:', error);
      }
    };

    // Call the fetchEventMessage function to listen for events when the component mounts
    fetchEventMessage();

    // Listen for events periodically (adjust the interval based on your needs)
    const eventInterval = setInterval(fetchEventMessage, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(eventInterval);
  }, []); // The empty dependency array ensures that this effect runs only once on mount

  return (
    <div>
      <h1>Event Listener Component</h1>
      <div>
        <strong>Received Event Message:</strong> {eventMessage}
      </div>
    </div>
  );
};

export default EventListenerComponent;