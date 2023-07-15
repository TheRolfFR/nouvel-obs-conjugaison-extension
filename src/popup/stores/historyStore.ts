import { createJSONStore } from '../../lib/createStore'

let historyStore = createJSONStore('HISTORY', [] as string[], w => {
  const { subscribe, update, set } = w

  const del = (arr: string[], word: string) => arr.filter(w => w !== word)
  const add = (verb: string) =>
    !!verb ? update(arr => [verb, ...del(arr, verb)].slice(0, 20)) : {}
  const remove = (verb: string) => update(arr => del(arr, verb))
  const empty = () => set([])

  return {
    subscribe,
    add,
    empty,
    remove
  }
})

export default historyStore
