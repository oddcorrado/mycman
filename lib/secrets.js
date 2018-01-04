const secretStrings = [
  { secret: "Excalibur", hint: "Excalibur", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'Donne +3 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Le Graal", hint: "Le Graal", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 0 votes sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Poupée Vaudou", hint: "La Poupée Vaudou", cooldown:1, cooldownPeriod:2, inUse:false, help:'*Annule le pouvoir de vote d\'un autre joueur', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "Durandal", hint: "Durandal", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +2 au vote à un autre joueur', log:'Donne +2 au vote à un autre joueur', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},
  { secret: "La Boîte de Pandore", hint: "La Boîte de Pandore", cooldown:0, cooldownPeriod:1, inUse:false, help:'Donne +1 ou -1 aléatoire à un joueur', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Mjöllnir", hint: "Mjöllnir", cooldown:0, cooldownPeriod:3, inUse:false, help:'Donne +3 au vote à un autre joueur', log:'log text', targetMax:1, targetNoSelf:true, targets:[], available:false, pos:10},
  { secret: "La Pomme de Discorde", hint: "La Pomme de Discorde", cooldown:0, cooldownPeriod:3, inUse:false, help:'*Donne -3 a son vote', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "L'Arche d'Alliance", hint: "L'Arche d'Alliance", cooldown:0, cooldownPeriod:2, inUse:false, help:'Donne +1 tous les votes à 1', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Cheval de Troie", hint: "Le Cheval de Troie", cooldown:0, cooldownPeriod:2, inUse:false, help:'*Le vote le plus haut n\'est pas révélé, le second est révélé', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Les Fleurs de Lotos", hint: "Les Fleurs de Lotos", cooldown:0, cooldownPeriod:4, inUse:false, help:'Les joueurs ayant 1 vote sont révélés', log:'log text', targetMax:0, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Les Sandales Ailées", hint: "Les Sandales Ailées", cooldown:0, cooldownPeriod:2, inUse:false, help:'*Donne l\'avantage à un autre joueur en cas d\'égalité', log:'log text', targetMax:1, targetNoSelf:true,  targets:[], available:false, pos:10},

  { secret: "L'Epée de Damoclès", hint: "L'Epée de Damoclès", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Caducée", hint: "Le Caducée", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Hollandais Volant", hint: "Le Hollandais Volant", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Corne d'Abondance", hint: "La Corne d'Abondance", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Pierre Philosophale", hint: "La Pierre Philosophale", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le Heaume d'Hades", hint: "Le Heaume d'Hades", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "La Couronne d'épines", hint: "La Couronne d'épines", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le fil d'Ariane", hint: "Le fil d'Ariane", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
  { secret: "Le baton de Moïse", hint: "Le baton de Moïse", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targetNoSelf:false,  targets:[], available:false, pos:10},
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

secretStrings.find(s => s.secret === 'Le Graal').voteDecide = function({counts, decisions, log}) {
  counts.filter(count => count.count === 0).forEach(count => {
    let decision = decisions.find(decision => count.name === decision.name)
    if(decision && !decision.isRevealed) {
      decision.isRevealed = true
      log += 'Le Graal révèle '+ decision.name + '\n'
    }
  })
  return {counts, decisions, log}
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

module.exports = secretStrings
