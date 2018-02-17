'use strict'

const userData = [
  {color:'#f4d025'},
  {color:'#c62b43'},
  {color:'#9dcde3'},
  {color:'#70b18e'},
  {color:'#ce5e29'},
  {color:'#64277f'},
  {color:'#bacb31'},
  {color:'#4d66ab'},
  {color:'#d0668c'},
  {color:'#8f847a'}
]

let users = []
let secretCount = 3
// TODO cleanup
let nextUserId = 0

const id2card = (id) => {
  return id % (secretCount + 1)
}

const id2userId = (id) => {
  return (secretCount + 1) * Math.trunc(id / (secretCount + 1))
}

const id2userDataIndex = (id) => {
  return Math.trunc(id / (secretCount + 1))
}

const reset = () => {
  nextUserId = 0
  users = []
}

const addUser = (name) => {
  // console.log('addUser', name)
  users.push({name})
}

const setId = (name, id) => {
  console.log('setId', name, parseInt(id))
  id = parseInt(id)
  if(isNaN(id)) {
    id = nextUserId
    nextUserId += 4
  }
  console.log('id nextUserId', id, nextUserId)

  let user = users.find(v => v.name === name)
  if(id % (secretCount + 1) === 0) {
    user.id = id
    user.data = userData[id2userDataIndex(id)]
    return "success"
  }

  // console.log("failure", users)
  return "failure : wrong id"
}

const setSecretCount = (cnt) => {
  secretCount = cnt
}

const getObject = (id) => {
  let userId = id2userId(id)
  let user = users.find(v => v.id === userId)
  if(!user) {
    return {type:'not used'}
  }

  if(id % (secretCount + 1) === 0) {
    return {type:'user', name: user.name, data: userData[id2userDataIndex(id)]}
  }

  return {type:'secret', name: user.name, card: id2card(id)}
}

const getUsers = () => {
  return users
}

const getIds = () => {
  let output = []
  for (let i = 0; i < (secretCount + 1) * userData.length; i++) {
    output.push('empty')
  }
  return output.map((v, i) => getObject(i))
}

module.exports = {
  addUser,
  reset,
  setId,
  setSecretCount,
  getUsers,
  getObject,
  getIds
}
