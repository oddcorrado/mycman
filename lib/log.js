'use strict'

//const _ = require('lodash')

let messages = []
let votes = []

module.exports = {
  messagesAdd,
  messagesAll,
  votesAdd,
  votesAll,
  reset
}

function reset () {
  messages = []
  votes = []
}

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
  console.log(votes)
}

function votesAll() { return votes}
