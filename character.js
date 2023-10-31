var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var fs = require('fs');
var readLineSync = require('readline-sync');
function ChoixDuCaratere(PersonnageTab) {
    var nomPersonnages = PersonnageTab.map(function (perso) { return perso.name; });
    var indexchoisi = readLineSync.keyInSelect(nomPersonnages, 'What is your character?');
    return PersonnageTab[indexchoisi];
}
function ChoixDeEnemies(EnemiesTab) {
    var randomIndex = Math.floor(Math.random() * EnemiesTab.length);
    return EnemiesTab[randomIndex];
}
function ChoixDuBoss(BossTab) {
    var randomIndex = Math.floor(Math.random() * BossTab.length);
    return BossTab[randomIndex];
}
function main() {
    // Récupération dynamique des personnages
    var PersonnageTab = JSON.parse(fs.readFileSync('./players.json', 'utf-8'));
    var BossTab = JSON.parse(fs.readFileSync('./bosses.json', 'utf-8'));
    var EnemiesTab = JSON.parse(fs.readFileSync('./enemies.json', 'utf-8'));
    var hpMaxPersonnageChoisi = ChoixDuCaratere(PersonnageTab).hp;
    var players = __spreadArray(__spreadArray([
        ChoixDuCaratere(PersonnageTab)
    ], EnemiesTab.slice(0, 9), true), [
        ChoixDuBoss(BossTab),
    ], false);
    var victory = true;
    for (var i = 0; i < players.length; i++) {
        console.log("NIVEAU ".concat(i + 1));
        affichage(players[i], hpMaxPersonnageChoisi);
        var enemy = players[i + 1];
        victory = Fight(players[i], enemy, hpMaxPersonnageChoisi, enemy.hp);
        if (!victory) {
            console.log('GAME OVER');
            break;
        }
    }
    if (victory) {
        console.log('CONGRATULATIONS! YOU DEFEATED GANON!');
    }
}
function Attack(personnage, enemies) {
    console.log("".concat(personnage.name, " attacks ").concat(enemies.name));
    enemies.hp -= personnage.str;
}
function affichage(personnage, hpInitial) {
    var hpPercent = Math.round((personnage.hp / hpInitial) * 100);
    var line = 'I'.repeat(Math.max(0, personnage.hp)) + '_'.repeat(Math.max(0, hpInitial - personnage.hp));
    console.log("".concat(line));
    console.log("".concat(personnage.name, " has ").concat(personnage.hp, "/").concat(hpInitial, " HP left "));
}
function Heal(personnage, hpInitial) {
    console.log("".concat(personnage.name, " heals himself"));
    personnage.hp += hpInitial / 2;
    // Assure que la valeur de hp ne dépasse pas la valeur initiale
    if (personnage.hp > hpInitial) {
        personnage.hp = hpInitial;
    }
}
function Fight(personnageChoisi, EnemiesChoisi, hpInitial, hpInitialEnemie) {
    while (personnageChoisi.hp > 0 && EnemiesChoisi.hp > 0) {
        var playerAction = readLineSync.question('What do you want to do? (Attack/Heal) (1/2) : ');
        if (playerAction.toLowerCase() === '1') {
            Attack(personnageChoisi, EnemiesChoisi);
        }
        else if (playerAction.toLowerCase() === '2') {
            Heal(personnageChoisi, hpInitial);
        }
        else {
            console.log('Invalid input, try again.');
            continue;
        }
        if (EnemiesChoisi.hp <= 0) {
            console.log("".concat(EnemiesChoisi.name, " is defeated"));
            return true;
        }
        console.log("".concat(EnemiesChoisi.name, " attacks ").concat(personnageChoisi.name));
        personnageChoisi.hp -= EnemiesChoisi.str;
        affichage(personnageChoisi, hpInitial);
        if (personnageChoisi.hp <= 0) {
            console.log('Game Over');
            return false;
        }
    }
    return true;
}
main();