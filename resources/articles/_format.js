
export default ({ $images }) => ({

  /**
   * Como las querys de articulo tienen joins, y al conectarnos
   * a la base de datos seteamos nestTables a true, cada row devuelta
   * tiene un objeto por cada tabla devuelta, es decir, uno para `article`,
   * otro para `category`, otro para `section`, etc.
   *
   * Además, como cada articulo puede tener varios atributos, varias filas
   * pueden hacer referencia a un mismo articulo, por lo que hay que unirlas
   * en un solo objeto
   */
  async fillMany(items = []) {
    /**
     * array donde vamos a guardar los articulos
     * que vamos a devolver
     */
    let result = []

    /**
     * recorremos el array con los
     * resultados de la query, le damos
     * el formato correcto al item y lo
     * agregamos al array de resultados
     */
    for await (const item of items) {

      /**
       * Vemos si el item ya se encuentra
       * en el array de resultados
       */
      const index = result.findIndex(result_item => item.article.id === result_item.id)

      /**
       * si no se encuentra en el array, lo
       * formateamos y agregamos a los resultados
       */
      if (index === -1) {
        let new_item

        /**
         * datos del articulo
         */
        new_item = item.article
        new_item.active = !!item.article.active

        /**
         * objeto de categoria
         */
        new_item.category = item.category
        new_item.category.section = item.section.name

        /**
         * array de imagenes
         */
        new_item.images = await $images.findMany({ fkArticle: item.article.id })

        /**
         * array de atributos
         */
        new_item.attributes = []

        /**
         * como el articulo puede no tener atributos,
         * por lo que nn_articule_attribute.id sería
         * NULL, solo lo agregamos al array de atributos
         * si es distinto a NULL
         */
        if (item.nn_article_attribute_value.id) {
          const attribute = {}

          /**
           * El valor corresponde a la columna `name`
           * de la tabla `attributes`
           */
          attribute.name = item.attribute.name
          /**
           * El valor corresponde a la columna `name`
           * de la tabla `attributes_value`
           */
          attribute.value = item.attribute_value.name

          new_item.attributes.push(attribute)
        }

        result.push(new_item)
      }

      /**
       * si el articulo ya se encuentra en el array,
       * solamente agregamos su atributo al array
       */
      else {
        const attribute = {}

        attribute.name = item.attribute.name
        attribute.value = item.attribute_value.name

        result[index].attributes.push(attribute)
      }
    }

    return result
  },

})
