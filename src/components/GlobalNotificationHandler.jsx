// src/components/GlobalNotificationHandler.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import WebSocketService from '../services/WebSocketService';
import NotificationService from '../services/NotificationService';

function GlobalNotificationHandler() {
  const currentUserId = useSelector(state => state.user.id);
  const openChats = useSelector(state => state.chats.openChats);

  useEffect(() => {
    const handleGlobalMessage = (data) => {
      if (data.receiver_id === currentUserId && !openChats.includes(data.booking_id)) {
        NotificationService.playNotificationSound();
        NotificationService.showBrowserNotification(data.sender_name, data.message);
      }
    };

    WebSocketService.addGlobalMessageListener(handleGlobalMessage);

    return () => {
      // Clean up if necessary
    };
  }, [currentUserId, openChats]);

  return null; // This component doesn't render anything
}

export default GlobalNotificationHandler;