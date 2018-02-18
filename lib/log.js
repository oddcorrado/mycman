'use strict'

//const _ = require('lodash')

let messages = []
let votes = []
let scores = []

module.exports = {
  messagesAdd,
  messagesAll,
  scoresAdd,
  scoresAll,
  votesAdd,
  votesAll,
  reset
}

function reset () {
  messages = []
  votes = []
  scores = []
}

function scoresAdd(team, chosen, total) {
  scores.push({team, chosen, total})
}

function scoresAll () { return scores }

function messagesAdd (from, to, message) {
  messages.push({from, to, message})
}

function messagesAll () { return messages }

function votesAdd(name, voted) {
  let vote = votes.find(vote => vote.name === name && vote.voted === voted)
  if(!vote) {
    vote = {name, voted, count:0}
    votes.push(vote)
  }
  vote.count++
}

function votesAll() { return votes}
