import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const riddles = [
  {
    riddleNumber: 1,
    title: "Code Cuillère #001",
    text: "Dans la rue, je guide tes pas. Je suis marqué mais pas sur papier. Qu'est-ce que je suis ?",
    freeHint1: "Je suis fait de peinture blanche ou jaune",
    freeHint2: "Les voitures et piétons me respectent",
    bonusHint: "Je délimite la chaussée et indique la direction",
    megaHint: "On me trouve au milieu ou sur les côtés des routes",
    correctAnswer: "ligne"
  },
  {
    riddleNumber: 2,
    title: "Code Cuillère #002", 
    text: "Je porte un nom mais ne parle jamais. J'indique où aller sans bouger. Qu'est-ce que je suis ?",
    freeHint1: "Je suis en métal ou en bois",
    freeHint2: "J'ai des lettres écrites sur moi",
    bonusHint: "Les touristes me cherchent souvent",
    megaHint: "Je donne le nom des rues et des places",
    correctAnswer: "panneau"
  },
  {
    riddleNumber: 3,
    title: "Code Cuillère #003",
    text: "La nuit je brille, le jour je me repose. Je veille sur la sécurité sans jamais me lasser. Qu'est-ce que je suis ?",
    freeHint1: "J'utilise de l'électricité",
    freeHint2: "Je m'allume automatiquement",
    bonusHint: "Je permets de voir dans l'obscurité",
    megaHint: "Je suis planté le long des routes et des trottoirs",
    correctAnswer: "lampadaire"
  },
  {
    riddleNumber: 4,
    title: "Code Cuillère #004",
    text: "J'avale tout ce qu'on me donne sans jamais être rassasié. Je garde la ville propre. Qu'est-ce que je suis ?",
    freeHint1: "On me vide régulièrement",
    freeHint2: "J'ai souvent un couvercle",
    bonusHint: "Je suis indispensable pour l'hygiène urbaine",
    megaHint: "Les ordures ménagères sont ma spécialité",
    correctAnswer: "poubelle"
  },
  {
    riddleNumber: 5,
    title: "Code Cuillère #005",
    text: "Je change de couleur pour donner des ordres. Rouge, orange, vert : chacun a sa signification. Qu'est-ce que je suis ?",
    freeHint1: "Je contrôle la circulation",
    freeHint2: "Je suis placé aux intersections",
    bonusHint: "Mon rouge signifie 'arrêt'",
    megaHint: "Les conducteurs et piétons m'obéissent",
    correctAnswer: "feu"
  },
  {
    riddleNumber: 6,
    title: "Code Cuillère #006",
    text: "Je bois l'eau de pluie et la rends à la terre. Je protège les bâtiments des inondations. Qu'est-ce que je suis ?",
    freeHint1: "Je suis souvent en métal",
    freeHint2: "On me trouve le long des rues",
    bonusHint: "L'eau coule à travers moi",
    megaHint: "Je dirige l'eau vers les égouts",
    correctAnswer: "caniveau"
  },
  {
    riddleNumber: 7,
    title: "Code Cuillère #007",
    text: "Je suis le gardien silencieux de la rue. Les voitures se rangent près de moi. Je n'ai ni pied ni main mais je délimite l'espace. Qu'est-ce que je suis ?",
    freeHint1: "Je suis planté dans le sol",
    freeHint2: "Je sépare la route du trottoir",
    bonusHint: "Parfois je porte des affiches ou des panneaux",
    megaHint: "Je peux être en métal, en bois ou en béton",
    correctAnswer: "poteau"
  }
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create app settings
  const appSettings = await prisma.appSettings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      prizeAmount: 100000,
      gameIsActive: true,
      registrationOpen: true,
      totalRiddles: 7,
      paymentPhone: "00223 70446750"
    }
  })

  console.log('✅ App settings created')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      isActive: true
    }
  })

  console.log('✅ Admin user created (username: admin, password: admin123)')

  // Create riddles
  for (const riddleData of riddles) {
    const riddle = await prisma.riddle.upsert({
      where: { riddleNumber: riddleData.riddleNumber },
      update: riddleData,
      create: riddleData
    })
    console.log(`✅ Riddle #${riddle.riddleNumber} created: ${riddle.title}`)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })