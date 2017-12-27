'use strict'
const $ = require('jquery')
const menu = require('./menu')

$('#nav-help').on('click', function (e) {
  e.preventDefault()
  if(!menu.isLeftMenuActive()) { return }
  menu.hideAll()
  $('#help').show()
})

const rules = [
  {text:"BUT", textClass:'help-title'},
  {text:"L'équipe qui gagne est celle qui révèle les 3 secrets de l'élu de l'équipe adverse", textClass:'help-text'},
  {text:"EQUIPES", textClass:'help-title'},
  {text:"Chaque joueur fait partie d'une équipe : Illuminati ou Scientolog", textClass:'help-text'},
  {text:"Chaque joueur a 3 secrets", textClass:'help-text'},
  {text:"Chaque équipe a un élu", textClass:'help-text'},
  {text:"En début de partie un joueur connait son équipe s'il n'est pas élu", textClass:'help-text'},
  {text:"Donc les élus ne connaissent pas leur équipe !", textClass:'help-text'},
  {text:"TOUR DE JEU", textClass:'help-title'},
  {text:"En début de tour un nouvel indice est révélé", textClass:'help-text'},
  {text:"Un indice est du type : EQUIPE a SECRET", textClass:'help-text'},
  {text:"Ou du type : ELU n'ont pas SECRET", textClass:'help-text'},
  {text:"En début de tour chaque joueur check le secret d'un autre joueur", textClass:'help-text'},
  {text:"En milieu de tour on peut : chatter, discuter à haute voix ou partager ses checks avec d'autres joueurs", textClass:'help-text'},
  {text:"En fin de tour on vote pour révéler le secret d'un joueur, celui ou ceux qui récolte(nt) le plus de voix ont un secret révélé au hasard", textClass:'help-text'},
  {text:"VARIANTE", textClass:'help-title'},
  {text:"Certains indices sont faux, leur affichage glitche", textClass:'help-text'},
]

let rulesHtml = rules.map(rule => "<div class='" + rule.textClass + "'>" + rule.text + "</div>")

$('#help').html(rulesHtml)

module.exports = {
}
