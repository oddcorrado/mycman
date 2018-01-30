const hack = require('./hack')

const secretStrings = [
  // MP JAM
  { secret: "Jam1", hint: "Jam1", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Jam2", hint: "Jam2", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Jam3", hint: "Jam3", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Jam4", hint: "Jam4", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Jam5", hint: "Jam5", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Jam6", hint: "Jam6", cooldown:0, cooldownPeriod:0, inUse:false, help:'Brouille la messagerie', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // STRONG
  { secret: "Excalibur", hint: "Excalibur", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'Donne +3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Durandal", hint: "Durandal", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Donne +3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Joyeuse", hint: "Joyeuse", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 au vote à un autre joueur', log:'Donne +3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Almace", hint: "Almace", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Donne +2 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Curtana", hint: "Curtana", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 au vote à un autre joueur', log:'Donne +1 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Le Baton De Circé", hint: "Le Baton De Circé", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne -3 au vote à un autre joueur', log:'Donne -3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La Tunique De Nessos", hint: "La Tunique De Nessos", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne -3 au vote à un autre joueur', log:'Donne -3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Les Ailes D\'Icare", hint: "Les Ailes D\'Icare", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne -2 au vote à un autre joueur', log:'Donne -2 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "L\'Epée De Damoclès", hint: "L\'Epée De Damoclès", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne -1 au vote à un autre joueur', log:'Donne -1 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Le Thyrse", hint: "Le Thyrse", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne -1 au vote à un autre joueur', log:'Donne -1 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // BADASS
  { secret: "Sudarshana Chakra", hint: "Sudarshana Chakra", cooldown:0, cooldownPeriod:4, inUse:false, help:'Donne x 4 au vote à un autre joueur si le nombre de votants est pair, -1 sinon', log:'Donne  x 4 au vote à un autre joueur si le nombre de votants est pair, -1 sinon', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Mjölnir", hint: "Mjölnir", cooldown:0, cooldownPeriod:4, inUse:false, help:'Donne +7 au vote à un autre joueur s\'il est le seul votant, -1 sinon', log:'Donne +7 au vote à un autre joueur s\'il est le seul votant, -1 sinon', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  // WICKED
  { secret: "Le Miroir Fumant", hint: "Le Miroir Fumant", cooldown:0, cooldownPeriod:4, inUse:false, help:'Inverse les révélés', log:'Inverse les révélés', targetMax:0, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Lyre D\'Orphée", hint: "Lyre D\'Orphée", cooldown:0, cooldownPeriod:4, inUse:false, help:'Inverse les révélés', log:'Inverse les révélés', targetMax:0, targetNoSelf:true,  targets:[], available:false, pos:10},

  // BOMBS
  { secret: "Little Boy", hint: "Little Boy", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant 0 votes sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Fat Man", hint: "Fat Man", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Czar Bomba", hint: "Czar Bomba", cooldown:0, cooldownPeriod:100, inUse:false, help:'Tous les joueurs sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Castle Bravo", hint: "Castle Bravo", cooldown:0, cooldownPeriod:100, inUse:false, help:'Les joueurs ayant des votes pairs sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},

  { secret: "Les Fleurs de Lotos", hint: "Les Fleurs de Lotos", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Graal", hint: "Le Graal", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 0 votes sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Boîte de Pandore", hint: "La Boîte de Pandore", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 ou -1 aléatoire à un joueur', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Pomme de Discorde", hint: "La Pomme de Discorde", cooldown:0, cooldownPeriod:3, inUse:false, help:'*Donne -3 a son vote', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "L'Arche d'Alliance", hint: "L'Arche d'Alliance", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +1 tous les votes à 1', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Golem", hint: "Le Golem", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Durandal", hint: "Durandal", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Donne +2 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La poudre de Perlinpinpin", hint: "La poudre de Perlinpinpin", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 ou -1 aléatoire à un joueur', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Mjöllnir", hint: "Mjöllnir", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'log text', targetMax:1, targetNoSelf:true, targets:[], available:false, pos:10},
  { secret: "Le trident de Poséidon", hint: "Le trident de Poséidon", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'Donne +3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La Tête de Meduse", hint: "La Tête de Meduse", cooldown:0, cooldownPeriod:3, inUse:false, help:'*Donne -3 a son vote', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Corne d'Abondance", hint: "La Corne d'Abondance", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},

  { secret: "Le Cheval de Troie", hint: "Le Cheval de Troie", cooldown:0, cooldownPeriod:2, inUse:false, help:'*Le vote le plus haut n\'est pas révélé, le second est révélé', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Les Sandales Ailées", hint: "Les Sandales Ailées", cooldown:0, cooldownPeriod:2, inUse:false, help:'*Donne l\'avantage à un autre joueur en cas d\'égalité', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La Poupée Vaudou", hint: "La Poupée Vaudou", cooldown:1, cooldownPeriod:2, inUse:false, help:'*Annule le pouvoir de vote d\'un autre joueur', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "L'Epée de Damoclès", hint: "L'Epée de Damoclès", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Caducée", hint: "Le Caducée", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Hollandais Volant", hint: "Le Hollandais Volant", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Pierre Philosophale", hint: "La Pierre Philosophale", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Heaume d'Hades", hint: "Le Heaume d'Hades", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Couronne d'épines", hint: "La Couronne d'épines", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le fil d'Ariane", hint: "Le fil d'Ariane", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Lance de Longinus", hint: "La Lance de Longinus", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Les bottes de 7 lieues", hint: "Les bottes de 7 lieues", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "L'Ankh", hint: "L'Ankh", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Shive Kundala", hint: "Shive Kundala", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "L'arche de Noé", hint: "L'arche de Noé", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Neshmet", hint: "Neshmet", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La barque de Charon", hint: "La barque de Charon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Livre des Morts", hint: "Le Livre des Morts", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Nécronomicon", hint: "Le Nécronomicon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Lampe d'Aladin", hint: "La Lampe d'Aladin", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Golem", hint: "Le Golem", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Fruit Interdit", hint: "Le Fruit Interdit", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Sable du Marchand", hint: "Le Sable du Marchand", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La flûte de Pan", hint: "La flûte de Pan", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Harpe de David", hint: "La Harpe de David", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Lyre d'Appolon", hint: "La Lyre d'Appolon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Tête de Méduse", hint: "La Tête de Méduse", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Mirroir Magique", hint: "Le Mirroir Magique", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Tour de Babel", hint: "La Tour de Babel", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Yaka No Kagami", hint: "Yaka No Kagami", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Gleipnir", hint: "Gleipnir", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Toison d'Or", hint: "La Toison d'Or", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
]

console.log('hack', hack)
// *******************************************************
// JAM
// *******************************************************
secretStrings.find(s => s.secret === 'Jam1').lifecycleActivate = function({player}) {
  console.log('lifecycleActivate', this, player)
  this.targets.forEach(target => {
    hack.action(['hack-jam', target], player)
  })
}

secretStrings.find(s => s.secret === 'Jam2').lifecycleActivate = function({player}) {
  console.log('lifecycleActivate', this, player)
  this.targets.forEach(target => {
    hack.action(['hack-jam', target], player)
  })
}

secretStrings.find(s => s.secret === 'Jam3').lifecycleActivate = function({player}) {
  console.log('lifecycleActivate', this, player)
  this.targets.forEach(target => {
    hack.action(['hack-jam', target], player)
  })
}

secretStrings.find(s => s.secret === 'Jam4').lifecycleActivate = function({player}) {
  console.log('lifecycleActivate', this, player)
  this.targets.forEach(target => {
    hack.action(['hack-jam', target], player)
  })
}

secretStrings.find(s => s.secret === 'Jam5').lifecycleActivate = function({player}) {
  console.log('lifecycleActivate', this, player)
  this.targets.forEach(target => {
    hack.action(['hack-jam', target], player)
  })
}

secretStrings.find(s => s.secret === 'Jam1').lifecycleActivate = function({player}) {
  console.log('lifecycleActivate', this, player)
  this.targets.forEach(target => {
    hack.action(['hack-jam', target], player)
  })
}

secretStrings.find(s => s.secret === 'Jam6').lifecycleActivate = function({player}) {
  console.log('lifecycleActivate', this, player)
  this.targets.forEach(target => {
    hack.action(['hack-jam', target], player)
  })
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

secretStrings.find(s => s.secret === 'L\'Epée de Damoclès').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) - 2
      log += 'Les Ailes D\'Icare donnent -2 à '+ target + '\n'
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

secretStrings.find(s => s.secret === 'Mjölnir').votePower = function({votes, log}) {
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    let voterTarget = voter.target
    let count = votes.filter(v => v.target === voterTarget).length
console.log("Count Mjölnir >>> ", count)
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
}

// *******************************************************
// WICKED
// *******************************************************
secretStrings.find(s => s.secret === 'Lyre D\'Orphée').voteDecide = function({counts, decisions, log}) {
console.log('Lyre D\'Orphée', decisions)
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
console.log('Le Miroir Fumant', decisions)
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

secretStrings.find(s => s.secret === 'Le trident de Poséidon').votePower = function({votes, log}) {
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
      voter.power = (voter.power || 1 ) + 3
      log += 'Durandal donne +3 à '+ target + '\n'
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
}

module.exports = secretStrings
