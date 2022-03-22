<script>
  import { fade } from "svelte/transition";
</script>

<main
  in:fade={{ delay: 500 }}
  out:fade
  class="p-8 flex w-screen h-screen justify-center items-center"
>
  <h1 class="uppercase text-3xl font-light block">This is the main UI</h1>
</main>
