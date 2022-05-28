(() => {
  function makeElem(html) {
    const elem = document.createElement("_");
    elem.innerHTML = html;
    return elem.firstElementChild;
  }

  document.getElementById("app-mount").remove();

  const styles = `#lamivudine{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;font-family:var(--font-primary);color:white}#lamivudine-header{font-size:45px;font-weight:bold}#lamivudine-plugin-container{overflow-y:auto;display:flex;flex-direction:column;gap:8px}.lamivudine-plugin{text-align:center;padding:10px;border-radius:0.375rem;background-color:var(--background-secondary)}.lamivudine-button{background:var(--button-secondary-background);color:white;border-radius:2px;font-weight:bold}.lamivudine-danger{background:var(--button-danger-background)}#lamivudine-subheader{font-size:20px;font-weight:bold;color:white;margin-bottom:10px;}`;

  const lamivudineContainer = makeElem(`
      <div id="lamivudine">
        <style>${styles}</style>
        <h1 id="lamivudine-header">Lamivudine</h1>
        <h2 id="lamivudine-subheader">Press Ctrl + R to reload after making changes</h2>
        <div id="lamivudine-plugin-container"></div>
      </div>
    `);

  document.body.prepend(lamivudineContainer);

  const pluginContainer = lamivudineContainer.lastElementChild;

  const pluginList = cumcord.plugins.installed.ghost;

  for (const plugin in pluginList) {
    // dont template in the title because unlike ${styles}, this could actually cause an XSS
    const pluginElement = makeElem(`
        <div class="lamivudine-plugin">
            <h2></h2>
            <input type="checkbox" />
            <button class="lamivudine-button lamivudine-danger"">Delete</button>
        </div>
      `);

    pluginContainer.appendChild(pluginElement);

    pluginElement.querySelector(
      "h2"
    ).innerText = `${pluginList[plugin].manifest.name} (${plugin})`;

    const enabledCheckbox = pluginElement.querySelector("input");
    enabledCheckbox.checked = pluginList[plugin].enabled;
    enabledCheckbox.onchange = () => {
      cumcord.plugins.installed.store[plugin].enabled = enabledCheckbox.checked;
    };

    pluginElement.querySelector("button").onclick = () => {
      cumcord.plugins.removePlugin(plugin);
      pluginContainer.removeChild(pluginElement);
    };
  }
})();
