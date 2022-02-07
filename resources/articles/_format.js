/* eslint-disable */
export default function useFormat({ $images }) {
  
  const tables = [
    'article',
    'category',
    'section',
    'nn_article_attribute_value',
    'attribute_value',
    'attribute',
  ]
  
  return function format(rows, { merge = true } = {}) {
    let result = {}

    for (const table of tables) {
      result[table] = []
    }

    for (const row of rows) {
      for (const table of tables) {
        if (row[table] && !result[table].find(item => item.id === row[table].id)) {
          result[table].push(row[table])
        }
      }
    }

    for (const article of result.article) {
      article.active = !!article.active
      article.images = $images.findMany({ fkArticle: article.id })
    }

    if (merge) {
      for (const value of result.attribute_value) {
        value.attribute = result.attribute.find(attribute => attribute.id === value.fkAttribute)
      }
      for (const nn of result.nn_article_attribute_value) {
        nn.attribute_value = result.attribute_value.find(attribute_value => attribute_value.id === nn.fkAttributeValue)
      }
      for (const category of result.category) {
        category.section = result.section.find(section => section.id === category.fkSection)
      }
      for (const article of result.article) {
        article.category = result.category.find(category => category.id === article.fkCategory)
        article.attributes = result.nn_article_attribute_value.filter(nn => nn.fkArticle === article.id)
        
        if(article.category) {
          article.category.section = article.category.section?.name
        }
        if(article.attributes.length) {
          article.attributes = article.attributes.map(({ attribute_value }) => {
            return {
              name: attribute_value.attribute.name,
              value: attribute_value.name,
            }
          })
        } else {
          delete article.attributes
        }
      }
      
      
      return result.article
    }

    return result
  }
}

// export default function useFormat({ $images }) {

//   /**
//    * Como las querys de articulo tienen joins, y al conectarnos
//    * a la base de datos seteamos nestTables a true, cada row devuelta
//    * tiene un objeto por cada tabla devuelta, es decir, uno para `article`,
//    * otro para `category`, otro para `section`, etc.
//    *
//    * Además, como cada articulo puede tener varios atributos, varias filas
//    * pueden hacer referencia a un mismo articulo, por lo que hay que unirlas
//    * en un solo objeto
//    */
//   return async function format(items = []) {
//     /**
//      * array donde vamos a guardar los articulos
//      * que vamos a devolver
//      */
//     let result = []

//     /**
//      * recorremos el array con los
//      * resultados de la query, le damos
//      * el formato correcto al item y lo
//      * agregamos al array de resultados
//      */
//     for await (const item of items) {

//       /**
//        * Vemos si el item ya se encuentra
//        * en el array de resultados
//        */
//       const index = result.findIndex(result_item => item.article.id === result_item.id)

//       /**
//        * si no se encuentra en el array, lo
//        * formateamos y agregamos a los resultados
//        */
//       if (index === -1) {
//         let new_item

//         /**
//          * datos del articulo
//          */
//         new_item = item.article
//         new_item.active = !!item.article.active

//         /**
//          * objeto de categoria
//          */
//         new_item.category = item.category
//         new_item.category.section = item.section.name

//         /**
//          * array de imagenes
//          */
//         new_item.images = await $images.findMany({ fkArticle: item.article.id })

//         /**
//          * array de atributos
//          */
//         new_item.attributes = []

//         /**
//          * como el articulo puede no tener atributos,
//          * por lo que nn_articule_attribute.id sería
//          * NULL, solo lo agregamos al array de atributos
//          * si es distinto a NULL
//          */
//         if (item.nn_article_attribute_value.id) {
//           const attribute = {}

//           /**
//            * El valor corresponde a la columna `name`
//            * de la tabla `attributes`
//            */
//           attribute.name = item.attribute.name
//           /**
//            * El valor corresponde a la columna `name`
//            * de la tabla `attributes_value`
//            */
//           attribute.value = item.attribute_value.name

//           new_item.attributes.push(attribute)
//         }

//         result.push(new_item)
//       }

//       /**
//        * si el articulo ya se encuentra en el array,
//        * solamente agregamos su atributo al array
//        */
//       else {
//         const attribute = {}

//         attribute.name = item.attribute.name
//         attribute.value = item.attribute_value.name

//         result[index].attributes.push(attribute)
//       }
//     }

//     return result
//   }

// }
