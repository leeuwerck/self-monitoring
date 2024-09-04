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

function getNotifications() {
  let db
  const request = indexedDB.open("experiment", 1)

  request.onsuccess = function () {
    db = request.result
    const transaction = db.transaction(["notifications"], "readonly")
    const objectStore = transaction.objectStore("notifications")
    objectStore.getAll().onsuccess = function (event) {
      document.getElementById("notifications").innerHTML = event.target.result
        .map((line) => `${JSON.stringify(line)}`)
        .join("\n")
    }
  }
  request.onerror = function (error) {
    console.log(error)
  }
}
