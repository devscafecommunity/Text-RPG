// events/example.js

// Definição dos eventos do jogo
const events = {
    start: {
        type: 'history',
        description: "Você está na entrada de uma caverna. O que você faz?",
        next: "caveEntrance",
        exec(player) {
            player.inventory.push('Lanterna');
        }
    },

    caveEntrance: {
        type: 'history',
        description: "Você entrou na caverna escura. O que você faz?",
        next: "choosePath",
        exec(player) {
            player.inventory.push('Lanterna');
        }
    },

    choosePath: {
        type: 'options',
        description: "Você se depara com um caminho bifurcado. Qual caminho você escolhe?",
        options: [
            { text: "Seguir o caminho à esquerda", action: "leftPath" },
            { text: "Seguir o caminho à direita", action: "rightPath" }
        ],
        exec(player) {
            player.inventory.push('Lanterna');
        }
    },

    leftPath: {
        type: 'history',
        description: "Você seguiu o caminho à esquerda e encontrou um baú. O que você faz?",
        next: "continueLeftPath",
        exec(player) {
            player.inventory.push('Lanterna');
        }
    },

    continueLeftPath: {
        type: 'history',
        description: "Você encontrou uma espada dentro do baú.",
        next: "start",
        exec(player) {
            player.inventory.push('Lanterna');
        }
    },

    rightPath: {
        type: 'history',
        description: "Você seguiu o caminho à direita e encontrou uma armadilha. O que você faz?",
        next: "continueRightPath",
        exec(player) {
            player.inventory.push('Lanterna');
        }
    },

    continueRightPath: {
        type: 'history', // Adicionando a propriedade type
        description: "Você evitou a armadilha e continuou em frente.",
        next: "start",
        exec(player) {
            player.inventory.push('Lanterna');
        }
    }
};

module.exports = events;