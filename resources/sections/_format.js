
export default function useFormat() {

  function format_section({ id, active, name }) {
    active = !!active
    return {
      id,
      active,
      name,
    }
  }

  function format_category({ id, active, name, fkSection }) {
    active = !!active
    return {
      id,
      fkSection,
      active,
      name,
    }
  }

  function format_attribute({ id, active, name, fkCategory }) {
    active = !!active
    return {
      id,
      fkCategory,
      active,
      name,
    }
  }

  function format_option({ id, active, name, fkAttribute }) {
    active = !!active
    return {
      id,
      fkAttribute,
      active,
      name,
    }
  }

  return function format(rows = []) {
    const sections = []
    const categories = []
    const attributes = []
    const options = []

    for (const row of rows) {
      if (!sections.find(section => section.id === row.section.id)) {
        sections.push(format_section(row.section))
      }
      if (!categories.find(category => category.id === row.category.id)) {
        categories.push(format_category(row.category))
      }
      if (!attributes.find(attribute => attribute.id === row.attribute.id)) {
        attributes.push(format_attribute(row.attribute))
      }
      if (!options.find(option => option.id === row.attribute_value.id)) {
        options.push(format_option(row.attribute_value))
      }
    }

    for (const attribute of attributes) {
      attribute.options = options.filter(option => option.fkAttribute === attribute.id)
    }

    for (const category of categories) {
      category.attributes = attributes.filter(attribute => attribute.fkCategory === category.id)
    }

    for (const section of sections) {
      section.categories = categories.filter(category => category.fkSection === section.id)
    }

    return sections
  }
}
