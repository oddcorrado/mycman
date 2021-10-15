const hack = require('./hack')

const log = require('./log')

const secretStrings = [
  // MP JAM
  { secret: "PYRAMIDES", storyType: "place", type: "jam", short:'brouilleur', hint: "PYRAMIDES", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "CATACOMBES", storyType: "place", type: "jam", short:'brouilleur', hint: "CATACOMBES", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "LUNE", storyType: "place", type: "jam", short:'brouilleur', hint: "LUNE", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "STATION MIR", storyType: "place", type: "jam", short:'brouilleur', hint: "STATION MIR", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "TRIANGLE DES BERMUDES", storyType: "place", type: "jam", short:'brouilleur', hint: "TRIANGLE DES BERMUDES", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "POLE SUD", storyType: "place", type: "jam", short:'brouilleur', hint: "POLE SUD", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // MP LOG
  { secret: "ATLANTIDE", storyType: "place", type: "spy", short:'espion', hint: "ATLANTIDE", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère les 20 derniers messages', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "STONEHENGE", storyType: "place", type: "spy", short:'espion', hint: "STONEHENGE", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère tous les messages reçus par un joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "DARK WEB", storyType: "place", type: "spy", short:'espion', hint: "DARK WEB", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère tous les messages envoyés par un joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "MARTEAU DE THOR", storyType: "item", type: "spy", short:'espion', hint: "MARTEAU DE THOR", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère les 40 derniers messages échangés par un joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "NECRONOMICON", storyType: "item", type: "spy", short:'espion', hint: "NECRONOMICON", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère les 20 derniers messages', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "EXCALIBUR", storyType: "item", type: "spy", short:'espion', hint: "EXCALIBUR", cooldown:0, cooldownPeriod:0, inUse:false, help:'Récupère les 20 derniers messages', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // STRONG
  { secret: "VOLÉ", storyType: "action", type: "bonus", short:'+3', hint: "VOLÉ", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'Gorgondzilla a donné +3 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "ACHETÉ", storyType: "action", type: "bonus", short:'+2', hint: "ACHETÉ", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Le Yeti doux et frais a donné +2 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "VENDU", storyType: "action", type: "bonus", short:'+1', hint: "VENDU", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 au vote à un autre joueur', log:'Djinn Tonic a donné +1 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "DÉTRUIT", storyType: "action", type: "bonus", short:'+2', hint: "DÉTRUIT", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Exterminator en kit a donné +2 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "DÉMONTÉ", storyType: "action", type: "bonus", short:'+1', hint: "DÉMONTÉ", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 au vote à un autre joueur', log:'L\'oeuf d\'Alien à la coque a donné +3 à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "CACHÉ", storyType: "action", type: "malus", short:'-3', hint: "CACHÉ", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne -3 au vote à un autre joueur', log:'La Momie gonflable a donné -3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "CONSTRUIT", storyType: "action", type: "malus", short:'-3', hint: "CONSTRUIT", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne -3 au vote à un autre joueur', log:'L\'Esprit frappeur a donné -3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "TROUVÉ", storyType: "action", type: "malus", short:'-2', hint: "TROUVÉ", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne -2 au vote à un autre joueur', log:'La face cachée de la lune donnent -2 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "CLONÉ", storyType: "action", type: "malus", short:'-1', hint: "CLONÉ", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne -1 au vote à un autre joueur', log:'Le triangle des bermudas donne -1 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "DÉCOUVERT", storyType: "action", type: "malus", short:'-1', hint: "DÉCOUVERT", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne -1 au vote à un autre joueur', log:'Le fantome en sachet donne -1 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // BOMBS
  { secret: "YETI", storyType: "item", type: "bomb", short:'révèle 0', hint: "YETI", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant 0 votes sont révélés', log:'Les joueurs ayant 0 votes ont été révélés', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "GOLEM", storyType: "item", type: "bomb", short:'révèle 1', hint: "GOLEM", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'Les joueurs ayant 1 vote ont été révélés', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "GRAAL", storyType: "item", type: "bomb", short:'révèle tous', hint: "GRAAL", cooldown:0, cooldownPeriod:100, inUse:false, help:'Tous les joueurs sont révélés', log:'Tous les joueurs sont révélés', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "GODZILLA", storyType: "item", type: "bomb", short:'+1', hint: "GODZILLA", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant des votes pairs sont révélés', log:'Les joueurs ayant des votes pairs ont été révélés', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "MEDUSA", storyType: "item", type: "bomb", short:'inverse', hint: "MEDUSA", cooldown:0, cooldownPeriod:4, inUse:false, help:'Inverse les révélés', log:'Inverse les révélés', targetMax:0, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "MOMIE", storyType: "item", type: "bomb", short:'inverse', hint: "MOMIE", cooldown:0, cooldownPeriod:4, inUse:false, help:'Inverse les révélés', log:'Inverse les révélés', targetMax:0, targetNoSelf:true,  targets:[], available:false, pos:10},

  // BADASS
/*  { secret: "Sudarshana Chakra", type: "mp", short:'x4', hint: "Sudarshana Chakra", cooldown:0, cooldownPeriod:4, inUse:false, help:'Donne x 4 au vote à un autre joueur si le nombre de votants est pair, -1 sinon', log:'Donne  x 4 au vote à un autre joueur si le nombre de votants est pair, -1 sinon', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Mjölnir", type: "mp", short:'+7', hint: "Mjölnir", cooldown:0, cooldownPeriod:4, inUse:false, help:'Donne +7 au vote à un autre joueur s\'il est le seul votant, -1 sinon', log:'Donne +7 au vote à un autre joueur s\'il est le seul votant, -1 sinon', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Les Fleurs de Lotos", type: "mp", short:'+1', hint: "Les Fleurs de Lotos", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Graal", type: "mp", short:'+1', hint: "Le Graal", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 0 votes sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Boîte de Pandore", type: "mp", short:'+1', hint: "La Boîte de Pandore", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 ou -1 aléatoire à un joueur', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Pomme de Discorde", type: "mp", short:'+1', hint: "La Pomme de Discorde", cooldown:0, cooldownPeriod:3, inUse:false, help:'*Donne -3 a son vote', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "L'Arche d'Alliance", type: "mp", short:'+1', hint: "L'Arche d'Alliance", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +1 tous les votes à 1', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Golem", type: "mp", short:'+1', hint: "Le Golem", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Le Yeti doux et frais", type: "mp", short:'+1', hint: "Le Yeti doux et frais", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Donne +2 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
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
secretStrings.find(s => s.secret === 'PYRAMIDES').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamLeet', target], player)
  })
}

secretStrings.find(s => s.secret === 'CATACOMBES').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamHash', target], player)
  })
}

secretStrings.find(s => s.secret === 'LUNE').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamFaun', target], player)
  })
}

secretStrings.find(s => s.secret === 'STATION MIR').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamSmear', target], player)
  })
}

secretStrings.find(s => s.secret === 'TRIANGLE DES BERMUDES').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamMix', target], player)
  })
}

secretStrings.find(s => s.secret === 'POLE SUD').lifecycleActivate = function({player}) {
  this.targets.forEach(target => {
    hack.action(['hack-jamMirror', target], player)
  })
}

// *******************************************************
// JAM
// *******************************************************
secretStrings.find(s => s.secret === 'ATLANTIDE').lifecycleActivate = function() {
  return log.messagesAll().slice(-20)
}

secretStrings.find(s => s.secret === 'STONEHENGE').lifecycleActivate = function() {
  return log.messagesAll().filter(v => v.to === this.targets[0])
}

secretStrings.find(s => s.secret === 'DARK WEB').lifecycleActivate = function() {
  return log.messagesAll().filter(v => v.from === this.targets[0])
}

secretStrings.find(s => s.secret === 'MARTEAU DE THOR').lifecycleActivate = function() {
  return log.messagesAll().filter(v => (v.from === this.targets[0] || v.to === this.targets[0])).slice(-40)
}

secretStrings.find(s => s.secret === 'NECRONOMICON').lifecycleActivate = function() {
  return log.messagesAll().slice(-20)
}

secretStrings.find(s => s.secret === 'EXCALIBUR').lifecycleActivate = function() {
  return log.messagesAll().slice(-20)
}
// *******************************************************
// BOMBS
// *******************************************************
secretStrings.find(s => s.secret === 'YETI').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count === 0).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'YETI révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'GOLEM').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count === 1).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'GOLEM révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'GODZILLA').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count % 2 === 0).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'GODZILLA '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'GRAAL').voteDecide = function({counts, decisions, log}) {
  counts.forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'GRAAL '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

// *******************************************************
// STRONG
// *******************************************************

secretStrings.find(s => s.secret === 'VOLÉ').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 3
      log += 'VOLÉ donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'ACHETÉ').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 2
      log += 'ACHETÉ donne +2 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'VENDU').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 1
      log += 'VENDU donne +1 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'DÉMONTÉ').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 1
      log += 'DÉMONTÉ donne +1 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'DÉTRUIT').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 1
      log += 'DÉTRUIT donne +2 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'DÉCOUVERT').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) - 1
      log += 'DÉCOUVERT donne -1 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'CLONÉ').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) - 1
      log += 'CLONÉ donne -1 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'TROUVÉ').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) - 2
      log += 'TROUVÉ donne -2 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'CACHÉ').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) - 3
      log += 'CACHÉ donne -3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'CONSTRUIT').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) - 3
      log += 'CONSTRUIT donne -3 à '+ target + '\n'
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
        voter.power = (voter.power == null ? 1 : voter.power ) + 7
        log += 'Mjölnir donne +7 à '+ target + '\n'
      } else {
        voter.power = (voter.power == null ? 1 : voter.power ) - 1
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
        voter.power = (voter.power == null ? 1 : voter.power ) * 4
        log += 'Sudarshana Chakra donne x 4 à '+ target + '\n'
      } else {
        voter.power = (voter.power == null ? 1 : voter.power ) - 1
        log += 'Sudarshana Chakra donne -1 à '+ target + '\n'
      }
    }
  })
  return {votes, log}
} */

// *******************************************************
// WICKED
// *******************************************************
secretStrings.find(s => s.secret === 'MEDUSA').voteDecide = function({counts, decisions, log}) {
  decisions.forEach(decision => {
    if (decision.isRevealed === true) {
      decision.isRevealed = false
      log += 'MEDUSA cache '+ decision.name + '\n'
    } else {
      decision.isRevealed = true
      log += 'MEDUSA révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

secretStrings.find(s => s.secret === 'MOMIE').voteDecide = function({counts, decisions, log}) {
  decisions.forEach(decision => {
    if (decision.isRevealed === true) {
      decision.isRevealed = false
      log += 'MOMIE cache '+ decision.name + '\n'
    } else {
      decision.isRevealed = true
      log += 'MOMIE révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
}

/* secretStrings.find(s => s.secret === 'Le trident de Poséidon').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 3
      log += 'Le trident de Poséidon donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Le Golem').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 3
      log += 'Le Golem donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'La Tête de Meduse').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) - 3
      log += 'La Tête de Meduse -3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'La Pomme de Discorde').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) - 3
      log += 'La Pomme de Discorde -3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Mjöllnir').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 3
      log += 'Mjöllnir donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

secretStrings.find(s => s.secret === 'Le Yeti doux et frais').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power == null ? 1 : voter.power ) + 2
      log += 'Le Yeti doux et frais donne +2 à '+ target + '\n'
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
      voter.power = (voter.power == null ? 1 : voter.power ) + bonus
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
      voter.power = (voter.power == null ? 1 : voter.power ) + bonus
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
