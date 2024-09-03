const NOTIFICATION_DISPLAY_DURATION = 3000
const NOTIFICATION_FREQUENCY = 2000

let db
const openOrCreateDB = indexedDB.open("experiment", 1)

openOrCreateDB.addEventListener("error", () => console.error("Error opening DB"))

openOrCreateDB.addEventListener("success", () => {
  console.log("Successfully opened DB")
  db = openOrCreateDB.result
})

openOrCreateDB.addEventListener("upgradeneeded", (init) => {
  db = init.target.result

  db.onerror = () => {
    console.error("Error loading database.")
  }

  const table = db.createObjectStore("notifications")

  table.createIndex("content", "content", { unique: false })
  table.createIndex("reaction", "reaction", { unique: false })
})

let running = false

self.addEventListener("notificationclick", (event) => {
  console.log("clicked", event)
  addNotification(event?.notification?.tag, "none", "clicked")

  event.notification.close()
})
self.addEventListener("notificationclose", (event) => {
  addNotification(event?.notification?.tag, "none", "closed")
  console.log("closed", event)
})

self.addEventListener("message", (event) => {
  switch (event.data) {
    case "start_notifying":
      running = true
      notify()
      break
    case "stop_notifying":
      running = false
      break

    default:
      console.error(event.data, "no matching event type")
  }
})

function notify() {
  if (!running) return
  const randomId = self.crypto.randomUUID()
  console.log("notify ", randomId)
  self.registration.showNotification("SW", { body: `Body ${randomId}`, tag: randomId }).then(() =>
    new Promise((resolve) => setTimeout(resolve, NOTIFICATION_DISPLAY_DURATION)) // keep service worker alive
      .then(() => self.registration.getNotifications())
      .then((notifications) => {
        const notification = notifications.find((notification) => notification.tag === randomId)
        if (notification) {
          addNotification(notification.tag, "none", "expired")
          notification.close()
        }
      })
  )
  setTimeout(notify, NOTIFICATION_FREQUENCY)
}

function addNotification(id, content, reaction) {
  const newNotification = { id, content, reaction, displayDate: new Date() }
  const transaction = db.transaction(["notifications"], "readwrite")
  const objectStore = transaction.objectStore("notifications")
  const query = objectStore.add(newNotification)
  transaction.addEventListener("complete", () => {
    console.log("notification saved", newNotification)
  })
  transaction.addEventListener("error", () => console.log("Transaction error"))
}
