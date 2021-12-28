import { connection } from '@packages/table'
import { $articles, $categories } from '@app/resources'

await $categories.insertMany([
  {
    name: 'Audio y Video',
    categories: [
      {
        name: 'Audio',
        categories: [
          { name: 'Televisores' },
          { name: 'Accesorios' },
        ],
      },
      {
        name: 'Video',
        categories: [
          { name: 'Portables' },
          { name: 'Bafles' },
          { name: 'Home theaters' },
          { name: 'Auriculares' },
          { name: 'Instrumentos musicales' },
          { name: 'Microfonos' },
        ],
      },
    ],
  },
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
    name: 'Tecnología',
    categories: [
      { name: 'Computadoras' },
      { name: 'Celulares' },
      { name: 'Telefonos' },
      { name: 'Videojuegos' },
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

const categories = await $categories.findMany({}, { flat: true })
const fkCategories = categories.map((categorie) => categorie.id)

const images = [
  'documents/images/aire-1.jpg',
  'documents/images/aire-2.jpg',
  'documents/images/licuadora-1.jpg',
  'documents/images/licuadora-2.jpg',
  'documents/images/notebook-1.jpg',
  'documents/images/notebook-2.jpg',
  'documents/images/notebook-3.jpg',
  'documents/images/tele-1.jpg',
  'documents/images/ventilador-1.jpg',
  'documents/images/ventilador-2.jpg',
]

await $articles.insertMany(fkCategories.map((fkCategorie, index) => {
  let article = {
    fkCategorie,
    code: `ART-${index}`,
    name: `Artículo ${index}`,
    value: 1000,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus architecto est ullam quasi iusto dicta. Aperiam nihil nemo fugiat accusamus quia recusandae consequuntur? Eaque fugiat ipsa neque, deserunt sapiente perspiciatis.',
    shortDescription: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus architecto est ullam quasi iusto.',
    images: [],
  }

  article.images.push({ path: images[Math.floor(Math.random() * images.length)], name: `image-${index}1.jpg` })
  article.images.push({ path: images[Math.floor(Math.random() * images.length)], name: `image-${index}2.jpg` })
  article.images.push({ path: images[Math.floor(Math.random() * images.length)], name: `image-${index}3.jpg` })

  return article
}))

connection.end()
