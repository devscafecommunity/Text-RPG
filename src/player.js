// Classe do jogador
/*
{
    classname: "Classe",
    inventory: [],
    hp: +50, // Adicionando a propriedade hp
    maxHp: +100, // Adicionando a propriedade maxHp
    mp: +20, // Adicionando a propriedade mp
    maxMp: +20, // Adicionando a propriedade maxMp
    ...

    // Habilidades
    skills[]
}
*/

const { green } = require("console-log-colors");
const { start } = require("./events/1");

class Classe {
    constructor(name, skills) {
        this.name = name;
        this.skills = skills;

        // Status do jogador
        this.hp = 50;
        this.maxHp = 100;
        this.mp = 20;
        this.maxMp = 20;
        this.dx = 10;
        this.maxDx = 10;

        // Atributos
        this.strength = 10;
        this.intelligence = 10;

        // Equipamentos
        this.weapon = null;
        this.armor = null;
        this.accessory = null;
    }
}

class Skills {
    constructor(name, description, cost, action) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.action = action;
    }

    // Executa a ação da habilidade
    execute(player) {
        this.action(player);
    }

    // Exibe a descrição da habilidade
    display() {
        console.log(`${this.name}: ${this.description} (custo: ${this.cost} MP)`);
    }
}

const classes = [
    {
        name: "Guerreiro",
        description: "Um guerreiro forte que usa sua força para derrotar seus inimigos",
        skills: [
            new Skills("Ataque Forte", "Ataque forte que causa 2x o dano normal", 5,
            execute = (player) => {
                console.log("Ataque forte!");
            }),
            new Skills("Cura", "Recupera 10 de HP", 5, 
            execute = (player) => {
                player.hp += 10;
                console.log("HP recuperado!");
            }),
        ],
        atributos: {
            hp: +150,
            maxHp: +150,
            mp: -10,
            maxMp: -10,
            dx: +5,
            maxDx: +5,
            strength: +5,
            intelligence: -2,
        },
        startingEquipment: {
            weapon: "Espada de ferro",
            armor: "Armadura de ferro",
            accessory: "Anel de força",
        },
        startingInventory: {
            items: [
                "Espada de ferro",
                "Armadura de ferro",
                "Anel de força",
                "Poção de cura",
            ],
        },
    },
    {
        name: "Mago",
        description: "Um mago poderoso que usa magia para derrotar seus inimigos",
        skills: [
            new Skills(
                "Bola de Fogo",
                "Ataque mágico que causa dano de fogo",
                5,
                (player) => {
                    console.log("Bola de fogo!");
                }
            ),
            new Skills("Escudo Mágico", "Aumenta a defesa mágica do jogador", 5, (player) => {
                console.log("Defesa mágica aumentada!");
            }),
            new Skills("Cura", "Recupera 10 de HP", 5, (player) => {
                console.log("HP recuperado!");
            }),
        ],
        atributos: {
            hp: -20,
            maxHp: -20,
            mp: +100,
            maxMp: +100,
            dx: -5,
            maxDx: -5,
            strength: -5,
            intelligence: +10,
        },
        startingEquipment: {
            weapon: "Cajado de madeira",
            armor: "Vestes de tecido",
            accessory: "Anel de inteligência",
        },
        startingInventory: {
            items: [
                "Cajado de madeira",
                "Vestes de tecido",
                "Anel de inteligência",
                "Poção de cura",
            ],
        },
    },
];

/*
Inventario

{
    name: "Espada",
    description: "Uma espada afiada",
    type: "weapon",
    damage: 10
}


*/

const items = [
    {
        name: "Espada de ferro",
        description: "Uma espada de ferro",
        type: "weapon",
        damage: 10,
        amount: 1
    },
    {
        name: "Armadura de ferro",
        description: "Uma armadura de ferro",
        type: "armor",
        defense: 10,
        amount: 1
    },
    {
        name: "Anel de força",
        description: "Aumenta a força do jogador",
        type: "accessory",
        strength: 5,
        amount: 1
    },
    {
        name: "Poção de cura",
        description: "Recupera 10 de HP",
        type: "consumable",
        hp: 10,
        amount: 1
    },
    {
        name: "Cajado de madeira",
        description: "Um cajado de madeira",
        type: "weapon",
        damage: 5,
        amount: 1
    },
    {
        name: "Vestes de tecido",
        description: "Vestes de tecido",
        type: "armor",
        defense: 5,
        amount: 1
    },
    {
        name: "Anel de inteligência",
        description: "Aumenta a inteligência do jogador",
        type: "accessory",
        intelligence: 5,
        amount: 1
    },
    {
        name: "Poção de mana",
        description: "Recupera 10 de MP",
        type: "consumable",
        mp: 10,
        amount: 1
    }
];

class Inventory {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        // Item não existe no inventário(Adiciona o item) ou Item existe no inventário(Aumenta a quantidade)
        const existingItem = this.items.find((i) => i.name === item.name);
        if (existingItem) {
            existingItem.amount += item.amount;
        } else {
            this.items.push(item);
        }
    }

    removeItem(item, amount) {
        //  Item existe no inventário(Remove a quantidade) ou Item não existe no inventário(Remove o item)
        const existingItem = this.items.find((i) => i.name === item.name);
        if (existingItem) {
            existingItem.amount -= amount;
            if (existingItem.amount <= 0) {
                this.items = this.items.filter((i) => i !== existingItem);
            }
        } else {
            console.log("Item não encontrado!");
        }
    }

    display() {
        console.log("Inventário:");
        this.items.forEach((item, index) => {
            console.log(`[${index + 1}] ${item.name}: ${item.description}`);
        });
    }
}

// Definição da classe do jogador
class Player {
    constructor(name) {
        this.name = name;
        this.inventory = [];

        // Status do jogador
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 20;
        this.maxMp = 20;
        this.dx = 10;
        this.maxDx = 10;

        // Atributos
        this.strength = 10;
        this.intelligence = 10;

        // Equipamentos
        this.weapon = null;
        this.armor = null;
        this.accessory = null;

        // Classe
        this.classe = null;
    }

    // Is equiped
    isEquiped(item) {
        if (this.weapon && this.weapon.name === item.name) {
            return true;
        }
        if (this.armor && this.armor.name === item.name) {
            return true;
        }
        if (this.accessory && this.accessory.name === item.name) {
            return true;
        }
        return false;
    }

    // itemsShow
    itemsShow() {
        console.log(`+-----------------------------------------------------------------------------------+`);
        this.inventory.forEach((item, index) => {
            if (!undefined && !null) {
                /*
                Item object
                {
                name: 'Poção de cura',
                description: 'Recupera 10 de HP',
                type: 'consumable',
                hp: 10,
                amount: 1
                }

                Equiped item
                                console.log(`| [${index + 1}] ${item.name}  ${item.amount}x ${
                    // Is equiped
                    this.isEquiped(item) ? green("(Equipado)") : ""
                }`.padEnd(94) + "|");

                console.log(`| [${index + 1}] ${item.name}  ${item.amount}x ${
                    // Is equiped
                    this.isEquiped(item) ? green("(Equipado)") : ""
                }`.padEnd(84) + "|");
                */
                
                this.isEquiped(item) ? 
                console.log(`| [${index + 1}] ${item.name}  ${item.amount}x ${green("(Equipado)")}`.padEnd(94) + "|") :
                console.log(`| [${index + 1}] ${item.name}  ${item.amount}x`.padEnd(84) + "|");
            }
        });
    }

    // Exibe o status do jogador de forma dinâmica
    displayStatus() {
        console.log(`+-----------------------------------------------------------------------------------+`);
        console.log(`| Nome: ${this.name.padEnd(76)}|`);
        console.log(
            `⁜ 💚 ${this.drawBar(this.hp, this.maxHp, 5)} ${this.hp}/${this.maxHp
                } ⁜ ✨ ${this.drawBar(this.mp, this.maxMp, 5)} ${this.mp}/${this.maxMp
                } ⁜ 🏹 ${this.drawBar(this.dx, this.maxDx, 5)} ${this.dx}/${this.maxDx
                }`.padEnd(68) + "⁜"
        );
        console.log(`| Força: ${
            this.strength.toString().padEnd(2)
        } Inteligência: ${
            this.intelligence.toString().padEnd(2)
        } ${ this.classe ? `Classe: ${this.classe.name}` : ""}`.padEnd(84) + "|");
        console.log(`+-----------------------------------------------------------------------------------+`);
        this.itemsShow() 
        console.log(`+-----------------------------------------------------------------------------------+`);
        console.log("\n");
    }

    // Desenha a barra de vida do jogador
    drawBar(val, max, barLength) {
        const progress = Math.ceil((val / max) * barLength);
        const progressBar =
            "⬛".repeat(progress) + "⬜".repeat(barLength - progress);
        return "[ " + progressBar + " ]";
    }

    // Adiciona um item ao inventário do jogador
    addItem(itemname) {
        const item = items.find((i) => i.name === itemname);
        if (item) {
            this.inventory.push(item);
            console.log(`Você pegou: ${item.name}`);
        } else {
            console.log("Item não encontrado!");
        }
    }

    // Remove um item do inventário do jogador
    removeItem(itemname) {
        const item = this.inventory.find((i) => i.name === itemname);
        if (item) {
            this.inventory = this.inventory.filter((i) => i !== item);
            console.log(`Você largou: ${item.name}`);
        } else {
            console.log("Item não encontrado!");
        }
    }

    // Update the player's stats based on the equipped items
    updateStats(item) {
        this.hp += item.hp || 0;
        this.maxHp += item.maxHp || 0;
        this.mp += item.mp || 0;
        this.maxMp += item.maxMp || 0;
        this.dx += item.dx || 0;
        this.maxDx += item.maxDx || 0;
        this.strength += item.strength || 0;
        this.intelligence += item.intelligence || 0;
    }

    // Equipa um item
    equipItem(itemname) {
        const item = this.inventory.find((i) => i.name === itemname);
        if (item) {
            switch (item.type) {
                case "weapon":
                    if (this.weapon) {
                        this.inventory.push(this.weapon);
                    }
                    this.weapon = item;
                    break;
                case "armor":
                    if (this.armor) {
                        this.inventory.push(this.armor);
                    }
                    this.armor = item;
                    break;
                case "accessory":
                    if (this.accessory) {
                        this.inventory.push(this.accessory);
                    }
                    this.accessory = item;
                    break;
                default:
                    console.log("Item não equipável!");
                    return;
            }
        }
        this.updateStats(item);
    }

    // Aplica effeito de um item
    applyItemEffect(item) {
        this.hp += item.hp || 0;
        this.maxHp += item.maxHp || 0;
        this.mp += item.mp || 0;
        this.maxMp += item.maxMp || 0;
        this.dx += item.dx || 0;
        this.maxDx += item.maxDx || 0;
        this.strength += item.strength || 0;
        this.intelligence += item.intelligence || 0;
    }

    // Usa um item
    useItem(itemname) {
        const item = this.inventory.find((i) => i.name === itemname);
        if (item) {
            switch (item.type) {
                case "consumable":
                    this.applyItemEffect(item);
                    this.removeItem(itemname);
                    break;
                default:
                    return;
            }
        }
    }

    // Usa uma habilidade
    useSkill(skillname, target = null) {
        const skill = this.classe.skills.find((s) => s.name === skillname);
        if (skill) {
            if (this.mp >= skill.cost) {
                skill.execute(this, target);
                this.mp -= skill.cost;
            } else {
                console.log("MP insuficiente!");
            }
        } else {
            console.log("Habilidade não encontrada!");
        }
    }
}

// Player factory function
function createPlayer(name, classname) {
    const player = new Player(name);
    const classData = classes.find((c) => c.name === classname);
    if (classData) {
        player.hp += classData.atributos.hp || 0;
        player.maxHp += classData.atributos.maxHp || 0;
        player.mp += classData.atributos.mp || 0;
        player.maxMp += classData.atributos.maxMp || 0;
        player.dx += classData.atributos.dx || 0;
        player.maxDx += classData.atributos.maxDx || 0;
        player.strength += classData.atributos.strength || 0;
        player.intelligence += classData.atributos.intelligence || 0;

        classData.startingInventory.items.forEach((itemname) => {
            player.addItem(itemname);
        });

        // Equipa todos os itens iniciais
        player.equipItem(classData.startingEquipment.weapon);
        player.equipItem(classData.startingEquipment.armor);
        player.equipItem(classData.startingEquipment.accessory);

        // Define a classe do jogador
        player.updateStats(classData);
        player.classe = classData;

        return player;
    } else {
        return null;
    }

    return player;
}

module.exports = {
    createPlayer,
    Player,
    Inventory,
    Skills,
    Classe,
    items,
    classes,

};
