navigator.serviceWorker.register("sw.js")

const SERVICE_WORKER_MESSAGES = {
  START_NOTIFYING: "start_notifying",
  STOP_NOTIFYING: "stop_notifying",
}

function startBackgroundNotifications() {
  sendServiceWorkerMessage(SERVICE_WORKER_MESSAGES.START_NOTIFYING)
  document.getElementById("running_state_display").innerHTML = "Running"
}

function stopBackgroundNotifications() {
  sendServiceWorkerMessage(SERVICE_WORKER_MESSAGES.STOP_NOTIFYING)
  document.getElementById("running_state_display").innerHTML = "Paused"
}

function sendServiceWorkerMessage(message) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.active.postMessage(message)
  })
}

const logs = document.getElementById("logs")

function notify() {
  const delaySeconds = parseInt(document.getElementById("delay_seconds").value)
  setTimeout(() => {
    const n = new Notification("Hello")
    n.onshow = () => logs.insertAdjacentHTML("afterend", `<p>Shown ${new Date().toISOString()}</p>`)
    n.onclick = () => logs.insertAdjacentHTML("afterend", `<p>Clicked ${new Date().toISOString()}</p>`)
    n.onclose = () => logs.insertAdjacentHTML("afterend", `<p>Closed ${new Date().toISOString()}</p>`)
    n.onerror = () =>
      logs.insertAdjacentHTML("afterend", `<p>Error ${new Date().toISOString()} ${Notification.permission}</p>`)
  }, delaySeconds * 1000)
}

let db
const request = indexedDB.open("experiment", 1)

request.addEventListener("upgradeneeded", (init) => {
  db = init.target.result

  db.onerror = () => {
    console.error("Error loading database.")
  }

  const table = db.createObjectStore("notifications")

  table.createIndex("content", "content", { unique: false })
  table.createIndex("reaction", "reaction", { unique: false })
})

request.onsuccess = function () {
  db = request.result
}

function getNotifications() {
  const transaction = db.transaction("notifications", "readonly")
  const objectStore = transaction.objectStore("notifications")
  objectStore.getAll().onsuccess = function (event) {
    document.getElementById("notifications").innerHTML = event.target.result
      .map((line) => `${JSON.stringify(line)}`)
      .join("\n")
  }
}
