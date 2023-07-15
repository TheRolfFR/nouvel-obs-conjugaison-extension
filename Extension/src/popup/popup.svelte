<script lang="ts">
  import DOMPurify from 'dompurify'
  import { afterUpdate } from 'svelte'
  import { BasicVerbs, searchStore } from './stores/searchStore'
  import SearchInput from './searchInput.svelte'
  import historyStore from './stores/historyStore'

  afterUpdate(() => {
    window.dispatchEvent(new Event('resize'))
  })

  const purify = DOMPurify(window)

  $: ({ loading, results } = $searchStore)

  let inputValue = ''
  function handleOnSubmit() {
    searchStore.startSearch(inputValue)
  }

  $: WordCat = {
    'Verbes communs': BasicVerbs,
    Historique: $historyStore
  }
</script>

<form id="header" on:submit|preventDefault={handleOnSubmit}>
  <img id="logo" src="./logo.svg" alt="L'OBS - La conjugaison" />
  <span id="separator" />
  <span id="search"><SearchInput bind:value={inputValue} /></span>
  <button id="submit" type="submit" value="">
    <img src="./icone-loupe.svg" alt="Rechercher" />
  </button>
</form>

{#if loading || !results}
  <p id="base-message">
    {#if loading}
      <i>Chargement...</i>
    {:else if !results}
      <p>Rechercher dans la barre afin de trouver des résultats</p>

      {#each Object.entries(WordCat) as [title, verbs], catIndex}
        <h3>
          {title}
          {#if catIndex === 1 && $historyStore.length > 0}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span class="remove-h" on:click={() => historyStore.empty()}>
              Vider
            </span>
          {/if}
        </h3>
        <p>
          {#if verbs.length}
            {#each verbs.join(' | ').split(' ') as verb}
              {@debug verb}
              {#if verb === '|'}
                {' - '}
              {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <a
                  href="#dummy"
                  on:click|preventDefault={() => {
                    inputValue = verb
                    handleOnSubmit()
                  }}
                >
                  {verb}
                </a>
                {#if catIndex === 1}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <span
                    class="remove-h"
                    on:click={() => historyStore.remove(verb)}>x</span
                  >
                {/if}
              {/if}
            {/each}
          {:else if catIndex === 1}
            <i>Pas encore d'historique</i>
          {/if}
        </p>
      {/each}
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

  .remove-h {
    background: #ccc;
    height: 16px;
    min-width: 16px;
    text-align: center;
    line-height: 10px;
    font-size: 14px;
    padding: 2px;
    font-weight: normal;
    border-radius: 3px;
    display: inline-block;
    cursor: pointer;
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
