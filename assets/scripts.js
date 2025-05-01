const versionList = document.getElementById("version-list");

function init() {
  versionList.addEventListener("click", onVersionClicked);
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
