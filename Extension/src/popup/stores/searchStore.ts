import { writable } from 'svelte/store'
import conjugaison, { proxy, type Conjugaison } from '../conjugaison'
import historyStore from './historyStore'

function createSearchStore() {
  let { subscribe, update } = writable({
    loading: false,
    results: undefined
  } as {
    loading: boolean
    results: Conjugaison | undefined
  })

  function startAutocomplete(keyword: string) {
    return fetch(
      proxy(
        `https://la-conjugaison.nouvelobs.com/ajx/moteur.php?o=verbeAutoComplete&q=${keyword}&l=fr`
      )
    ).then(r => r.json())
  }

  function startSearch(verb: string) {
    historyStore.add(verb)

    update(val => {
      const { loading, results } = val
      if (loading) return val

      return {
        loading: true,
        results: results
      }
    })
    conjugaison(verb)
      .then(results => {
        update(v => ({ ...v, results }))
      })
      .finally(() => {
        update(v => ({ ...v, loading: false }))
      })
  }

  function resetResults() {
    update(v => ({ ...v, results: undefined }))
  }

  return {
    subscribe,
    startAutocomplete,
    resetResults,
    startSearch
  }
}

const theStore = createSearchStore()

export default theStore
export const searchStore = theStore

export const BasicVerbs = [
  'être',
  'avoir',
  'jouer',
  'faire',
  'devoir',
  'savoir',
  'lire',
  'mettre',
  'manger',
  'comprendre',
  'acheter',
  'écrire',
  'aimer',
  'envoyer',
  'craindre',
  'dire',
  'appeler',
  'parler',
  'pouvoir',
  'prendre',
  'aller',
  'connaître',
  'voir',
  'répondre',
  'finir',
  'partir',
  'venir',
  'attendre',
  'vouloir',
  'sortir'
]
