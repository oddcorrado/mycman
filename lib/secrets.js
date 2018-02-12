const hack = require('./hack')

const log = require('./log')

const secretStrings = [
  // MP JAM
  { secret: "jam leet", type: "jam", short:'brouilleur', hint: "jam leet", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "jam hash", type: "jam", short:'brouilleur', hint: "jam hash", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "jam animal", type: "jam", short:'brouilleur', hint: "jam animal", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "jam stretch", type: "jam", short:'brouilleur', hint: "jam stretch", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "jam remix", type: "jam", short:'brouilleur', hint: "jam remix", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "jam miroir", type: "jam", short:'brouilleur', hint: "jam miroir", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // MP LOG
  { secret: "espion Oméga", type: "spy", short:'espion', hint: "espion Oméga", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère les 20 derniers messages', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "espion Alpha", type: "spy", short:'espion', hint: "espion Alpha", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère tous les messages reçus par un joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "espion Beta", type: "spy", short:'espion', hint: "espion Beta", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère tous les messages envoyés par un joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "espion Gamma", type: "spy", short:'espion', hint: "espion Gamma", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère les 40 derniers messages échangés par un joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "espion Iota", type: "spy", short:'espion', hint: "espion Iota", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère les 20 derniers messages', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "espion Theta", type: "spy", short:'espion', hint: "espion Theta", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère les 20 derniers messages', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // STRONG
  { secret: "Excalibur", type: "bonus", short:'+3', hint: "Excalibur", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'Excalibur a donné +3 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Durandal", type: "bonus", short:'+2', hint: "Durandal", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Durandal a donné +2 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Joyeuse", type: "bonus", short:'+1', hint: "Joyeuse", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 au vote à un autre joueur', log:'Joyeuse a donné +1 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Almace", type: "bonus", short:'+2', hint: "Almace", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Almace a donné +2 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Curtana", type: "bonus", short:'+1', hint: "Curtana", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 au vote à un autre joueur', log:'Curtana a donné +3 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Le Baton De Circé", type: "malus", short:'-3', hint: "Le Baton De Circé", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne -3 au vote à un autre joueur', log:'Le Baton De Circé a donné -3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La Tunique De Nessos", type: "malus", short:'-3', hint: "La Tunique De Nessos", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne -3 au vote à un autre joueur', log:'La tunique de Nassos a donné -3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Les Ailes D\'Icare", type: "malus", short:'-2', hint: "Les Ailes D\'Icare", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne -2 au vote à un autre joueur', log:'Les Ailes D\'Icare donnent -2 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Damocles", type: "malus", short:'-1', hint: "Damocles", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne -1 au vote à un autre joueur', log:'Damocles donne -1 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Le Thyrse", type: "malus", short:'-1', hint: "Le Thyrse", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne -1 au vote à un autre joueur', log:'Le Thyrse donne -1 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // BOMBS
  { secret: "Little Boy", type: "bomb", short:'révèle 0', hint: "Little Boy", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant 0 votes sont révélés', log:'Les joueurs ayant 0 votes ont été révélés', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Fat Man", type: "bomb", short:'révèle 1', hint: "Fat Man", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'Les joueurs ayant 1 vote ont été révélés', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Czar Bomba", type: "bomb", short:'révèle tous', hint: "Czar Bomba", cooldown:0, cooldownPeriod:100, inUse:false, help:'Tous les joueurs sont révélés', log:'Tous les joueurs sont révélés', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Castle Bravo", type: "bomb", short:'+1', hint: "Castle Bravo", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant des votes pairs sont révélés', log:'Les joueurs ayant des votes pairs ont été révélés', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Miroir Fumant", type: "bomb", short:'inverse', hint: "Le Miroir Fumant", cooldown:0, cooldownPeriod:4, inUse:false, help:'Inverse les révélés', log:'Inverse les révélés', targetMax:0, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Lyre D\'Orphée", type: "bomb", short:'inverse', hint: "Lyre D\'Orphée", cooldown:0, cooldownPeriod:4, inUse:false, help:'Inverse les révélés', log:'Inverse les révélés', targetMax:0, targetNoSelf:true,  targets:[], available:false, pos:10},

  // BADASS
/*  { secret: "Sudarshana Chakra", type: "mp", short:'x4', hint: "Sudarshana Chakra", cooldown:0, cooldownPeriod:4, inUse:false, help:'Donne x 4 au vote à un autre joueur si le nombre de votants est pair, -1 sinon', log:'Donne  x 4 au vote à un autre joueur si le nombre de votants est pair, -1 sinon', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Mjölnir", type: "mp", short:'+7', hint: "Mjölnir", cooldown:0, cooldownPeriod:4, inUse:false, help:'Donne +7 au vote à un autre joueur s\'il est le seul votant, -1 sinon', log:'Donne +7 au vote à un autre joueur s\'il est le seul votant, -1 sinon', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Les Fleurs de Lotos", type: "mp", short:'+1', hint: "Les Fleurs de Lotos", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Graal", type: "mp", short:'+1', hint: "Le Graal", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 0 votes sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Boîte de Pandore", type: "mp", short:'+1', hint: "La Boîte de Pandore", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 ou -1 aléatoire à un joueur', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Pomme de Discorde", type: "mp", short:'+1', hint: "La Pomme de Discorde", cooldown:0, cooldownPeriod:3, inUse:false, help:'*Donne -3 a son vote', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "L'Arche d'Alliance", type: "mp", short:'+1', hint: "L'Arche d'Alliance", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +1 tous les votes à 1', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Golem", type: "mp", short:'+1', hint: "Le Golem", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Durandal", type: "mp", short:'+1', hint: "Durandal", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Donne +2 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La poudre de Perlinpinpin", type: "mp", short:'+1', hint: "La poudre de Perlinpinpin", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 ou -1 aléatoire à un joueur', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Mjöllnir", type: "mp", short:'+1', hint: "Mjöllnir", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'log text', targetMax:1, targetNoSelf:true, targets:[], available:false, pos:10},
  { secret: "Le trident de Poséidon", type: "mp", short:'+1', hint: "Le trident de Poséidon", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'Donne +3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La Tête de Meduse", type: "mp", short:'+1', hint: "La Tête de Meduse", cooldown:0, cooldownPeriod:3, inUse:false, help:'*Donne -3 a son vote', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Corne d'Abondance", type: "mp", short:'+1', hint: "La Corne d'Abondance", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},

  { secret: "Le Cheval de Troie", type: "mp", short:'+1', hint: "Le Cheval de Troie", cooldown:0, cooldownPeriod:2, inUse:false, help:'*Le vote le plus haut n\'est pas révélé, le second est révélé', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Les Sandales Ailées", type: "mp", short:'+1', hint: "Les Sandales Ailées", cooldown:0, cooldownPeriod:2, inUse:false, help:'*Donne l\'avantage à un autre joueur en cas d\'égalité', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La Poupée Vaudou", type: "mp", short:'+1', hint: "La Poupée Vaudou", cooldown:1, cooldownPeriod:2, inUse:false, help:'*Annule le pouvoir de vote d\'un autre joueur', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "L'Epée de Damoclès", type: "mp", short:'+1', hint: "L'Epée de Damoclès", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Caducée", type: "mp", short:'+1', hint: "Le Caducée", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Hollandais Volant", type: "mp", short:'+1', hint: "Le Hollandais Volant", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Pierre Philosophale", type: "mp", short:'+1', hint: "La Pierre Philosophale", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Heaume d'Hades", type: "mp", short:'+1', hint: "Le Heaume d'Hades", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Couronne d'épines", type: "mp", short:'+1', hint: "La Couronne d'épines", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le fil d'Ariane", type: "mp", short:'+1', hint: "Le fil d'Ariane", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Lance de Longinus", type: "mp", short:'+1', hint: "La Lance de Longinus", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Les bottes de 7 lieues", type: "mp", short:'+1', hint: "Les bottes de 7 lieues", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "L'Ankh", type: "mp", short:'+1', hint: "L'Ankh", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Shive Kundala", type: "mp", short:'+1', hint: "Shive Kundala", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "L'arche de Noé", type: "mp", short:'+1', hint: "L'arche de Noé", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Neshmet", type: "mp", short:'+1', hint: "Neshmet", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La barque de Charon", type: "mp", short:'+1', hint: "La barque de Charon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Livre des Morts", type: "mp", short:'+1', hint: "Le Livre des Morts", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Nécronomicon", type: "mp", short:'+1', hint: "Le Nécronomicon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Lampe d'Aladin", type: "mp", short:'+1', hint: "La Lampe d'Aladin", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Golem", type: "mp", short:'+1', hint: "Le Golem", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Fruit Interdit", type: "mp", short:'+1', hint: "Le Fruit Interdit", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Sable du Marchand", type: "mp", short:'+1', hint: "Le Sable du Marchand", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La flûte de Pan", type: "mp", short:'+1', hint: "La flûte de Pan", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Harpe de David", type: "mp", short:'+1', hint: "La Harpe de David", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Lyre d'Appolon", type: "mp", short:'+1', hint: "La Lyre d'Appolon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Tête de Méduse", type: "mp", short:'+1', hint: "La Tête de Méduse", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Mirroir Magique", type: "mp", short:'+1', hint: "Le Mirroir Magique", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Tour de Babel", type: "mp", short:'+1', hint: "La Tour de Babel", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Yaka No Kagami", type: "mp", short:'+1', hint: "Yaka No Kagami", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Gleipnir", type: "mp", short:'+1', hint: "Gleipnir", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Toison d'Or", type: "mp", short:'+1', hint: "La Toison d'Or", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10}, */
]

// *******************************************************
// JAM
// *******************************************************
secretStrings.find(s => s.secret === 'jam leet').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamLeet', target], player)
  })
}

secretStrings.find(s => s.secret === 'jam hash').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamHash', target], player)
  })
}

secretStrings.find(s => s.secret === 'jam animal').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamFaun', target], player)
  })
}

secretStrings.find(s => s.secret === 'jam stretch').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamSmear', target], player)
  })
}

secretStrings.find(s => s.secret === 'jam remix').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamMix', target], player)
  })
}

secretStrings.find(s => s.secret === 'jam miroir').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamMirror', target], player)
  })
}

// *******************************************************
// JAM
// *******************************************************
secretStrings.find(s => s.secret === 'espion Oméga').lifecycleActivate = function() {
  return log.messagesAll().slice(-20)
}

secretStrings.find(s => s.secret === 'espion Alpha').lifecycleActivate = function() {
  return log.messagesAll().filter(v => v.to === this.targets[0])
}

secretStrings.find(s => s.secret === 'espion Beta').lifecycleActivate = function() {
  return log.messagesAll().filter(v => v.from === this.targets[0])
}

secretStrings.find(s => s.secret === 'espion Gamma').lifecycleActivate = function() {
  return log.messagesAll().filter(v => (v.from === this.targets[0] || v.to === this.targets[0])).slice(-40)
}

secretStrings.find(s => s.secret === 'espion Iota').lifecycleActivate = function() {
  return log.messagesAll().slice(-20)
}

secretStrings.find(s => s.secret === 'espion Theta').lifecycleActivate = function() {
  return log.messagesAll().slice(-20)
}
// *******************************************************
// BOMBS
// *******************************************************
secretStrings.find(s => s.secret === 'Little Boy').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count === 0).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'Little Boy révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'Fat Man').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count === 1).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'Fat Man révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'Castle Bravo').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count % 2 === 0).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'Castle Bravo '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'Czar Bomba').voteDecide = function({counts, decisions, log}) {
  counts.forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'Czar Bomba '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

// *******************************************************
// STRONG
// *******************************************************

secretStrings.find(s => s.secret === 'Excalibur').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 3
      log += 'Excalibur donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Durandal').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 2
      log += 'Durandal donne +2 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Joyeuse').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 1
      log += 'Joyeuse donne +1 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Curtana').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 1
      log += 'Curtana donne +1 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Almace').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 1
      log += 'Almace donne +2 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Les Ailes D\'Icare').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) - 1
      log += 'Les Ailes D\'Icare donnent -1 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Le Thyrse').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) - 1
      log += 'Le Thyrse donne -1 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Damocles').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) - 2
      log += 'Damocles donne -2 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'La Tunique De Nessos').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) - 3
      log += 'La Tunique De Nessos donne -3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Le Baton De Circé').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) - 3
      log += 'Le Baton De Circé donne -3 à '+ target + '\n'
    }
  })
  return {votes, log}
}
// *******************************************************
// BADASS
// *******************************************************

/* secretStrings.find(s => s.secret === 'Mjölnir').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    let voterTarget = voter.target
    let count = votes.filter(v => v.target === voterTarget).length

    if(voter) {
      if(count === 1) {
        voter.power = (voter.power || 1 ) + 7
        log += 'Mjölnir donne +7 à '+ target + '\n'
      } else {
        voter.power = (voter.power || 1 ) - 1
        log += 'Mjölnir donne -1 à '+ target + '\n'
      }
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Sudarshana Chakra').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    let voterTarget = voter.target
    let count = votes.filter(v => v.target === voterTarget).length
    if(voter) {
      if(count % 2 === 0) {
        voter.power = (voter.power || 1 ) * 4
        log += 'Sudarshana Chakra donne x 4 à '+ target + '\n'
      } else {
        voter.power = (voter.power || 1 ) - 1
        log += 'Sudarshana Chakra donne -1 à '+ target + '\n'
      }
    }
  })
  return {votes, log}
} */

// *******************************************************
// WICKED
// *******************************************************
secretStrings.find(s => s.secret === 'Lyre D\'Orphée').voteDecide = function({counts, decisions, log}) {
  decisions.forEach(decision => {
    if (decision.isRevealed === true) {
      decision.isRevealed = false
      log += 'Lyre D\'Orphée cache '+ decision.name + '\n'
    } else {
      decision.isRevealed = true
      log += 'Lyre D\'Orphée révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'Le Miroir Fumant').voteDecide = function({counts, decisions, log}) {
  decisions.forEach(decision => {
    if (decision.isRevealed === true) {
      decision.isRevealed = false
      log += 'Le Miroir Fumant cache '+ decision.name + '\n'
    } else {
      decision.isRevealed = true
      log += 'Le Miroir Fumant révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

/* secretStrings.find(s => s.secret === 'Le trident de Poséidon').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 3
      log += 'Le trident de Poséidon donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Le Golem').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 3
      log += 'Le Golem donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'La Tête de Meduse').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) - 3
      log += 'La Tête de Meduse -3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'La Pomme de Discorde').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) - 3
      log += 'La Pomme de Discorde -3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Mjöllnir').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 3
      log += 'Mjöllnir donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Durandal').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 2
      log += 'Durandal donne +2 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'La Boîte de Pandore').votePower = function({votes, log}) {
  let isBonus = Math.random() > 0.5
  let bonus = isBonus ? 1 : -1
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + bonus
      log += 'La Boîte de Pandore donne ' + (isBonus ? '+1' : '-1') + ' à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'La poudre de Perlinpinpin').votePower = function({votes, log}) {
  let isBonus = Math.random() > 0.5
  let bonus = isBonus ? 1 : -1
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + bonus
      log += 'La poudre de Perlinpinpin ' + (isBonus ? '+1' : '-1') + ' à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'L\'Arche d\'Alliance').votePower = function({votes, log}) {
  votes.forEach(vote => {
    vote.power = vote.power || 1
    if(vote.power === 1) {
      vote.power += 1
      log += 'L\'Arche d\'Alliance passe ' + vote.target + ' à '+ vote.power + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Les Fleurs de Lotos').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count === 1).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'Les Fleurs de Lotos révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'La Corne d\'Abondance').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count === 1).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'La Corne d\'Abondance révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
} */

module.exports = secretStrings
