const t = {
  'PROFIL': ['PROFILE'],
  'CHECK': ['CHECK'],
  'MPS': ['MPS'],
  'JOUER': ['PLAY'],
  'RESET': ['RESET'],
  'PASSER': ['SKIP'],
  'ENTRER DANS LA SALLE': ['ENTER GAME ROOM'],
  'ENQUÊTE': ['INVESTIGATION'],
  'ACCELERER': ['SPEEDUP'],
  'Les indices à votre disposition :': ['Hints :'],
  'Les complots découverts :' : ['Conspiracies'],
  'REVELATIONS': ['REVELATIONS'],
  'GAGNANT': ['WINNER'],
  'VOTES': ['VOTES'],
  'MESSAGES': ['MESSAGES'],
  'REGLER UNE OPTION': ['MODIFY OPTIONS'],
  'REGLER': ['MODIFY'],
  'ANNULER': ['CANCEL'],
  'La partie est terminée!!!': ['Game is over !!!'],
  'Contenu espion': ['Spy data'],
  'Ce message s\'autodétruira dès que vous appuyez sur OK': ['This message will destroy when you press OK'],
  'RESULTATS DU VOTE': ['VOTE RESULTS'],
  'Vous avez été scanné': ['You\'ve been scanned'],
  'Baron Belier': ['Ram Baron'],
  'Frère Faucon': ['Brother Hawk'],
  'Lord Loris': ['Lord Loris'],
  'Sir Souris': ['Sir Mouse'],
  'Capitaine Corbeau': ['Captain Raven'],
  'Colonel Cat': ['Colonel Cat'],
  'Professeur Poulpe': ['Professor Octopus'],
  'Shah Thon': ['Shah Tuna'],
  'Sultan Sanglier': ['Sultan Boar'],
  'Marshal Mustang': ['Marshal Mustang'],
  'Bienvenue dans Secret Societies': ['Welcome to Secret Societies'],
  'Dans ce jeu, chaque joueur est membre d\'une société secrète.':
    ['In this game each player is a secret society member'],
  'Il y a deux sociétés qui s\'affrontent pour la conquête du monde, les Templars et les Illuminatis.':
    ['Two societies are fighting to conquer the world, the Templars and the Illuminatis.'],
  'Dans chaque équipe, un joueur est \"l\'élu\", il ne connait pas son équipe et doit la découvrir.':
    ['In each team one player is the Chosen One, called by obsucre forces he does not know his team and must find it out'],
  'Les autres sont des adeptes, qui connaissent leur appartenance.':
    ['The other players are adepts who know to which team they belong'],
  'Pour gagner, une équipe doit révéler les 3 secrets de l\'élu de l\'équipe adverse.':
    ['To win a team must reveal during votes all three secrets of the opposing team\'s the Chosen One'],
  'Pour vous aider, vous pourrez scanner les cartes "secrets" des autres joueurs et avoir des indices sur leur appartenance.':
    ['To help you find out team members, you will have scan secret cars of other players to discover their allegiance.'],
  'JOUEURS EN LIGNE': ['CONNECTED PLAYERS']
}

const ids = [
  "nav-self",
  "nav-check",
  "nav-mp",
  "login-name-button",
  "nav-speedup",
  "check-button",
  "gameover-winner",
  "gameover-votes",
  "spy-header",
  "spy-warning",
  "scan-ok",
  "scan-cancel",
  "startup-start",
  "startup-reset",
  "startup-skip",
  "scan-notification-title"
]

const $ = require('jquery')

const translateElement = (id) => {
  let text = $(`#${id}`).html()
  let out = t[text]
  if(out) {
    $(`#${id}`).html(out)
  }
}

const translateText = (text) => {
  let out = t[text]
  if(out) {
    return out
  }
  return text
}

const translate = () => {
  ids.forEach(id => translateElement(id, $(`#${id}`).html()))
  for(let i = 1; i < 26; i++) {
    let id = `tr-${i}`
    translateElement(id, $(`#${id}`).html())
  }
  $('h2').each(function() {
    if($(this).html()) {
      $(this).html(translateText($(this).html()))
    }
  })
  $('option').each(function() {
    if($(this).html()) {
      $(this).html(translateText($(this).html()))
    }
  })
  $('li').each(function() {
    if($(this).html()) {
      $(this).html(translateText($(this).html()))
    }
  })
  $('span').each(function() {
    if($(this).html()) {
      $(this).html(translateText($(this).html()))
    }
  })
}

module.exports = {
  translate,
  translateElement,
  translateText
}
