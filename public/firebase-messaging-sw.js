self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const notification = data.notification || data;
  const title = notification.title || 'LMO Quran Learning';
  const options = {
    body: notification.body || 'Nouvelle notification disponible.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: notification.url || data.url || data.data?.url || '/memorization',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/memorization';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client && client.url.includes(self.location.origin)) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
