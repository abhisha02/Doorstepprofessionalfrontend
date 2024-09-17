// src/services/WebSocketService.js
import ReconnectingWebSocket from 'reconnecting-websocket';
import store from '../Redux/Store';
import { updateNewMessageIndicator } from '../Redux/chatSlice';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.lastNotificationTime = 0;
    this.processedMessages = new Map();
    this.isProcessing = false;
    this.messageQueue = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5 seconds
  }

  connect(userId) {
    if (this.socket) {
      console.log('WebSocket already connected. Skipping reconnection.');
      return;
    }

    const wsUrl = `ws://https://doorsteppro.shop/ws/user/${userId}/`;
    
    const options = {
      reconnectInterval: this.reconnectInterval,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };

    this.socket = new ReconnectingWebSocket(wsUrl, [], options);
    
    this.socket.onopen = () => {
      console.log('WebSocket Connected');
      this.reconnectAttempts = 0;
    };
    
    this.socket.onclose = (event) => {
      console.log('WebSocket Disconnected:', event.code, event.reason);
      if (event.code === 1006) {
        console.log('Attempting to reconnect...');
      }
      this.handleReconnection();
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
    
    this.socket.onmessage = (e) => this.queueMessage(e);
  }

  handleReconnection() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(`Reconnection attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts}`);
    } else {
      console.log('Max reconnection attempts reached. Please check your connection and try again later.');
      this.disconnect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  queueMessage(e) {
    this.messageQueue.push(e);
    this.processQueue();
  }

  processQueue() {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const e = this.messageQueue.shift();
    this.handleMessage(e)
      .then(() => {
        this.isProcessing = false;
        this.processQueue();
      })
      .catch((error) => {
        console.error('Error processing message:', error);
        this.isProcessing = false;
        this.processQueue();
      });
  }

  async handleMessage(e) {
    console.log('Handling message:', e.data);
    try {
      const data = JSON.parse(e.data);
      console.log('Parsed message:', JSON.stringify(data, null, 2));
      
      const messageId = data.id || `${data.type}_${Date.now()}`;
      
      if (this.processedMessages.has(messageId)) {
        console.log('Duplicate message received, ignoring:', messageId);
        return;
      }
      
      this.processedMessages.set(messageId, Date.now());
      
      console.log('Processing message:', messageId);
      await this.handleGlobalNotification(data);
      
      for (const [id, callback] of this.listeners) {
        console.log(`Calling listener: ${id}`);
        await callback(data);
      }
      
      this.cleanupProcessedMessages();
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  cleanupProcessedMessages() {
    const now = Date.now();
    for (const [id, timestamp] of this.processedMessages.entries()) {
      if (now - timestamp > 60000) { // Remove after 1 minute
        this.processedMessages.delete(id);
      }
    }
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  }

  addListener(id, callback) {
    console.log(`Adding listener: ${id}`);
    this.listeners.set(id, callback);
  }

  removeListener(id) {
    console.log(`Removing listener: ${id}`);
    this.listeners.delete(id);
  }

  async handleGlobalNotification(data) {
    if (data.type === 'new_message_notification') {
      const currentUserId = store.getState().user_basic_details.id;
      if (data.receiver_id === currentUserId) {
        const now = Date.now();
        if (now - this.lastNotificationTime > 1000) { // 1 second debounce
          console.log('Triggering notification for message:', data.id);
          
          await this.showBrowserNotification(data.sender_name, data.message);
          await this.playNotificationSound();
          this.updateUIForNewMessage(data.booking_id);
          
          this.lastNotificationTime = now;
        } else {
          console.log('Notification debounced for message:', data.id);
        }
      }
    }
  }

  async showBrowserNotification(title, body) {
    console.log('Showing browser notification:', title, body);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: body });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(title, { body: body });
      }
    }
  }

  async playNotificationSound() {
    console.log('Playing notification sound');
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);

    return new Promise(resolve => setTimeout(resolve, 500));
  }

  updateUIForNewMessage(bookingId) {
    console.log('Updating UI for new message:', bookingId);
    store.dispatch(updateNewMessageIndicator(bookingId));
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;

