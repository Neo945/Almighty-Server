if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('service worker not registered', err));
}

Notification.requestPermission(function(status) {
  console.log('Notification permission status:', status);
});
function displayNotification(data) {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      reg.showNotification('You have ' + data.length + ' dishes in your cart');
    });
  }
}