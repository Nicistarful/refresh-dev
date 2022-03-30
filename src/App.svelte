<script>
	import Router from 'svelte-spa-router'
	import Login from './login.svelte'
	import Tasks from './tasks.svelte'
	import Groups from './groups.svelte'

	const routes = {
		'/': Login,
		'/tasks': Tasks,
		'/groups': Groups,
	}
</script>

<main>
	<Router {routes} />
</main>
