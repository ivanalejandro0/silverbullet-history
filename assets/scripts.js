const versionList = document.getElementById("version-list");
const closeVersionList = document.getElementById("close-history");

function init() {
  versionList.addEventListener("click", onVersionClicked);
  closeVersionList.addEventListener("click", onCloseHistory);
}

function onVersionClicked(event) {
  const li = event.target.closest('li');
  if (!li || !versionList.contains(li)) {
    // this shouldn't happen
    return;
  }

  try {
    const hash = li.dataset.hash;
    console.log(hash)
    syscall("system.invokeFunction", "history.selectVersion", hash);
  } catch (e) {
    console.error(e);
  }
}

function onCloseHistory(event) {
  syscall("system.invokeFunction", "history.closeHistory");
}
