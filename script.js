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
