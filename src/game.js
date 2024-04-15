const readlineSync = require("readline-sync");
const { createPlayer, classes, items } = require("./player");
const fs = require("fs");
const { color, log, red, green, cyan, cyanBright } = require('console-log-colors');

// Limpa a tela do console
function clearConsole() {
    console.clear();
}

// Carrega os eventos do arquivo
function loadEventsFromFile(filename) {
    const filePath = `./events/${filename}.js`;
    try {
        return require(filePath);
    } catch (error) {
        console.error(`Erro ao carregar eventos do arquivo ${filePath}:`, error);
        return {};
    }
}

// Carrega todos os eventos
function loadAllEvents() {
    const events = {};
    const files = fs.readdirSync("./events");
    files.forEach((file) => {
        const eventName = file.replace(".js", "");
        events[eventName] = loadEventsFromFile(eventName);
    });
    return events;
}

// Inicia o jogador
function startPlayer() {
    const name = readlineSync.question("Qual e o seu nome? ");
    let selectedIndex = 0;
    function wordWrap(str, maxWidth) {
        let newLineStr = "\n";
        done = false;
        res = '';

        function testWhite(x) {
            var white = new RegExp(/^\s$/);
            return white.test(x.charAt(0));
        }

        do {
            found = false;
            for (let i = maxWidth - 1; i >= 0; i--) {
                if (testWhite(str.charAt(i))) {
                    res += [str.slice(0, i), newLineStr].join('');
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('');
                str = str.slice(maxWidth);
            }

            if (str.length < maxWidth)
                done = true;
        } while (!done);

        return res + str;
    }

    function displayAbout(classe) {

        function isPositive(value) {
            return value > 0;
        }

        console.log("------------------------------⁜------------------------------");
        console.log(`hp: ${isPositive(classe.atributos.hp) ? green(classe.atributos.hp) : red(classe.atributos.hp)}`);
        console.log(`mp: ${isPositive(classe.atributos.mp) ? green(classe.atributos.mp) : red(classe.atributos.mp)}`);
        console.log(`dx: ${isPositive(classe.atributos.dx) ? green(classe.atributos.dx) : red(classe.atributos.dx)}`);
        console.log(`strength: ${isPositive(classe.atributos.strength) ? green(classe.atributos.strength) : red(classe.atributos.strength)}`);
        console.log(`intelligence: ${isPositive(classe.atributos.intelligence) ? green(classe.atributos.intelligence) : red(classe.atributos.intelligence)}\n`);
        console.log(`description: ${wordWrap(classe.description, 50)}`);
        console.log("------------------------------⁜------------------------------");
    }

    function showClassSelected(index, classes) {
        let selectPointer = "►";
        let notSelectPointer = "▷";
        // Classes disponíveis na horizontal ex: [Mago]  [Guerreiro]◀ ou [Mago]◀  [Guerreiro]
        let classesString = classes.map((classe, i) => {
            let pointer = i === index ? selectPointer : notSelectPointer;
            if (i === index) {
                return `${pointer} ${green(classe.name)}`;
            }
            return `${pointer} ${classe.name}`;
        }).join("  ");

        console.log(classesString);
    }

    while (true) {
        clearConsole();
        console.log("------------------------------⁜------------------------------");
        console.log("Escolha sua classe:\n");
        console.log("Use a e d para navegar e c para confirmar.");
        showClassSelected(selectedIndex, classes);
        displayAbout(classes[selectedIndex]);
        const key = readlineSync.keyIn("", {
            hideEchoBack: true,
            mask: "",
            limit: "adc$<0-9>",
        });

        if (key === "0") {
            console.log("Escolha cancelada.");
            process.exit();
            return;
        }
        else if (key === "a") {
            selectedIndex = (selectedIndex - 1 + classes.length) % classes.length;
        }
        else if (key === "d") {
            selectedIndex = (selectedIndex + 1) % classes.length;
        }
        else if (key === "c") {
            break;
        }
    }

    const playerClass = classes[selectedIndex].name;
    const player = createPlayer(name, playerClass);
    return player;
}


// Exibe as opções do evento
function displayEventOptions(player, event, selectedIndex) {
    const options = event.options.map((option, index) => {
        const prefix = index === selectedIndex ? "►" : " ";
        return `${prefix} [${index + 1}] ${option.text}`;
    });
    options.push("  [0] " + color("CANCELAR e SAIR DO JOGO", "red"));
    clearConsole();
    player.displayStatus();
    console.log(event.description);
    console.log("Use W e S para navegar e C para confirmar.");
    console.log(options.join("\n"));
}

// Exibe a descrição do evento
function displayEventDescription(event) {
    console.log(event.description);
}

// Confirma saída do jogo
function confirmExit() {
    const key = readlineSync.keyIn("Deseja realmente sair? (s/n)", {
        hideEchoBack: true,
        mask: "",
        limit: "sn",
    });
    return key === "s";
}

// Processa a escolha do jogador
function processPlayerChoice(player, event, selectedIndex, currentEventFile) {
    const key = readlineSync.keyIn("", {
        hideEchoBack: true,
        mask: "",
        limit: "wsc$<0-9>",
    });
    if (key === "0") {
        if (confirmExit()) {
            process.exit();
        }
    } else if (key === "w") {
        selectedIndex =
            (selectedIndex - 1 + event.options.length) % event.options.length;
    } else if (key === "s") {
        selectedIndex = (selectedIndex + 1) % event.options.length;
    } else if (key === "c") {
        const selectedOption = event.options[selectedIndex];
        processEvent(player, selectedOption.action, currentEventFile);
        return;
    }
    return selectedIndex;
}

// Processa o evento atual
function processEvent(player, currentEvent, currentEventFile) {
    clearConsole();
    player.displayStatus();
    const event = events[currentEventFile][currentEvent];

    if (!event) {
        console.log("Evento não encontrado:", currentEvent);
        return;
    }

    if (event.type === "history") {
        displayEventDescription(event);
        readlineSync.keyInPause(
            " [Pressione qualquer tecla para continuar ou O para sair]"
        );
        if (event.next) {
            processEvent(player, event.next, currentEventFile);
        } else {
            console.log("Fim do jogo.");
        }
    } else if (event.type === "options") {
        displayEventDescription(event);
        let selectedIndex = 0;
        while (true) {
            displayEventOptions(player, event, selectedIndex);
            selectedIndex = processPlayerChoice(
                player,
                event,
                selectedIndex,
                currentEventFile
            );
            if (selectedIndex === undefined) return;
        }
    }
}

// Inicia o jogo
function startGame(player) {
    if (!player) {
        player = startPlayer();
    }
    let currentEventFile = "1";
    let currentEvent = "start";
    processEvent(player, currentEvent, currentEventFile);
}

// Carrega todos os eventos
const events = loadAllEvents();

module.exports = {
    startGame,
};
