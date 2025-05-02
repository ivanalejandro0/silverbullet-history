const versionList = document.getElementById("version-list");
const closeVersionList = document.getElementById("close-history");

/**
 * Call this function as soon as you load the UI.
 * It's necessary for the History UI to be fully interactive.
 */
function init() {
  versionList.addEventListener("click", onVersionClicked);
  closeVersionList.addEventListener("click", onCloseClicked);
}

/**
 * Handle a version clicked, send the info to the plugin to take action.
 */
function onVersionClicked(event) {
  const li = event.target.closest('li');
  if (!li || !versionList.contains(li)) {
    // this shouldn't happen
    return;
  }

  try {
    const hash = li.dataset.hash;
    syscall("system.invokeFunction", "history.selectVersion", hash);
  } catch (e) {
    console.error(e);
  }
}

function onCloseClicked(event) {
  syscall("system.invokeFunction", "history.historyClose");
}
