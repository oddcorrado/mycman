const secretStrings = [
  { secret: "Excalibur", hint: "Excalibur", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Graal", hint: "Le Graal", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le fil d'Ariane", hint: "Le fil d'Ariane", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Durandal", hint: "Durandal", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Boîte de Pandore", hint: "La Boîte de Pandore", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "L'Epée de Damoclès", hint: "L'Epée de Damoclès", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Mjöllnir", hint: "Mjöllnir", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Pomme de Discorde", hint: "La Pomme de Discorde", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "L'Arche d'Alliance", hint: "L'Arche d'Alliance", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Hollandais Volant", hint: "Le Hollandais Volant", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Cheval de Troie", hint: "Le Cheval de Troie", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Les Sandales Ailées", hint: "Les Sandales Ailées", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Les Fleurs de Lotos", hint: "Les Fleurs de Lotos", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Corne d'Abondance", hint: "La Corne d'Abondance", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Pierre Philosophale", hint: "La Pierre Philosophale", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Heaume d'Hades", hint: "Le Heaume d'Hades", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Couronne d'épines", hint: "La Couronne d'épines", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le baton de Moïse", hint: "Le baton de Moïse", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Caducée", hint: "Le Caducée", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Lance de Longinus", hint: "La Lance de Longinus", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Les bottes de 7 lieues", hint: "Les bottes de 7 lieues", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "L'Ankh", hint: "L'Ankh", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Shive Kundala", hint: "Shive Kundala", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "L'arche de Noé", hint: "L'arche de Noé", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Neshmet", hint: "Neshmet", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La barque de Charon", hint: "La barque de Charon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Livre des Morts", hint: "Le Livre des Morts", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Nécronomicon", hint: "Le Nécronomicon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Lampe d'Aladin", hint: "La Lampe d'Aladin", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Golem", hint: "Le Golem", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Fruit Interdit", hint: "Le Fruit Interdit", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Sable du Marchand", hint: "Le Sable du Marchand", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La flûte de Pan", hint: "La flûte de Pan", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Harpe de David", hint: "La Harpe de David", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Lyre d'Appolon", hint: "La Lyre d'Appolon", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Tête de Méduse", hint: "La Tête de Méduse", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Le Mirroir Magique", hint: "Le Mirroir Magique", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Tour de Babel", hint: "La Tour de Babel", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Poupée Vaudou", hint: "La Poupée Vaudou", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Yaka No Kagami", hint: "Yaka No Kagami", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "Gleipnir", hint: "Gleipnir", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},
  { secret: "La Toison d'Or", hint: "La Toison d'Or", cooldown:0, cooldownPeriod:2, inUse:false, help:'powerup texte', log:'log text', targetMax:1, targets:[], available:false, pos:10},

  /* { secret: "a moulé la Statue de la Liberté sur le corps de Néfertiti", hint: "Néfertiti", pos:10},
  { secret: "a démoulé la momie de Néfertiti", hint: "Néfertiti", pos:10},
  { secret: "a modélisé sur une puce le cerveau d’Albert Einstein", hint: "Einstein" , pos:10},
  { secret: "a récupéré une théorie inédite de Einstein", hint: "Einstein" , pos:10},
  { secret: "a lancé sur le président Kennedy des Oeufs Génétiquements Avariés", hint: "Kennedy" , pos:10},
  { secret: "a récupéré les missiles de Kennedy", hint: "Kennedy" , pos:10},
  { secret: "a déclenché la guerre en Irak pour récupérer le sabre laser de Saddam Hussein", hint: "Laser" , pos:10},
  { secret: "a des satellites de contrôle mental par rayon laser", hint: "Laser" , pos:10},
  { secret: "a volé et monnayé sur Ebay le nez du Sphinx de Gizeh", hint: "Sphinx" , pos:10},
  { secret: "a dompté puis pétrifié le Sphinx", hint: "Sphinx" , pos:10},
  { secret: "a inséré une molécule extra-terrestre dans l’ADN du premier bébé éprouvette", hint: "ADN" , pos:10},
  { secret: "a resynthétisé l'ADN du T-REX", hint: "ADN" , pos:10},
  { secret: "a déclenché la crise de Wall Street en revendant des images de chatons larmoyants", hint: "Chatons" , pos:10},
  { secret: "a déclenché la crise du pétrole avec des chatons radioactifs", hint: "Chatons" , pos:10},
  { secret: "a provoqué l’éruption du Vésuve anéantissant Pompéi", hint: "Pompéi" , pos:10},
  { secret: "a déterré le premier graffiti atomique de Pompéi", hint: "Pompéi" , pos:10},
  { secret: "a penché la Tour de Pise pour aligner l’axe de la Terre avec le Soleil", hint: "Pise" , pos:10},
  { secret: "a caché une fusée interplanétaire dans la Tour de Pise", hint: "Pise" , pos:10},
  { secret: "a kidnappé Vadik, le petit poney du président Russe créant une crise diplomatique européenne", hint: "Russe" , pos:10},
  { secret: "a préparé l'élection d'un zombie à la présidence russe", hint: "Russe" , pos:10},
  { secret: "a provoqué la fin de l’ère Secondaire qui a exterminé les Dinosaures", hint: "Dinosaures" , pos:10},
  { secret: "a enfermé les dinosaures dans les boîtes de Dinosaurus", hint: "Dinosaures" , pos:10},
  { secret: "a surfé le Tsunami en compagnie de Brice", hint: "Tsunami" , pos:10},
  { secret: "a libéré le monstre du Loch Ness qui a provoqué un Tsunami", hint: "Tsunami" , pos:10},
  { secret: "a créé le virus de l’an 2 038", hint: "Virus" , pos:10},
  { secret: "a glissé des virus dans les bouteilles de cidre Ecusson", hint: "Virus" , pos:10},
  { secret: "a désorienté Pluton pour la faire sortir du système solaire", hint: "Pluton" , pos:10},
  { secret: "a installé une piscine sur Pluton", hint: "Pluton" , pos:10},
  { secret: "a largué 1 400 saucisses molotov sur la Baie des Cochons", hint: "Saucisses" , pos:10},
  { secret: "a créé des saucisses de licorne", hint: "Saucisses" , pos:10},
  { secret: "a cloné tous les plus grands scientifiques", hint: "Clone" , pos:10},
  { secret: "a séduit dark Vador avec un clones", hint: "Clone" , pos:10}, */

/*  { secret: "a recollé les morceaux du crâne de cristal", hint: "Crâne" , pos:10},
  { secret: "a enelvé les cornes du crâne de Lucie", hint: "Crâne" , pos:10},
  { secret: "a les codes de la moitié des missiles nucléaires de la Corée du Nord", hint: "Missile" , pos:10},
  { secret: "a racheté la moitié des missiles russe", hint: "Missile" , pos:10},
  { secret: "a modifié la formule du Coca Cola pour asservir le monde", hint: "Cola" , pos:10},
  { secret: "a fait couler le titanic avec du menthos et du coca cola", hint: "Cola" , pos:10},
  { secret: "a la main basse sur tous les systèmes d'égoût de paris", hint: "Egout" , pos:10},
  { secret: "a élévé des crocodiles mutants dans les égoûts de paris", hint: "Egout" , pos:10},
  { secret: "a des nano bots près à répandre n’importe quel virus", hint: "hint" , pos:10},
  { secret: "a créé un automate succubien pour séduire le président du FMI", hint: "FMI" , pos:10},
  { secret: "a lancé de la javel oxygénée sur le visage de Michael Jackson", hint: "Michael" , pos:10},
  { secret: "a créé l’EspionUltraRadiochimiqueOptimisé, une monnaie unique pour les gouverner tous !", hint: "Monnaie" , pos:10},
  { secret: "a modifié la formule du Coca Cola pour asservir mentalement la population mondiale", hint: "Cola" , pos:10},
  { secret: "a détourné l’argent des français pour acheter une Delorean et retourner vers le futur", hint: "Delorean" , pos:10},
  { secret: "a échangé les lettres d’Hollywood pour envoyer un message aux Martiens", hint: "Hollywood" , pos:10},
  { secret: "a détourné des four micro-ondes pour accélérer le réchauffement climatique", hint: "Climatique" , pos:10},
  { secret: "a injecté un virus dans des réfrigérateurs connectés pour transmettre le ver solitaire dans le monde entier", hint: "Ver" , pos:10},
  { secret: "a retrouvé et décongelé le cerveau d'Hitler", hint: "Hitler" , pos:10},
  { secret: "a des satellites de contrôle mental par rayon laser", hint: "Satellites" , pos:10},
  { secret: "a contrôlé la mafia sicilienne", hint: "Mafia" , pos:10},
  { secret: "a la main basse sur tous les systèmes d'égout de paris", hint: "Egout" , pos:10},

  { secret: "a des contacts avec les mormons et ont un accès à leur base de donnée", hint: "Mormons" , pos:10},
  { secret: "a une base sur la face cachée de la lune", hint: "Lune" , pos:10},


  { secret: "a maîtrisé la fusion froide", hint: "Fusion" , pos:10},
  { secret: "a soudoyé presque tous les responsables de la CIA", hint: "CIA" , pos:10},
  { secret: "a mis au point une drogue d’obéissance indétectable", hint: "Drogue" , pos:10},*/
/*  { secret: "a créé une émission pour enfants qui leur lave le cerveau", hint: "hint" , pos:10},
  { secret: "a réussi à introduire ses messages subliminaux dans la plupart des publicités", hint: "hint" , pos:10},
  { secret: "a les principaux opérateurs de TV sous leur coupe", hint: "hint" , pos:10},
  { secret: "a les chanteurs pops à sa solde pour diffuser leurs messages", hint: "hint" , pos:10},
  { secret: "a retrouvé le saint graal et s'apprête à s’en servir", hint: "hint" , pos:10},
  { secret: "a trouvé un wormhole au fond d’une cavité sous marine", hint: "hint" , pos:10},
  { secret: "a des postes clés au sein des principaux ministères de l’éducation", hint: "hint" , pos:10},
  { secret: "a creusé un tunnel pour accéder au Warehouse 23", hint: "hint" , pos:10},
  { secret: "a téléchargé tous les documents techniques de la zone 51", hint: "hint" , pos:10},
  { secret: "a synthétisé une enzyme qui rend nos arbres carnivores", hint: "hint" , pos:10},
  { secret: "a des satellites qui contrôlent la météo en n’importe quel point du globe", hint: "hint" , pos:10},
  { secret: "a créé un soleil miniature", hint: "hint" , pos:10},
  { secret: "a implanté une puce de contrôle dans chaque opérationnel du KGB", hint: "hint" , pos:10},
  { secret: "a piraté l’ensemble des drones de guerre américains", hint: "hint" , pos:10},*/
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

secretStrings.find(s => s.secret === 'Excalibur').votePower = function({votes, log}) {
  console.log('Excalibur', votes, log)
  console.log('this is ', this.secret, this.cooldown, this.targets)
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
  console.log('Mjöllnir', votes, log)
  console.log('this is ', this.secret, this.cooldown, this.targets)
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
  console.log('Durandal', votes, log)
  console.log('this is ', this.secret, this.cooldown, this.targets)
  this.targets.forEach(target => {
    let voter = votes.find(v => v.voter === target)
    if(voter) {
      voter.power = (voter.power || 1 ) + 3
      log += 'Durandal donne +3 à '+ target + '\n'
    }
  })
  return {votes, log}
}

module.exports = secretStrings
