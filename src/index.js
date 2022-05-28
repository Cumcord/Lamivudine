(() => {
  function makeElem(html) {
    const elem = document.createElement("_");
    elem.innerHTML = html;
    return elem.firstElementChild;
  }

  document.getElementById("app-mount").remove();

  const styles = `#lamivudine{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;font-family:var(--font-primary);color:white}#lamivudine-header{font-size:45px;font-weight:bold}#lamivudine-subheader{font-size:20px;font-weight:bold;color:white;margin-bottom:10px;}.lamivudine-txt{text-align:center}#lamivudine-plugin-container{overflow-y:auto;display:flex;flex-direction:column;gap:8px}.lamivudine-plugin{text-align:center;padding:10px;border-radius:0.375rem;background-color:var(--background-secondary)}.lamivudine-button{background:var(--button-secondary-background);color:white;border-radius:2px;font-weight:bold}.lamivudine-danger{background:var(--button-danger-background)}.lamivudine-edit{display:block;width:calc(100% - .5rem);background:#222;color:white;height:10rem}`;

  const lamivudineContainer = makeElem(`
      <div id="lamivudine">
        <style>${styles}</style>
        <h1 id="lamivudine-header">Lamivudine</h1>
        <h2 id="lamivudine-subheader">Press Ctrl + R to reload after making changes</h2>
        <p class="lamivudine-txt">
          When editing a nest: if you submit only whitespace, the nest will be reset to {},
          <br />
          if you submit other invalid JSON, the nest will not be modified.
        </p>
        <div id="lamivudine-plugin-container"></div>
      </div>
    `);

  document.body.prepend(lamivudineContainer);

  const pluginContainer = lamivudineContainer.lastElementChild;

  const pluginList = cumcord.plugins.installed.ghost;

  for (const plugin in pluginList) {
    (async () => {
      const nestKey = `${plugin}_CUMCORD_STORE`;

      const hasNest =
        (await cumcord.modules.internal.idbKeyval.get(nestKey)) !== undefined;

      // dont template in the title because unlike ${styles}, this could actually cause an XSS
      const pluginElement = makeElem(`
        <div class="lamivudine-plugin">
            <h2></h2>
            <input type="checkbox" />
            <button class="lamivudine-button lamivudine-danger"">Delete</button>
            <button class="lamivudine-button" ${
              hasNest ? "" : 'style="display:none"'
            }>Edit nest</button>
            <textarea class="lamivudine-edit" style="display:none"></textarea>
        </div>
      `);

      pluginContainer.appendChild(pluginElement);

      pluginElement.querySelector(
        "h2"
      ).innerText = `${pluginList[plugin].manifest.name} (${plugin})`;

      const enabledCheckbox = pluginElement.querySelector("input");
      enabledCheckbox.checked = pluginList[plugin].enabled;
      enabledCheckbox.onchange = () => {
        cumcord.plugins.installed.store[plugin].enabled =
          enabledCheckbox.checked;
      };

      pluginElement.querySelector("button").onclick = () => {
        cumcord.plugins.removePlugin(plugin);
        pluginContainer.removeChild(pluginElement);
      };

      const editButton = pluginElement.querySelectorAll("button")[1];
      const editor = pluginElement.querySelector("textarea");

      let isEditing = false;
      editButton.onclick = async () => {
        if (isEditing) {
          let newObj;
          try {
            newObj = JSON.parse(editor.value);
          } catch {
            if (editor.value.trim() === "") newObj = {};
          }
          if (newObj)
            await cumcord.modules.internal.idbKeyval.set(nestKey, newObj);
          editor.innerText = "";
        }

        isEditing = !isEditing;
        editButton.innerText = isEditing ? "Save nest" : "Edit nest";
        editor.style.display = isEditing ? "" : "none";

        if (isEditing)
          editor.value =
            JSON.stringify(
              await cumcord.modules.internal.idbKeyval.get(nestKey),
              null,
              2 // indent with 2 spaces
            ) ?? "";
      };
    })();
  }
})();
