import { default as LibDomParser } from "dom-parser";

const libParser = new LibDomParser();
const nativeParser = new DOMParser();

export const proxy = (url: string) =>
  `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`

type Unwrapped<Type> = Type extends Promise<infer WrappedType>
  ? WrappedType
  : Type

function conjugaison(word: string) {
  const DOMAIN = 'https://la-conjugaison.nouvelobs.com'
  return fetch(proxy(`${DOMAIN}/rechercher/index.php?l=fr&q=${word}`))
    .then(r => r.text())
    .then(t => {
      const libDocument = libParser.parseFromString(t)
      const libContentEl = libDocument.getElementById('contenu')
      const document = nativeParser.parseFromString(
        libContentEl?.outerHTML || '',
        'text/html'
      )
      const contentEl = document.getElementById('contenu')

      // replace absolute link with url
      const links = Array.from(
        contentEl?.querySelectorAll('a') as ArrayLike<HTMLAnchorElement>
      )
      for (let link in links) {
        let l = links[link]
        if (l.getAttribute('href')?.startsWith('/'))
          l.setAttribute('href', DOMAIN + l.getAttribute('href'))
      }

      const titleEl = contentEl?.getElementsByTagName('h1')[0]
      const title = titleEl?.innerText || ''
      const descEl = titleEl?.nextElementSibling as HTMLDivElement
      let descHtml = descEl.innerHTML.replace(/<br\s*\/?>/g, '[br]') // preserve line breaks
      descHtml = descHtml.replace(/\[br\]<a.*/g, '') // remove doc links
      descHtml = descHtml.replace(/<a/g, '<b').replace(/\/a>/g, '/b>')
      const description = descHtml.replace(/\[br\]/g, '<br>') // restore line breaks

      let tables: Record<string, string[]> = {}
      const firstMode = contentEl?.querySelector(
        'h2.mode'
      ) as HTMLHeadingElement | null
      let mode = firstMode
      while (mode) {
        const modeText = mode?.innerText.trim()

        let values = []
        let node: Element | null = mode
        do {
          node = node?.nextElementSibling
          if (node?.classList.contains('tempstab')) {
            // open links in new tab
            Array.from(node.getElementsByTagName('a')).forEach(a =>
              a.setAttribute('target', '_blank')
            )
            // change img src absolute path
            const tempsImg: HTMLImageElement | undefined =
              node.getElementsByTagName('img')[0]
            if (tempsImg !== undefined)
              tempsImg.setAttribute(
                'src',
                DOMAIN + tempsImg?.getAttribute('src')
              )

            values.push(node.outerHTML)
          }
        } while (node && !node.classList.contains('mode'))

        if (values.length > 0) tables[modeText] = values

        mode = node as HTMLHeadingElement | null
      }

      return {
        title,
        description,
        tables
      }
    })
}

export type Conjugaison = Unwrapped<ReturnType<typeof conjugaison>>

export default conjugaison
