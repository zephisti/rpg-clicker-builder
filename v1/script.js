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

function updateUI() {
  goldEl.textContent = gold;
  clickPowerEl.textContent = clickPower;
  damageDoneEl.textContent = totalDamage;
  goldEarnedEl.textContent = totalGoldEarned;
  enemyHealthFill.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
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

  const item = {
    name: `${rarity.name} Sword`,
    rarity: rarity.name,
    color: rarity.color,
    type: "weapon",
    bonus: Math.ceil(Math.random() * 5)
  };

  inventory.push(item);
  renderInventory();
}

function renderInventory() {
  inventoryEl.innerHTML = "";
  inventory.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (+${item.bonus})`;
    li.style.color = item.color;
    li.title = `Type: ${item.type}\nBonus: +${item.bonus} Click Power`;
    li.addEventListener("click", () => equipItem(index));
    inventoryEl.appendChild(li);
  });
}

function equipItem(index) {
  const item = inventory[index];
  equippedGear[item.type] = item;
  clickPower += item.bonus;
  inventory.splice(index, 1);
  renderInventory();
  updateUI();
  document.querySelector(`[data-slot='${item.type}']`).textContent = `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.name} (+${item.bonus})`;
}

document.getElementById("prestige-button").addEventListener("click", () => {
  if (totalGoldEarned >= 100) {
    gold = 0;
    clickPower = 1;
    goldPerSecond = 0;
    inventory = [];
    equippedGear = { weapon: null, armor: null };
    document.querySelectorAll(".slot").forEach(el => el.textContent = `${el.dataset.slot.charAt(0).toUpperCase() + el.dataset.slot.slice(1)}: None`);
    totalGoldEarned = 0;
    renderInventory();
    updateUI();
    alert("You have prestiged! Future upgrades will be more powerful (not implemented yet).")
  }
});

updateUI();