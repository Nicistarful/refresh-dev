<script>
  import Router from "svelte-spa-router";
  import Login from "./login.svelte";
  import Main from "./main.svelte";

  const routes = {
    "/": Login,
    "/main": Main,
  };
</script>

<main>
  <Router {routes} />
</main>
