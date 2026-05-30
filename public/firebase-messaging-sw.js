self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const notification = data.notification || data;
  const title = notification.title || 'LMO Quran Learning';
  const options = {
    body: notification.body || 'Nouvelle notification disponible.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/dashboard'));
});
