import { createJSONStore } from '../../lib/createStore'

let historyStore = createJSONStore('HISTORY', [] as string[], w => {
  const { subscribe, update } = w

  const del = (arr: string[], word: string) => arr.filter(w => w !== word)
  const add = (verb: string) =>
    update(arr => [verb, ...del(arr, verb)].slice(0, 20))
  const remove = (verb: string) => update(arr => del(arr, verb))

  return {
    subscribe,
    add,
    remove
  }
})

export default historyStore
