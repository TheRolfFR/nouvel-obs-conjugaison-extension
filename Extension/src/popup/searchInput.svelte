<script lang="ts">
  //@ts-ignore all
  import AutoComplete from 'simple-svelte-autocomplete'
  import searchStore from './stores/searchStore'

  export let value: string = ''

  function handleChange(value: string | undefined) {
    if (value === undefined) {
      searchStore.resetResults()
      value = ''
    }
  }
</script>

<!-- svelte-ignore a11y-no-onchange -->
<div id="input">
  <AutoComplete
    onChange={handleChange}
    showLoadingIndicator={true}
    searchFunction={searchStore.startAutocomplete}
    bind:selectedItem={value}
    hideArrow
    autofocus
    disabled={$searchStore.loading}
    showClear={!!value}
    delay={200}
    localFiltering={false}
    placeholder="Rechercher ici..."
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
