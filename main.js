// Handles dynamic elements and config export/import

document.addEventListener("DOMContentLoaded", () => {
    // Loot System
    const lootList = document.getElementById("loot-list");
    document.getElementById("add-loot").addEventListener("click", () => {
      const item = createInputRow("Item Name", "Rarity");
      lootList.appendChild(item);
    });
  
    // Enemy System
    const enemyList = document.getElementById("enemy-list");
    document.getElementById("add-enemy").addEventListener("click", () => {
      const enemy = createInputRow("Enemy Name", "HP");
      enemyList.appendChild(enemy);
    });
  
    // Upgrade System
    const upgradeList = document.getElementById("upgrade-list");
    document.getElementById("add-upgrade").addEventListener("click", () => {
      const upgrade = document.createElement("div");
      upgrade.className = "row";
      upgrade.innerHTML = `
        <label>Upgrade Name <input type="text" class="upgrade-name" /></label>
        <label>Target 
          <select class="upgrade-target">
            <option value="Click Gold">Click Gold</option>
            <option value="Base Gold/sec">Base Gold/sec</option>
          </select>
        </label>
        <label>Value <input type="number" class="upgrade-value" /></label>
      `;
      upgradeList.appendChild(upgrade);
    });
  
    // Export Config
    document.getElementById("export-config").addEventListener("click", () => {
      const config = buildConfig();
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "gameConfig.json";
      link.click();
      URL.revokeObjectURL(url);
    });
  
    // Import Config
    document.getElementById("import-config").addEventListener("click", () => {
      document.getElementById("config-file").click();
    });
  
    document.getElementById("config-file").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const config = JSON.parse(event.target.result);
        applyConfig(config);
      };
      reader.readAsText(file);
    });
  });
  
  function createInputRow(label1, label2) {
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `
      <label>${label1} <input type="text" /></label>
      <label>${label2} <input type="text" /></label>
    `;
    return div;
  }
  
  function buildConfig() {
    const config = {
      goldRate: parseFloat(document.getElementById("base-gold-rate").value) || 0,
      clickRate: parseFloat(document.getElementById("click-gold-rate").value) || 0,
      bagSlots: parseInt(document.getElementById("bag-slots").value) || 4,
      gearSlotsEnabled: document.getElementById("enable-gear-slots").checked,
      loot: extractList("loot-list"),
      enemies: extractList("enemy-list"),
      upgrades: extractUpgrades()
    };
  
    const previewFrame = document.getElementById("game-frame");
    if (previewFrame && previewFrame.contentWindow) {
      previewFrame.contentWindow.postMessage(config, "*");
    }
  
    return config;
  }
  
  function extractList(id) {
    const container = document.getElementById(id);
    const rows = container.querySelectorAll(".row");
    const items = [];
    rows.forEach(row => {
      const inputs = row.querySelectorAll("input");
      items.push({ name: inputs[0].value, value: inputs[1].value });
    });
    return items;
  }
  
  function extractUpgrades() {
    const container = document.getElementById("upgrade-list");
    const rows = container.querySelectorAll(".row");
    const upgrades = [];
    rows.forEach(row => {
      const name = row.querySelector(".upgrade-name").value;
      const target = row.querySelector(".upgrade-target").value;
      const value = row.querySelector(".upgrade-value").value;
      upgrades.push({ name, target, value });
    });
    return upgrades;
  }
  
  function applyConfig(config) {
    document.getElementById("base-gold-rate").value = config.goldRate || 0;
    document.getElementById("click-gold-rate").value = config.clickRate || 0;
    document.getElementById("bag-slots").value = config.bagSlots || 4;
    document.getElementById("enable-gear-slots").checked = config.gearSlotsEnabled || false;
  
    populateList("loot-list", config.loot);
    populateList("enemy-list", config.enemies);
    populateUpgrades(config.upgrades);
  }
  
  function populateList(id, data) {
    const container = document.getElementById(id);
    container.innerHTML = "";
    data.forEach(item => {
      const row = createInputRow("Name", "Value");
      const inputs = row.querySelectorAll("input");
      inputs[0].value = item.name;
      inputs[1].value = item.value;
      container.appendChild(row);
    });
  }
  
  function populateUpgrades(data) {
    const container = document.getElementById("upgrade-list");
    container.innerHTML = "";
    data.forEach(item => {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
        <label>Upgrade Name <input type="text" class="upgrade-name" value="${item.name}" /></label>
        <label>Target 
          <select class="upgrade-target">
            <option value="Click Gold" ${item.target === 'Click Gold' ? 'selected' : ''}>Click Gold</option>
            <option value="Base Gold/sec" ${item.target === 'Base Gold/sec' ? 'selected' : ''}>Base Gold/sec</option>
          </select>
        </label>
        <label>Value <input type="number" class="upgrade-value" value="${item.value}" /></label>
      `;
      container.appendChild(row);
    });
  }
