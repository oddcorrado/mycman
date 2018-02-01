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
  getImgName
}
