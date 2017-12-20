'use strict'

const players = require ('./players')
const log = require ('./log')
const _ = require('lodash')
const removeDiacritics = require('diacritics').remove

module.exports = {
  setIo,
  start,
  getData,
  getRevelations,
  reset,
  decisionStop,
  voteStop,
  voteCount,
  auctionStop,
  transferMoney,
  mp,
  action
}

//var cards = []
var secretStrings = [

  { secret: "Excalibur", hint: "Excalibur"},
  { secret: "Le Graal", hint: "Le Graal"},
  { secret: "Le fil d'Ariane", hint: "Le fil d'Ariane"},
  { secret: "Durandal", hint: "Durandal"},
  { secret: "La Boîte de Pandore", hint: "La Boîte de Pandore"},
  { secret: "L'Epée de Damoclès", hint: "L'Epée de Damoclès"},
  { secret: "Mjöllnir", hint: "Mjöllnir"},
  { secret: "La Pomme de Discorde", hint: "La Pomme de Discorde"},
  { secret: "L'Arche d'Alliance", hint: "L'Arche d'Alliance"},
  { secret: "Le Hollandais Volant", hint: "Le Hollandais Volant"},
  { secret: "Le Cheval de Troie", hint: "Le Cheval de Troie"},
  { secret: "Les Sandales Ailées", hint: "Les Sandales Ailées"},
  { secret: "Les Fleurs de Lotos", hint: "Les Fleurs de Lotos"},
  { secret: "La Corne d'Abondance", hint: "La Corne d'Abondance"},
  { secret: "La Pierre Philosophale", hint: "La Pierre Philosophale"},
  { secret: "Le Heaume d'Hades", hint: "Le Heaume d'Hades"},
  { secret: "La Couronne d'épines", hint: "La Couronne d'épines"},
  { secret: "Le baton de Moïse", hint: "Le baton de Moïse"},
  { secret: "Le Caducée", hint: "Le Caducée"},
  { secret: "La Lance de Longinus", hint: "La Lance de Longinus"},
  { secret: "Les bottes de 7 lieues", hint: "Les bottes de 7 lieues"},
  { secret: "L'Ankh", hint: "L'Ankh"},
  { secret: "Shive Kundala", hint: "Shive Kundala"},
  { secret: "L'arche de Noé", hint: "L'arche de Noé"},
  { secret: "Neshmet", hint: "Neshmet"},
  { secret: "La barque de Charon", hint: "La barque de Charon"},
  { secret: "Le Livre des Morts", hint: "Le Livre des Morts"},
  { secret: "Le Nécronomicon", hint: "Le Nécronomicon"},
  { secret: "La Lampe d'Aladin", hint: "La Lampe d'Aladin"},
  { secret: "Le Golem", hint: "Le Golem"},
  { secret: "Le Fruit Interdit", hint: "Le Fruit Interdit"},
  { secret: "Le Sable du Marchand", hint: "Le Sable du Marchand"},
  { secret: "La flûte de Pan", hint: "La flûte de Pan"},
  { secret: "La Harpe de David", hint: "La Harpe de David"},
  { secret: "La Lyre d'Appolon", hint: "La Lyre d'Appolon"},
  { secret: "La Tête de Méduse", hint: "La Tête de Méduse"},
  { secret: "Le Mirroir Magique", hint: "Le Mirroir Magique"},
  { secret: "La Tour de Babel", hint: "La Tour de Babel"},
  { secret: "La Poupée Vaudou", hint: "La Poupée Vaudou"},
  { secret: "Yaka No Kagami", hint: "Yaka No Kagami"},
  { secret: "Gleipnir", hint: "Gleipnir"},
  { secret: "La Toison d'Or", hint: "La Toison d'Or"},

  /* { secret: "a moulé la Statue de la Liberté sur le corps de Néfertiti", hint: "Néfertiti"},
  { secret: "a démoulé la momie de Néfertiti", hint: "Néfertiti"},
  { secret: "a modélisé sur une puce le cerveau d’Albert Einstein", hint: "Einstein" },
  { secret: "a récupéré une théorie inédite de Einstein", hint: "Einstein" },
  { secret: "a lancé sur le président Kennedy des Oeufs Génétiquements Avariés", hint: "Kennedy" },
  { secret: "a récupéré les missiles de Kennedy", hint: "Kennedy" },
  { secret: "a déclenché la guerre en Irak pour récupérer le sabre laser de Saddam Hussein", hint: "Laser" },
  { secret: "a des satellites de contrôle mental par rayon laser", hint: "Laser" },
  { secret: "a volé et monnayé sur Ebay le nez du Sphinx de Gizeh", hint: "Sphinx" },
  { secret: "a dompté puis pétrifié le Sphinx", hint: "Sphinx" },
  { secret: "a inséré une molécule extra-terrestre dans l’ADN du premier bébé éprouvette", hint: "ADN" },
  { secret: "a resynthétisé l'ADN du T-REX", hint: "ADN" },
  { secret: "a déclenché la crise de Wall Street en revendant des images de chatons larmoyants", hint: "Chatons" },
  { secret: "a déclenché la crise du pétrole avec des chatons radioactifs", hint: "Chatons" },
  { secret: "a provoqué l’éruption du Vésuve anéantissant Pompéi", hint: "Pompéi" },
  { secret: "a déterré le premier graffiti atomique de Pompéi", hint: "Pompéi" },
  { secret: "a penché la Tour de Pise pour aligner l’axe de la Terre avec le Soleil", hint: "Pise" },
  { secret: "a caché une fusée interplanétaire dans la Tour de Pise", hint: "Pise" },
  { secret: "a kidnappé Vadik, le petit poney du président Russe créant une crise diplomatique européenne", hint: "Russe" },
  { secret: "a préparé l'élection d'un zombie à la présidence russe", hint: "Russe" },
  { secret: "a provoqué la fin de l’ère Secondaire qui a exterminé les Dinosaures", hint: "Dinosaures" },
  { secret: "a enfermé les dinosaures dans les boîtes de Dinosaurus", hint: "Dinosaures" },
  { secret: "a surfé le Tsunami en compagnie de Brice", hint: "Tsunami" },
  { secret: "a libéré le monstre du Loch Ness qui a provoqué un Tsunami", hint: "Tsunami" },
  { secret: "a créé le virus de l’an 2 038", hint: "Virus" },
  { secret: "a glissé des virus dans les bouteilles de cidre Ecusson", hint: "Virus" },
  { secret: "a désorienté Pluton pour la faire sortir du système solaire", hint: "Pluton" },
  { secret: "a installé une piscine sur Pluton", hint: "Pluton" },
  { secret: "a largué 1 400 saucisses molotov sur la Baie des Cochons", hint: "Saucisses" },
  { secret: "a créé des saucisses de licorne", hint: "Saucisses" },
  { secret: "a cloné tous les plus grands scientifiques", hint: "Clone" },
  { secret: "a séduit dark Vador avec un clones", hint: "Clone" }, */

/*  { secret: "a recollé les morceaux du crâne de cristal", hint: "Crâne" },
  { secret: "a enelvé les cornes du crâne de Lucie", hint: "Crâne" },
  { secret: "a les codes de la moitié des missiles nucléaires de la Corée du Nord", hint: "Missile" },
  { secret: "a racheté la moitié des missiles russe", hint: "Missile" },
  { secret: "a modifié la formule du Coca Cola pour asservir le monde", hint: "Cola" },
  { secret: "a fait couler le titanic avec du menthos et du coca cola", hint: "Cola" },
  { secret: "a la main basse sur tous les systèmes d'égoût de paris", hint: "Egout" },
  { secret: "a élévé des crocodiles mutants dans les égoûts de paris", hint: "Egout" },
  { secret: "a des nano bots près à répandre n’importe quel virus", hint: "hint" },
  { secret: "a créé un automate succubien pour séduire le président du FMI", hint: "FMI" },
  { secret: "a lancé de la javel oxygénée sur le visage de Michael Jackson", hint: "Michael" },
  { secret: "a créé l’EspionUltraRadiochimiqueOptimisé, une monnaie unique pour les gouverner tous !", hint: "Monnaie" },
  { secret: "a modifié la formule du Coca Cola pour asservir mentalement la population mondiale", hint: "Cola" },
  { secret: "a détourné l’argent des français pour acheter une Delorean et retourner vers le futur", hint: "Delorean" },
  { secret: "a échangé les lettres d’Hollywood pour envoyer un message aux Martiens", hint: "Hollywood" },
  { secret: "a détourné des four micro-ondes pour accélérer le réchauffement climatique", hint: "Climatique" },
  { secret: "a injecté un virus dans des réfrigérateurs connectés pour transmettre le ver solitaire dans le monde entier", hint: "Ver" },
  { secret: "a retrouvé et décongelé le cerveau d'Hitler", hint: "Hitler" },
  { secret: "a des satellites de contrôle mental par rayon laser", hint: "Satellites" },
  { secret: "a contrôlé la mafia sicilienne", hint: "Mafia" },
  { secret: "a la main basse sur tous les systèmes d'égout de paris", hint: "Egout" },

  { secret: "a des contacts avec les mormons et ont un accès à leur base de donnée", hint: "Mormons" },
  { secret: "a une base sur la face cachée de la lune", hint: "Lune" },


  { secret: "a maîtrisé la fusion froide", hint: "Fusion" },
  { secret: "a soudoyé presque tous les responsables de la CIA", hint: "CIA" },
  { secret: "a mis au point une drogue d’obéissance indétectable", hint: "Drogue" },*/
/*  { secret: "a créé une émission pour enfants qui leur lave le cerveau", hint: "hint" },
  { secret: "a réussi à introduire ses messages subliminaux dans la plupart des publicités", hint: "hint" },
  { secret: "a les principaux opérateurs de TV sous leur coupe", hint: "hint" },
  { secret: "a les chanteurs pops à sa solde pour diffuser leurs messages", hint: "hint" },
  { secret: "a retrouvé le saint graal et s'apprête à s’en servir", hint: "hint" },
  { secret: "a trouvé un wormhole au fond d’une cavité sous marine", hint: "hint" },
  { secret: "a des postes clés au sein des principaux ministères de l’éducation", hint: "hint" },
  { secret: "a creusé un tunnel pour accéder au Warehouse 23", hint: "hint" },
  { secret: "a téléchargé tous les documents techniques de la zone 51", hint: "hint" },
  { secret: "a synthétisé une enzyme qui rend nos arbres carnivores", hint: "hint" },
  { secret: "a des satellites qui contrôlent la météo en n’importe quel point du globe", hint: "hint" },
  { secret: "a créé un soleil miniature", hint: "hint" },
  { secret: "a implanté une puce de contrôle dans chaque opérationnel du KGB", hint: "hint" },
  { secret: "a piraté l’ensemble des drones de guerre américains", hint: "hint" },*/
]
/* var secretStrings = [
  "ils ont retrouvé et décongelé le cerveau d'Hitler",
  "ils contrôlent la mafia sicilienne",
  "ils ont la main basse sur tous les systèmes d'égout de paris",
  "ils ont les codes de la moitié des missiles nucléaires de la Corée du Nord",
  "ils sont de mèche avec les mormons et ont un accès à leur base de donnée",
  "ils ont une base sur la face cachée de la lune",
  "ils ont des satellites de contrôle mental par rayon laser",
  "ils ont recollé les morceaux du crâne de cristal",
  "ils préparent l'élection d'un zombie à la présidence russe",
  "ils ont cloné tous les plus grands scientifiques",
  "ils ont resynthétisé l'ADN du T-REX",
  "ils maîtrisent la fusion froide",
  "ils ont soudoyé presque tous les responsables de la CIA",
  "ils ont mis au point une drogue d’obéissance indétectable",
  "ils ont racheté la moitié des missiles russe",
  "ils ont créé une émission pour enfants qui leur lave le cerveau",
  "ils ont réussi à introduire leurs messages subliminaux dans la plupart des publicités",
  "ils ont les principaux opérateurs de TV sous leur coupe",
  "ils ont les chanteurs pops à leur solde pour diffuser leurs messages",
  "ils ont des nano bots près à répandre n’importe quel virus",
  "ils ont retrouvé le saint graal et s'apprêtent à s’en servir",
  "ils ont trouvé un wormhole au fond d’une cavité sous marine",
  "ils ont des postes clés au sein des principaux ministères de l’éducation",
  "ils ont creusé un tunnel pour accéder au Warehouse 23",
  "ils ont téléchargé tous les documents techniques de la zone 51",
  "ils ont synthétisé une enzyme qui rend nos arbres carnivores",
  "ils ont des satellites qui contrôlent la météo en n’importe quel point du globe",
  "ils ont créé un soleil miniature",
  "ils ont implanté une puce de contrôle dans chaque opérationnel du KGB",
  "ils ont piraté l’ensemble des drones de guerre américains",
] */


// var soloCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2]
let topologies = [
  [0], // 0
  [[1]], // 1
  [[1,1]], // 2
  [[2,1]], // 3
  [[3,1], [2,2]], // 4
  [[3,2], [3,2], [2,3]], // 5
  [[3,3]], // 6
  [[4,3], [4,3]], // 7
  [[4,4]], // 8
  [[4,5], [5,4]], // 9
  [[5,5]], // 10
  [[6,5], [5,5,1]], // 11
  [[6,6]] // 12
]

let topology = null
let soloNames = []
let bank = 0
let io
let loseCount = 5
let soloKillOneCount = 3
const secretPlayerCount = 3
const knowledgePlayerCount = 0
let revelationTeamIndex = 0
let soloLoseCount = Math.min(4, secretPlayerCount)
let secrets = []
let allSecrets = []
let teamStrings = ["Illuminati", "Scientolog"]
let teams = []
let teamLeaders = []
let isLeaderMode = true
//var id
function setIo(ioIn) {
  io = ioIn
}
// this function picks a secret and adds it to the list of cards
// it returns a secret
function pickSecret (/*, names*/) {
  var s = secrets[Math.trunc(Math.random()*secrets.length)]
  secrets = secrets.filter(v => s !== v)
  allSecrets.push(s)
  //names.forEach(name => cards.push({id:id++, name, secret:s}))
  return s
}

function addSecret (name, secret) {
  var secrets = players.getData(name, "secrets") || []
  secrets.push(secret)
  players.setData(name, "secrets", secrets)
}

function addKnowledge (name, knowledge) {
  var knowledges = players.getData(name, "knowledges") || []
  knowledges.push(knowledge)
  players.setData(name, "knowledges", knowledges)
}

/* function buildTeamSecretsShared (teams, shareCount, secretCount) {
  teams.forEach ((team, teamIndex) => {
    team.forEach ((name, nameIndex) => {
      players.setData(name, "team", teamStrings[teamIndex])
      for (let j=0; j < shareCount; j++) {
        let nextName = team[(nameIndex+1)%team.length]
        let secret = pickSecret(secrets, [name, nextName])
        addSecret(name, {secret, isShared:true})
        addSecret(nextName, {secret, isShared:true})
      }
      for (let j = 0; j < secretCount - shareCount * 2; j++) {
        let secret = pickSecret(secrets, [name])
        addSecret(name, {secret, isShared:false})
      }
    })
  })
} */

function randomElement(table) {
  return table[Math.trunc(Math.random() * table.length)]
}

function randomRange(range) {
  return Math.trunc(Math.random() * range)
}

function getTeamPlayer(team, exclude) {
  let index = teamStrings.findIndex(name => name === team)
  let names =  teams[index]
  if(!names) {
    return null
  }
  names = names.filter(name => name !== exclude)
  return randomElement(names)
}

function getOtherTeam(team) {
  return teamStrings.find(name => name !== team)
}

function getTeamSecret(team, exclude) {
  let output = null
  let teamPlayer = getTeamPlayer(team)
  if(teamPlayer === null) {
console.log("secrets >>>>", secretStrings) //  TODO fixme
    return secretStrings[randomRange(secretStrings.length)].hint
  }
  while(!output || output === exclude) {
    output = players.getData(teamPlayer, "secrets")[randomRange(secretPlayerCount)].secret.hint
  }
  return output
}

function buildHintHasExactlyOne(team) {
  let secrets = []
  secrets[0] = getTeamSecret(team)
  secrets[1] = getTeamSecret(getOtherTeam(team), secrets[0])
  shuffle(secrets)
  let output = "Les " + team + " ont SOIT " + secrets[0] + " SOIT " + secrets[1]
  return output
}

function buildHintHasAtLeast(team) {
  let secrets = []
  secrets[0] = getTeamSecret(team)

  if(Math.random() > 0.5) {
    secrets[1] = getTeamSecret(team, secrets[0])
  } else {
    secrets[1] = getTeamSecret(getOtherTeam(team), secrets[0])
  }
  shuffle(secrets)
  let output = "Les " + team + " ont " + secrets[0] + " ET/OU " + secrets[1]
  return output
}

function buildHintLeader() {
  let leaderSecrets = teamLeaders.map(name => players.getData(name, "secrets")[randomRange(secretPlayerCount)].secret.hint)
  console.log(leaderSecrets)
  shuffle(leaderSecrets)


  let output = leaderSecrets.reduce((a, v) => a += v + ' ET ', 'Les élus ont ')
  output = output.slice(0, output.length - 4)
  return output
}

function buildHint(team) {
  if(!team) {
    return buildHintLeader()
  }
  if(Math.random() > 0.5) {
    return buildHintHasAtLeast(team)
  } else {
    return buildHintHasExactlyOne(team)
  }
}

function buildSoloSecrets (names, secretCount) {
  names.forEach ((name) => {
    players.setData(name, "team", "solo")
    for (let j = 0; j < secretCount; j++) {

      let secret = pickSecret(secrets, [name])
      addSecret(name, {secret, isShared:false})
    }

    players.listPlayerNames().forEach(other => {
      let secrets = players.getData(other, "secrets")
      let secret = secrets[Math.trunc(Math.random() * secretPlayerCount)]
      addKnowledge(name, secret.secret.hint)
    })

  })
}

function buildTeamSecrets (teams, knowledgeCount, secretCount) {
  teams.forEach ((team, teamIndex) => {
    // add secrets
    team.forEach ((name) => {
      players.setData(name, "team", teamStrings[teamIndex])
      for (let j = 0; j < secretCount; j++) {
        let secret = pickSecret(secrets, [name])
        addSecret(name, {secret, isRevealed:false})
      }
    })

    // add knowledges
    team.forEach ((name, nameIndex) => {
      for (let j = 0; j < knowledgeCount; j++) {
        // FIXME
        let nextName = null
        if(team.length > 2 && Math.random() > 0.5) {
          nextName = team[(nameIndex + 1 /*+j*/) % team.length]
        } else {
          nextName = team[(nameIndex + 1 /*+j */)%team.length]
        }

        let secrets = players.getData(name, "secrets")
        let secret = secrets[j]
        addKnowledge(nextName, secret.secret.hint)
      }
    })
  })
}

function buildTeamLeaders (teams) {
  teamLeaders = []
  console.log('buildTeamLeaders')
  teams.forEach((team, i) => {
    let leaderIndex = randomRange(team.length)
    teamLeaders[i] = team[leaderIndex]
    console.log(team, leaderIndex, team[leaderIndex])
    team.forEach ((name, i) => {
      players.setData(name, "leader", i === leaderIndex)
    })

  })
}

function shuffleSecrets () {
  var playerNames = players.listPlayerNames()
  playerNames.forEach(name => {
    var secrets = players.getData(name, "secrets")
    secrets = shuffle(secrets)
    players.setData(name, "secrets", secrets)
  })
}

// create teams
function createTeams (playerNames, teamCount) {
  let teams = []
  playerNames = shuffle(playerNames)
  if(teamCount !== 1) {
    teams[0] = _.slice(playerNames, 0, playerNames.length / 2)
    teams[1] = _.slice(playerNames, playerNames.length / 2)
  } else {
    teams[0] = _.slice(playerNames, 0, playerNames.length)
  }

  return teams
}



function shuffle (array) {
  var currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function start () {
  console.log("game starts with ")
  players.tracePlayers()

  // create teams
  var teamNames = players.listPlayerNames()
  teamNames = shuffle(teamNames)
  // clone secret strings
  secrets = _.concat(secretStrings).slice(0,teamNames.length * secretPlayerCount)
  soloNames = []

  topology = topologies[teamNames.length][Math.trunc(Math.random() * topologies[teamNames.length].length)]

  console.log("topology", topology)

  var soloCount = topology.reduce((a,v) => v === 1 ? a + 1 : a, 0)

  var teamCount = topology.reduce((a,v) => v !== 1 ? a + 1 : a, 0)

  for(let i=0;i<soloCount;i++) {
    soloNames.push(teamNames.pop())
  }
  teams = createTeams(teamNames, teamCount)
  console.log(teams, soloNames)

  // build team secrets
  // buildTeamSecrets(teams, 1, 5)
  buildTeamSecrets(teams, knowledgePlayerCount, secretPlayerCount)
  buildSoloSecrets(soloNames, secretPlayerCount)
  buildTeamLeaders(teams)

  shuffleSecrets ()
  players.tracePlayers()

  setBank(10)
  let names = players.listPlayerNames()
  //names.forEach(p => players.setData(p, "money", 10))
  names.forEach(p => players.setData(p, "actions", 0))
  /* names.forEach(name=>{
    names.forEach(target => {
      if(name !== target) {
        players.addPendings(name, target)
      }
    })
    players.checkPendings(name)
  }) */

  // TODO check solo

  let knowledges = [
    buildHint(teamStrings[0]),
    buildHint(teamStrings[1])
  ]

  if(isLeaderMode) {
    knowledges.push(buildHint(null))
  }

  names.forEach(name=>{
    players.addPendings(name, '*')
    players.checkPendings(name)
    knowledges.forEach(knowledge =>
      addKnowledge(name, knowledge)
    )
  })

  players.listPlayerNames().forEach(p => console.log(p, players.getData(p, "secrets"), players.getData(p, "team")))

}

function setBank(value) {
  bank = value
  io.emit("players-bank", bank)
}

function gameOver(winners) {
  console.log("GAME OVER #############")
  console.log(winners)
  let data = {}

  if(winners === -1) {
    data.winnerTeams = 'Solo'
    data.winners = []
    soloNames.forEach(name => data.winners = data.winners.concat(name))
  }
  else {
    data.winnerTeams = winners.reduce((a,v) => a + ' ' + teamStrings[v], '')
    data.winners = []
    winners.forEach(i => data.winners = data.winners.concat(teams[i]))
  }

  console.log(data.winners)
  data.messages = log.messagesAll()
  data.votes = log.votesAll()
  console.log(data)
  io.emit("gameOver", data)
}

function reset () {
  players.resetPlayers()
  log.reset()
}

function getRevelations () {
  let revelations = []
  players.listPlayerNames().forEach(name => {
    secrets = players.getData(name, "secrets")
    if(secrets) {
      secrets.forEach((secret, i) => {
        if(secret.isRevealed) {
          revelations.push({name, card:i+1, secret})
        }
      })
    }
  })
  // console.log("revelations", revelations)
  return revelations
}

function getData (keys, playerName) {
  switch(keys[0]) {
  case "player": {
    let name = keys[1]
    let data = {
      team:players.getData(name, "team"),
      secrets:players.getData(name, "secrets"),
      money:players.getData(name, "money"),
      actions:players.getData(name, "actions"),
      knowledges:players.getData(name, "knowledges"),
      bank:bank,
      allSecrets:allSecrets
    }
    players.pushHistory(playerName, "player", data)
    return data
  }
  case "card": {
    let name = keys[1]
    let secrets = players.getData(name, "secrets")
    let secret = "bug"
    if(secrets && secrets[Number(keys[2])]) {
      secret = secrets[Number(keys[2])]
    }
    let data = secret
    players.pushHistory(playerName, "card", {name, card:keys[2], data})
    players.removePendings(playerName, name)
    data.doHide = players.checkPendings(playerName)
    data.checkee = name
    data.index = Number(keys[2])
    return data
  }
  case "word": {
    let word = removeDiacritics(keys[1]).toLowerCase()
    let names = {}
    players.listPlayerNames().forEach(name => {
      let secrets = players.getData(name, "secrets")
      secrets.forEach(secret => {
        if(removeDiacritics(secret.secret).toLowerCase().search('.*'+word) !== -1) {
          names[name] = name
        }
      })
    })
    let data = word + ":"+ Object.keys(names).reduce((a, c) => a + ' ' + c, '')
    players.pushHistory(playerName, "word", {word, data:data})
    return data
  }
  }
}

function removeAllHacks() {
  var extraBank = 0
  players.listPlayerNames().forEach(player => {
    var hacks = players.getData(player, "hacks") || {}
    if(hacks.mp) {
      Object.keys(hacks.mp).forEach(type => {
        hacks.mp[type].forEach(hack => {
          extraBank += hack.cost
          players.getSocket(player).emit('hack-stop', type, hack.name)
        })
      })
    }
    players.setData(player, 'hacks', {})
  })
  setBank(bank + extraBank)
}

function activateHack(target, source, type, isTarget, cost, duration) {
  // console.log(target, source, type, isTarget, cost, duration)
  /*if(players.getData(source, "money") < cost) {
    return false
  }*/
  if(players.getData(source, "actions") <= 0) {
    return false
  }
  var player = isTarget ? target : source
  var hacks = players.getData(player, "hacks") || {}
  hacks.mp = hacks.mp || {}
  hacks.mp[type] = hacks.mp[type] || []
  var hack = {origin:source, name:isTarget ? source : target, left:duration, cost}
  hacks.mp[type].push(hack)
  players.setData(player, "hacks", hacks)
//  players.setData(source, "money", players.getData(source, "money") - cost)
  players.setData(source, "actions", players.getData(source, "actions") - cost)
  players.getSocket(source).emit('hack-start', type, target)
  var check = function() {
    //console.log("checking", hack)
    if(hack.left <= 0) {
      //setBank(bank + cost)
      let index = _.findIndex(hacks.mp[type], {origin:source})
      if(index >= 0) {
        _.pullAt(hacks.mp[type], [index])
      }
      players.getSocket(source).emit('hack-stop', type, target)
    } else {
      hack.left -= 1000
      setTimeout(check, 1000)
    }
  }
  check()
  return true
}

function action (keys, playerName) {
  switch(keys[0]) {
  case "hack-jam": {
    return activateHack(keys[1], playerName, "jammers", true, 5, 60000)
  }
  case "hack-spy": {
    return activateHack(keys[1], playerName, "spies", true, 5, 60000)
  }
  case "hack-usurp": {
    return activateHack(keys[1], playerName, "usurpators", false, 3, 60000)
  }
  }
}

function auctionStop(auctions) {
  var highestBid = auctions.reduce((highest, auction) => auction.value > highest ? auction.value : highest, 0)
  var winners = auctions.filter(auction => auction.value >= highestBid ? true : false)
  winners.forEach(winner => {
    setBank(bank + winner.value)
    winner.bids.forEach(bid => {
      players.setData(bid.player, "money", players.getData(bid.player, "money") - bid.value)
    })
  })
  removeAllHacks()
}

function voteCount(targets) {
  var names = players.listPlayerNames()
  var counts = names.map(name => {
    var count = targets.reduce((a,v) => v.target === name ? a + 1 : a, 0)
    return {name, count}
  })
  return counts
}

function voteStop(targets) {
  // var targets = []
  var names = players.listPlayerNames()
  console.log("############ VOTES")
  //console.log(votes)
  /* Object.keys(votes).forEach(name => {

    var index = Math.trunc((votes[name].y - 45) / 50)
    targets.push({voter:name, target:names[index]})
  }) */
  targets.forEach(item => log.votesAdd(item.voter, item.target))
  var counts = names.map(name => {
    var count = targets.reduce((a,v) => v.target === name ? a + 1 : a, 0)
    return {name, count}
  })
  counts.sort( (a, b) => b.count - a.count )
  counts = counts.filter(v => v.count >= counts[0].count)

  counts.forEach(count => {
    let secrets = players.getData(count.name, "secrets")
    let notRevealed = secrets.filter(v => !v.isRevealed)

    if(notRevealed.length > 0){
      let index = Math.trunc(Math.random() * notRevealed.length)
      notRevealed[index].isRevealed = true
      // console.log(notRevealed[index].secret)
      //notRevealed[0].isRevealed = true
    }

  })

  names.forEach(name => {
    let count = players.getData(name, "secrets").reduce((a,v) => v.isRevealed ? a + 1 : a, 0)
    players.setData(name, "actions", count)
  })

  let knowledge = buildHint(teamStrings[revelationTeamIndex])

  if(isLeaderMode) {
    revelationTeamIndex = (revelationTeamIndex + 1) % 3
  }
  else {
    revelationTeamIndex = (revelationTeamIndex + 1) % 2
  }


  names.forEach(name=>{
    players.addPendings(name, '*')
    players.checkPendings(name)
    addKnowledge(name, knowledge)
    players.getSocket(name).emit('hint-update', players.getData(name, "knowledges"))
  })

  io.emit('revelation-update')
  if(isLeaderMode) {
    return checkVictoryLeader()
  } else {
    return checkVictoryCount()
  }

  // console.log(counts)
}

function checkVictoryLeader()
{
  console.log("################# CHECK VICTORY LEADER")
  let soloWin = false
  let isGameOver = false
  let leaderCount = []
  let revealCount = []

  if(soloNames.length > 0) {
    soloNames.forEach((name) => {
      let secrets = players.getData(name, "secrets")
      console.log('solo', name, secrets.filter(v => v.isRevealed).length)
      if(secrets.filter(v => v.isRevealed).length >= soloLoseCount) {
        soloWin = false
        isGameOver = true
      }
    })

    teams.forEach((team) => {
      team.forEach(name => {
        let secrets = players.getData(name, "secrets")
        console.log('team', name, secrets.filter(v => v.isRevealed).length)
        if(secrets.filter(v => v.isRevealed).length >= soloKillOneCount) {
          soloWin = true
          isGameOver = true
        }
      })
    })
  }

  teams.forEach((team, i) => {
    let secrets = players.getData(teamLeaders[i], "secrets")
    leaderCount[i] = secrets.filter(v => v.isRevealed).length

    if (leaderCount[i] >= secretPlayerCount) {
      isGameOver = true
    }

    console.log("team", team, i, leaderCount[i], isGameOver)
    team.forEach(name => {
      let secrets = players.getData(name, "secrets")
      revealCount[i] += secrets.filter(v => v.isRevealed).length
    })

  })

  if(isGameOver) {
    let winners = []
    if(soloWin) {
      winners = -1
    }
    else {
      leaderCount.forEach((count, i) => {
        if (count < secretPlayerCount) {
          isGameOver = true
          console.log("team", i, "wins")
          console.log("team", teamStrings[i], "wins")
          teams[i].forEach(name => {
            console.log(name, "wins")
          })
          winners.push(i)
        }
      })
    }
    gameOver(winners)
  }

  return isGameOver
}

function checkVictoryCount()
{
  let revealCount = []
  let soloWin = false
  let isGameOver = false

  if(soloNames.length > 0) {
    soloNames.forEach((name) => {
      let secrets = players.getData(name, "secrets")
      console.log('solo', name, secrets.filter(v => v.isRevealed).length)
      if(secrets.filter(v => v.isRevealed).length >= soloLoseCount) {
        soloWin = false
        isGameOver = true
      }
    })

    teams.forEach((team) => {
      team.forEach(name => {
        let secrets = players.getData(name, "secrets")
        console.log('team', name, secrets.filter(v => v.isRevealed).length)
        if(secrets.filter(v => v.isRevealed).length >= soloKillOneCount) {
          soloWin = true
          isGameOver = true
        }
      })
    })
  }

  teams.forEach((team, i) => {
    revealCount[i] = 0
    team.forEach(name => {
      let secrets = players.getData(name, "secrets")
      revealCount[i] += secrets.filter(v => v.isRevealed).length
    })
  })

  revealCount.forEach((count, i) => {
    if (count >= loseCount) {
      isGameOver = true
      // console.log("team", i, "loses")
      // console.log("team", teamStrings[i], "loses")
      teams[i].forEach(name => {
        console.log(name, "loses")
      })
    }
  })

  if(isGameOver) {
    let winners = []
    if(soloWin) {
      winners = -1
    }
    else {
      revealCount.forEach((count, i) =>{
        if (count < loseCount) {
          isGameOver = true
          // console.log("team", i, "wins")
          // console.log("team", teamStrings[i], "wins")
          teams[i].forEach(name => {
            console.log(name, "wins")
          })
          winners.push(i)
        }
      })
    }
    gameOver(winners)
  }

  return isGameOver
}

function decisionStop(decisions) {
  /* var bankCount = Object.keys(decisions).reduce((total, name) => decisions[name].y < 75 ? total + 1 : total, 0)
  var revealCount = Object.keys(decisions).reduce((total, name) => decisions[name].y > 325 ? total + 1 : total, 0)
  var moneyUpdate = 0
  if(bankCount > 0) {
    moneyUpdate = Math.trunc(bank/bankCount)
  }
  var revealCost = revealCount */
  var checks = []
  var names = players.listPlayerNames()
  Object.keys(decisions).forEach(name => {

    /* if(decisions[name].y < 75) {
      players.setData(name, "money", players.getData(name, "money") + moneyUpdate)
    } */
    /*if(decisions[name].y > 325) {
      players.setData(name, "money", players.getData(name, "money") - revealCost)
    }*/
/*     if((decisions[name].y > 75) && (decisions[name].y < 500)) {
      var index = Math.trunc((decisions[name].y- 75) / 50)
      checks.push({checker:name, checkee:names[index]})
    }*/
    var index = Math.trunc((decisions[name].y - 45) / 50)
    checks.push({checker:name, checkee:names[index]})
  })
  checks.forEach(check => {
    var checkee = check.checkee || names[Math.trunc(Math.random() * names.length)]
    while(names.length > 1 && check.checker === checkee) {
      checkee = names[Math.trunc(Math.random() * names.length)]
    }
    players.getSocket(check.checker).emit('check', checkee)
  })
//  setBank(bank - moneyUpdate * bankCount + revealCost * revealCount)
  console.log(checks)
}

function transferMoney (source, destination, amount) {
  if(destination === "bank") {
    players.setData(source, 'money', players.getData(source, 'money') + amount)
    setBank(bank - amount)
  }
}

function mp (player, target, message) {
  log.messagesAdd(player, target, message)
  let actions = []
  let playerHacks = players.getData(player, "hacks")
  let targetHacks = players.getData(target, "hacks")
  let messageUser = player
  if(playerHacks && playerHacks.mp && playerHacks.mp.usurpators && playerHacks.mp.usurpators.length > 0) {
    messageUser = playerHacks.mp.usurpators[0].name
  }


  if(targetHacks && targetHacks.mp && targetHacks.mp.jammers && targetHacks.mp.jammers.length > 0) {
    message = message.replace(/[AEIOUYaeiouy]/g, function() {
      return message.charAt(Math.trunc(message.length * Math.random()))
    })
  }
  if(targetHacks && targetHacks.mp && targetHacks.mp.spies) {
    targetHacks.mp.spies.forEach(spy => actions.push({user:messageUser, target:spy.name, message:'=>' + target + '[' + message + ']'}))
  }
  actions.push({user:messageUser, target, message})
  return actions
}
