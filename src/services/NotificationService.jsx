// src/services/NotificationService.js
class NotificationService {
    constructor() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  
    playNotificationSound() {
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
    }
  
    showBrowserNotification(title, body) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: body });
      }
    }
  }
  
  export default new NotificationService();