self.addEventListener("notificationclick", (event) => {
  console.log("clicked", event)
  event.notification.close()
})
self.addEventListener("notificationclose", (event) => {
  console.log("closed", event)
})

function notify() {
  console.log("notify")
  self.registration.showNotification("hello sw")
  setTimeout(notify, 5000)
}

notify()
