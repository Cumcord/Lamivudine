(() => {
  document.getElementById("app-mount").remove();

  const lamivudineContainer = document.createElement("div");
  lamivudineContainer.id = "lamivudine";
  document.body.prepend(lamivudineContainer);

  const styles = `#lamivudine{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;font-family:var(--font-primary);color:white}#lamivudine-header{font-size:45px;font-weight:bold}#lamivudine-plugin-container{overflow-y:auto;display:flex;flex-direction:column;gap:8px}.lamivudine-plugin{text-align:center;padding:10px;border-radius:0.375rem;background-color:var(--background-secondary)}.lamivudine-danger{background-color:var(--button-danger-background);color:white;border-radius:2px;font-weight:bold}#lamivudine-subheader{font-size:20px;font-weight:bold;color:white;margin-bottom:10px;}`;
  const styleEl = document.createElement("style");
  styleEl.innerHTML = styles;

  document.body.appendChild(styleEl);

  const header = document.createElement("h1");
  header.id = "lamivudine-header";
  header.innerText = "Lamivudine";

  const subheader = document.createElement("h2");
  subheader.innerText = "Press Ctrl + R to reload after making changes";
  subheader.id = "lamivudine-subheader";

  lamivudineContainer.appendChild(header);
  lamivudineContainer.appendChild(subheader);

  const pluginContainer = document.createElement("div");
  pluginContainer.id = "lamivudine-plugin-container";
  lamivudineContainer.appendChild(pluginContainer);
  
  const pluginList = cumcord.plugins.installed.ghost;

  for (const plugin in pluginList) {
    const pluginElement = document.createElement("div");
    pluginElement.className = `lamivudine-plugin`;

    const pluginHeader = document.createElement("h2");
    pluginHeader.innerText = `${pluginList[plugin].manifest.name} (${plugin})`;
    pluginElement.appendChild(pluginHeader);

    const enabledCheckbox = document.createElement("input");
    enabledCheckbox.type = "checkbox";
    enabledCheckbox.checked = pluginList[plugin].enabled;
    enabledCheckbox.addEventListener("change", () => {
      cumcord.plugins.installed.store[plugin].enabled = enabledCheckbox.checked;
    });
    pluginElement.appendChild(enabledCheckbox);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "lamivudine-danger";
    deleteButton.addEventListener("click", () => {
      cumcord.plugins.removePlugin(plugin);
      pluginContainer.removeChild(pluginElement);
    });
    pluginElement.appendChild(deleteButton);

    pluginContainer.appendChild(pluginElement);
  }
})();
