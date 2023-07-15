<script lang="ts">
  //@ts-ignore all
  import AutoComplete from 'simple-svelte-autocomplete'
  import { searchStore, searchWritable } from './stores/searchStore'

  $: showClear = !!$searchWritable
  let container: HTMLElement | undefined

  searchWritable.subscribe(v => {
    //? fix bug where outside update would not modify input value
    const rawInput = container?.querySelector(
      'input.input.autocomplete-input'
    ) as HTMLInputElement | null | undefined
    if (rawInput) rawInput.value = v || ''
  })

  function handleChange(value: string | undefined) {
    if (!value) {
      searchWritable.set(undefined)
      searchStore.resetResults()
    } else {
      searchWritable.set(value)
    }
  }
</script>

<!-- svelte-ignore a11y-no-onchange -->
<div id="input" bind:this={container}>
  <AutoComplete
    onChange={handleChange}
    showLoadingIndicator={true}
    searchFunction={searchStore.startAutocomplete}
    bind:selectedItem={$searchWritable}
    hideArrow
    autofocus
    disabled={$searchStore.loading}
    {showClear}
    delay={200}
    localFiltering={false}
    placeholder="Rechercher ici..."
    loadingText="Chargement des résultats..."
    noResultsText="Aucun resultat trouvé"
  />
</div>

<style lang="scss">
  #input {
    &,
    & > :global(div),
    & :global(.input-container),
    & :global(input) {
      height: 100%;
      width: 100%;
    }

    & :global(input) {
      margin: 0 !important;
    }
  }
</style>
