<script lang="ts">
  import DOMPurify from 'dompurify';
  import conjugaison from './conjugaison';
  import { afterUpdate } from 'svelte';

  type Unwrapped<Type> = Type extends Promise<infer WrappedType>
    ? WrappedType
    : Type;

  afterUpdate(() => {
    window.dispatchEvent(new Event('resize'))
  })

  const purify = DOMPurify(window);

  let results: Unwrapped<ReturnType<typeof conjugaison>> | undefined =
    undefined;
  let loading: boolean = false;
  function launchRequest(word: string) {
    if (loading) return

    loading = true;
    conjugaison(word)
      .then(v => {
        results = v
      })
      .finally(() => {
        loading = false
      });
  }

  let search = ''
  function handleOnSubmit() {
    launchRequest(search)
  }

  let verbs = [
    'jouer',
    'faire',
    'devoir',
    'savoir',
    'lire',
    'mettre',
    'manger',
    'comprendre',
    'être',
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
    'sortir',
    'avoir'
  ];

  // launchRequest(verbs[Math.floor(verbs.length * Math.random())])
</script>

<form id="header" on:submit|preventDefault={handleOnSubmit}>
  <img id="logo" src="./logo.svg" alt="L'OBS - La conjugaison" />
  <span id="separator" />
  <input
    id="search"
    type="search"
    name="search"
    disabled={loading}
    bind:value={search}
    placeholder="Rechercher ici..."
  />
  <button id="submit" type="submit" value="">
    <img src="./icone-loupe.svg" alt="Rechercher" />
  </button>
</form>

{#if loading || !results}
  <p id="base-message">
    {#if loading}
      <i>Chargement...</i>
    {:else if !results}
      Rechercher dans la barre afin de trouver des résultats
    {/if}
  </p>
{/if}

{#if results && !loading}
  <div id="results">
    <h1 id="title"><span>{results.title}</span></h1>
    <p id="description">
      {@html purify.sanitize(results.description)}
    </p>
    {#each Object.entries(results.tables) as [mode, tables]}
      <div class="mode">
        <h2><span>{mode}</span></h2>
        <div class="tables">
          {#each tables as table}
            {@html purify.sanitize(table, { ADD_ATTR: ['target'] })}
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
  }

  #header {
    background: #eeeeee;
    display: flex;
    padding: 5px 10px;
    gap: 5px;
    justify-items: center;
  }

  #header img,
  #header input,
  #header > span,
  #submit {
    height: 40px;
    margin: 0 !important;
  }

  #header > #separator {
    margin-left: 5px !important;
    background-color: #ccc;
    width: 1px;
  }
  #search {
    flex-grow: 1;
  }
  #submit {
    width: 40px;
    line-height: 40px;
    padding: 0;
  }
  #submit img {
    float: left;
    transform: scale(0.7);
  }

  #base-message {
    margin: 20px;
    text-align: center;
  }

  #results {
    font-size: 12px !important;
    padding: 0 10px 20px;
  }

  #results #title {
    margin: 12px 0 0;
    color: #1b5d6c;
    font-weight: bold;
    font-size: 18px;

    span {
      background: #f8b538
        url('https://la-conjugaison.nouvelobs.com/img/coin_jaune.png') no-repeat
        right;
      background-size: contain;
      padding: 4px calc(53px + 10px + 8px) 4px 8px;
    }
  }

  #results #description {
    margin: 4px 12px 1px;
    padding: 4px 4px 8px 4px;
    line-height: 22px;
    font-size: 14px;
    border-bottom: 1px solid #f8b538;
  }

  #results .mode h2 {
    margin: 8px 0 4px 0;
    border-bottom: 3px solid #186962;

    span {
      color: #fff;
      font-size: 16px;
      background: url(https://la-conjugaison.nouvelobs.com/img/verbe/fondmode.png);
      font-weight: bold;
      margin: 0;
      padding: 3px 32px 3px 5px;
    }
  }

  #results .tables {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }

  #results :global {
    .tempsheader {
      font-size: 14px;
      background: url(https://la-conjugaison.nouvelobs.com/img/verbe/fondtemps.png);
      height: 14px;
      font-weight: bold;
      padding: 4px;
      margin: 0;
      color: #154e5b;
      line-height: 16px;
    }
    .tempscorps {
      padding: 4px;
      line-height: 22px;
      font-size: 14px;
      background: #fff
        url(https://la-conjugaison.nouvelobs.com/img/verbe/fondcorps.png)
        repeat-x;
    }
    .tempscorps b {
      color: #c33;
    }
    .right {
      float: right;
    }
    tbody tr:nth-child(2n) {
      background-color: transparent !important;
    }
  }

  :global {
    & {
      min-width: 20em;
      min-height: 30em;
    }
    body {
      margin: 0;
      padding: 0;
      max-width: none;
    }
  }
</style>
