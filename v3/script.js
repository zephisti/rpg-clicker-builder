// script.js
let gold = 0;
let clickPower = 1;
let goldPerSecond = 0;
let totalDamage = 0;
let totalGoldEarned = 0;
let inventory = [];
let equippedGear = {
  weapon: null,
  armor: null
};

let enemy = {
  hp: 10,
  maxHp: 10
};

const goldEl = document.getElementById("gold");
const clickPowerEl = document.getElementById("click-power");
const damageDoneEl = document.getElementById("damage-done");
const goldEarnedEl = document.getElementById("gold-earned");
const inventoryEl = document.getElementById("inventory");
const enemyHealthFill = document.getElementById("enemy-health-fill");
const achievementsList = document.getElementById("achievements-list");

const achievements = [
  { id: "gold100", condition: () => totalGoldEarned >= 100, text: "Earn 100 Gold" },
  { id: "damage500", condition: () => totalDamage >= 500, text: "Deal 500 Damage" },
  { id: "equipWeapon", condition: () => equippedGear.weapon !== null, text: "Equip a Weapon" },
  { id: "equipArmor", condition: () => equippedGear.armor !== null, text: "Equip Armor" }
];
let unlockedAchievements = new Set();

function checkAchievements() {
  achievements.forEach(ach => {
    if (!unlockedAchievements.has(ach.id) && ach.condition()) {
      unlockedAchievements.add(ach.id);
      const li = document.createElement("li");
      li.textContent = `✅ ${ach.text}`;
      achievementsList.appendChild(li);
    }
  });
}

function updateUI() {
  goldEl.textContent = gold;
  clickPowerEl.textContent = clickPower;
  damageDoneEl.textContent = totalDamage;
  goldEarnedEl.textContent = totalGoldEarned;
  enemyHealthFill.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
  checkAchievements();
}

function attackEnemy() {
  enemy.hp -= clickPower;
  totalDamage += clickPower;
  if (enemy.hp <= 0) {
    const reward = 5;
    gold += reward;
    totalGoldEarned += reward;
    spawnLoot();
    enemy.hp = enemy.maxHp;
  }
  updateUI();
}

document.getElementById("attack-button").addEventListener("click", attackEnemy);

document.querySelectorAll(".upgrade").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    if (type === "click" && gold >= 10) {
      clickPower++;
      gold -= 10;
    } else if (type === "auto" && gold >= 25) {
      goldPerSecond++;
      gold -= 25;
    }
    updateUI();
  });
});

function autoGold() {
  gold += goldPerSecond;
  totalGoldEarned += goldPerSecond;
  updateUI();
}

setInterval(autoGold, 1000);

function spawnLoot() {
  const rarities = [
    { name: "Common", color: "gray", chance: 0.5 },
    { name: "Rare", color: "blue", chance: 0.3 },
    { name: "Epic", color: "purple", chance: 0.15 },
    { name: "Legendary", color: "orange", chance: 0.05 }
  ];
  let roll = Math.random();
  let rarity = rarities.find(r => (roll -= r.chance) < 0);
  const types = ["weapon", "armor"];
  const itemType = types[Math.floor(Math.random() * types.length)];

  const item = {
    name: `${rarity.name} ${itemType === "weapon" ? "Sword" : "Plate"}`,
    rarity: rarity.name,
    color: rarity.color,
    type: itemType,
    bonus: Math.ceil(Math.random() * 5)
  };

  inventory.push(item);
  flashLootDrop(item);
  renderInventory();
}

function flashLootDrop(item) {
  const msg = document.createElement("div");
  msg.textContent = `+ ${item.name}`;
  msg.style.position = "fixed";
  msg.style.top = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.backgroundColor = item.color;
  msg.style.padding = "8px 16px";
  msg.style.borderRadius = "4px";
  msg.style.color = "#fff";
  msg.style.zIndex = 1000;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}


function renderInventory() {
  inventoryEl.innerHTML = "";
  inventory.forEach((item, index) => {
    const slot = document.createElement("div");
    slot.className = "item-slot";
    slot.textContent = item.name.split(' ')[0]; // Short label
    slot.style.borderColor = item.color;

    slot.addEventListener("click", () => equipItem(index));
    slot.addEventListener("mouseenter", (e) => showTooltip(e, item));
    slot.addEventListener("mouseleave", hideTooltip);

    inventoryEl.appendChild(slot);
  });
}

function showTooltip(e, item) {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.innerHTML = `
    <h3 style='color:${item.color}; margin:0;'>${item.name}</h3>
    <p>Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
    <p>+${item.bonus} ${item.type === "weapon" ? "Click Power" : "Defense (future use)"}</p>
  `;
  document.body.appendChild(tooltip);

  const updatePosition = (ev) => {
    tooltip.style.left = ev.pageX + 15 + 'px';
    tooltip.style.top = ev.pageY + 15 + 'px';
  };
  updatePosition(e);
  e.target.tooltipElement = tooltip;
  e.target.tooltipMove = updatePosition;
  window.addEventListener('mousemove', updatePosition);
}

function hideTooltip(e) {
  const tooltip = e.target.tooltipElement;
  if (tooltip) {
    tooltip.remove();
    window.removeEventListener('mousemove', e.target.tooltipMove);
  }
}

function equipItem(index) {
  const item = inventory[index];
  equippedGear[item.type] = item;
  if (item.type === "weapon") {
    clickPower += item.bonus;
  }
  inventory.splice(index, 1);
  renderInventory();
  updateUI();
  document.querySelector(`[data-slot='${item.type}']`).textContent = `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.name} (+${item.bonus})`;
  document.querySelector(`[data-slot='${item.type}']`).textContent = `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.name} (+${item.bonus})`;
}
document.getElementById("prestige-button").addEventListener("click", () => {
  if (totalGoldEarned >= 100) {
    gold = 0;
    inventory = [];
    equippedGear = { weapon: null, armor: null };
    document.querySelectorAll(".slot").forEach(el => {
      el.textContent = `${el.dataset.slot.charAt(0).toUpperCase() + el.dataset.slot.slice(1)}: None`;
    });
    unlockedAchievements.clear();
    achievementsList.innerHTML = "";
    renderInventory();
    updateUI();
  }
});