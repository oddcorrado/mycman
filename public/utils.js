const getImgName = (name) => {
  return name.replace(/ /g, '')
            .replace(/[éèêë]/g, 'e')
            .replace(/[à]/g, 'a')
            .replace(/[']/g, '')
            .replace(/[ç]/g, 'c')
            .replace(/[ù]/g, 'u')
            .toLowerCase()
}



module.exports = {
  getSecretImg: secret => `/img/secrets/${getImgName(secret)}.png`,
  getPlayerImg: name => `/img/pawns/${getImgName(name)}.png`,
  getImgName
}
