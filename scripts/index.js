import minimist from "minimist"

const name = `./${process.argv[2]}.js`
const args = minimist(process.argv.slice(3))

const { default: useScript } = await import(name)

await useScript(args)
