const fs = require('fs');
const readLineSync = require('readline-sync');

interface Character {
  name: string;
  hp: number;
  str: number;
}

function ChoixDuCaratere(PersonnageTab: Character[]): Character {
  const nomPersonnages = PersonnageTab.map(perso => perso.name);
  const indexchoisi = readLineSync.keyInSelect(nomPersonnages, 'What is your character?');
  return PersonnageTab[indexchoisi];
}

function ChoixDeEnemies(EnemiesTab: Character[]): Character {
  const randomIndex = Math.floor(Math.random() * EnemiesTab.length);
  return EnemiesTab[randomIndex];
}

function ChoixDuBoss(BossTab: Character[]): Character {
  const randomIndex = Math.floor(Math.random() * BossTab.length);
  return BossTab[randomIndex];
}

function main() {
  // Récupération dynamique des personnages
  const PersonnageTab: Character[] = JSON.parse(fs.readFileSync('./players.json', 'utf-8'));
  const BossTab: Character[] = JSON.parse(fs.readFileSync('./bosses.json', 'utf-8'));
  const EnemiesTab: Character[] = JSON.parse(fs.readFileSync('./enemies.json', 'utf-8'));

  const hpMaxPersonnageChoisi = ChoixDuCaratere(PersonnageTab).hp;

  const players = [
    ChoixDuCaratere(PersonnageTab),
    ...EnemiesTab.slice(0, 9),
    ChoixDuBoss(BossTab),
  ];

  let victory = true;
  for (let i = 0; i < players.length; i++) {
    console.log(`NIVEAU ${i + 1}`);
    affichage(players[i], hpMaxPersonnageChoisi);
    const enemy = players[i + 1];
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

function Attack(personnage: Character, enemies: Character) {
  console.log(`${personnage.name} attacks ${enemies.name}`);
  enemies.hp -= personnage.str;
}

function affichage(personnage: Character, hpInitial: number) {
    const hpPercent = Math.round((personnage.hp / hpInitial) * 100);
    let line = 'I'.repeat(Math.max(0, personnage.hp)) + '_'.repeat(Math.max(0, hpInitial - personnage.hp));

    console.log(`${line}`);
    console.log(`${personnage.name} has ${personnage.hp}/${hpInitial} HP left `);
  }  
function Heal(personnage: Character, hpInitial: number) {
  console.log(`${personnage.name} heals himself`);
  personnage.hp += hpInitial / 2;
  // Assure que la valeur de hp ne dépasse pas la valeur initiale
  if (personnage.hp > hpInitial) {
    personnage.hp = hpInitial;
  }
}
function Fight(personnageChoisi: Character, EnemiesChoisi: Character, hpInitial: number, hpInitialEnemie: number) {
  while (personnageChoisi.hp > 0 && EnemiesChoisi.hp > 0) {
    const playerAction = readLineSync.question('What do you want to do? (Attack/Heal) (1/2) : ');
    if (playerAction.toLowerCase() === '1') {
      Attack(personnageChoisi, EnemiesChoisi);
    } else if (playerAction.toLowerCase() === '2') {
      Heal(personnageChoisi, hpInitial);
    } else {
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