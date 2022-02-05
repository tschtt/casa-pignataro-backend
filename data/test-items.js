import fs from 'fs'
import { connection } from '@packages/table'

import { $categories } from '@resources/sections'
import { $articles, $sections } from '@app/resources'

await connection.query('SET FOREIGN_KEY_CHECKS = 0')
await connection.query('TRUNCATE article')
await connection.query('TRUNCATE section')
await connection.query('TRUNCATE category')
await connection.query('SET FOREIGN_KEY_CHECKS = 1')

if (fs.existsSync('files')) {
  fs.rmSync('files', { recursive: true })
}

if (fs.existsSync('data/temp')) {
  fs.rmSync('data/temp', { recursive: true })
}

await $sections.insertMany([
  {
    name: 'Electrodomesticos',
    categories: [
      { name: 'Heladeras / Freezers' },
      { name: 'Lavado / Secado' },
      { name: 'Cocina' },
      { name: 'Pequeños electrodomesticos' },
      { name: 'Termotanques' },
    ],
  },
  {
    name: 'Audio y Video',
    categories: [
      { name: 'Televisores' },
      { name: 'Accesorios' },
      { name: 'Portables' },
      { name: 'Bafles' },
      { name: 'Home theaters' },
      { name: 'Auriculares' },
      { name: 'Instrumentos musicales' },
      { name: 'Microfonos' },
    ],
  },
  {
    name: 'Tecnología',
    categories: [
      { name: 'Computadoras' },
      { name: 'Celulares' },
      { name: 'Telefonos' },
      { name: 'Videojuegos' },
    ],
  },
  {
    name: 'Climatización',
    categories: [
      { name: 'Aire acondicionado split' },
      { name: 'Aire acondicionado portatil' },
      { name: 'Calefacción eléctrica' },
      { name: 'Calefacción a gas' },
      { name: 'Ventilación' },
    ],
  },
  {
    name: 'Hogar',
    categories: [
      { name: 'Muebles' },
      { name: 'Colchones' },
      { name: 'Fitness' },
      { name: 'Infantiles' },
      { name: 'Bazar' },
      { name: 'Herramientas' },
      { name: 'Exterior' },
      { name: 'Salud' },
    ],
  },
])

const categories = await $categories.findMany()
const fkCategories = categories.map((categorie) => categorie.id)

const names = [
  'Heladera Gafa HGF387AF blanca con freezer 374L',
  'Heladera no frost Electrolux DFN3000 plata con freezer 260L',
  'Heladera Patrick HPK151M11 black steel con freezer 388L',
  'Heladera no frost GE Appliances RGS1951BGRX0 inoxidable con freezer 542L',
  'Heladera inverter no frost Samsung RT38K5932 black inox con freezer 382L',
  'Lavarropas automático Candy GrandÓ Vita GVS128 blanco 8kg',
  'Lavarropas automático Samsung WW90J5410G inverter plata 9kg',
  'Lavasecarropas automático Whirlpool WCF09BY inverter blanco 9kg',
  'Lavarropas automático Whirlpool WLF91A inverter blanco 9kg',
  'Horno de mesa eléctrico Yelmo YL-28 28L blanco/negro',
  'Horno de mesa eléctrico Peabody PE-HE3542 35L gris',
  'Horno de mesa eléctrico Yelmo YL-70C 70L gris antracita',
  'Horno de mesa eléctrico Ultracomb UC-52CI 52L acero inoxidable',
  'Freezer horizontal Frare F130 blanco 220L',
  'Freezer horizontal Gafa Eternity L290 blanco 277L',
  'Freezer horizontal Frare F170 blanco 300L',
  'Freezer vertical Eslabón de Lujo EVU22D1 blanco 142L',
  'Cocina Escorial Candor S2 gas natural 4 hornallas blanca 220V puerta con visor',
  'Cocina Philco PHCE051BDH eléctrica 4 hornallas blanca 220V puerta con visor',
  'Cocina industrial Saho Jitaku 550 multigas 4 hornallas acero inoxidable puerta con visor',
  'Termo Electrico Peabody Etermo 1 Litro 700w 2 Niveles Mate',
  'Ventilador de pie Peabody PE-VP2060 negro con 3 palas de plástico, 20" de diámetro',
  'Ventilador de piso Liliana VTFM20 turbo plata con 3 palas de metal, 20" de diámetro',
  'Control Remoto Universal Aire Acondicionado Frio Calor',
  'Multiprocesadora Spica Sp-700 Procesadora Picadora',
  'Cocina industrial Saho Jitaku 550 multigas 4 hornallas acero inoxidable puerta ciega',
  'Licuadora Moulinex Optimix Plus LM278158 2 L blanca con jarra de plástico',
  'Cocina Eslabón de Lujo EFM56NB2A multigas 4 hornallas blanca puerta con visor',
]

const values = [
  46379,
  7657,
  2024,
  5599,
  4930,
  64342,
  79140,
  59290,
  195999,
  21499,
  37699,
]

const attributes = [
  { name: 'Marca', value: 'Samsung' },
  { name: 'Marca', value: 'Aiwa' },
  { name: 'Marca', value: 'Apple' },
  { name: 'Voltaje', value: '110V' },
  { name: 'Voltaje', value: '220V' },
  { name: 'Voltaje', value: '440V' },
  { name: 'Potencia', value: '10W' },
  { name: 'Potencia', value: '40W' },
  { name: 'Potencia', value: '100W' },
  { name: 'Puertas', value: '1' },
  { name: 'Puertas', value: '2' },
  { name: 'Puertas', value: '4' },
]

const images = fs.readdirSync('documents/images')/* .map((file) => `documents/images/${file}`) */

fs.mkdirSync('data/temp')

await $articles.insertMany(fkCategories.map((fkCategory, index) => {
  let article = {
    fkCategory,
    code: `ART-${index}`,
    name: `Artículo ${index}`,
    value: 1000,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus architecto est ullam quasi iusto dicta. Aperiam nihil nemo fugiat accusamus quia recusandae consequuntur? Eaque fugiat ipsa neque, deserunt sapiente perspiciatis.',
    shortDescription: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus architecto est ullam quasi iusto.',
    images: [],
    attributes: [],
  }

  article.name = pickRandom(names)
  article.value = pickRandom(values)

  article.attributes.push(pickRandom(attributes))
  article.attributes.push(pickRandom(attributes))
  article.attributes.push(pickRandom(attributes))

  article.images.push(pickRandom(images))
  article.images.push(pickRandom(images))
  article.images.push(pickRandom(images))

  article.images = article.images.map((image, indexImage) => {
    fs.copyFileSync(`documents/images/${image}`, `data/temp/${index}-${indexImage}-${image}`)
    return `data/temp/${index}-${indexImage}-${image}`
  })

  return article
}))

fs.rmdirSync('data/temp')

connection.end()

function pickRandom(items = []) {
  return items[Math.floor(Math.random() * items.length)]
}
