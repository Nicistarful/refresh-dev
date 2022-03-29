<script>
	import { fade } from 'svelte/transition'
	import { db, auth } from './stores'
	import {
		collection,
		query,
		where,
		getDocs,
		onSnapshot,
		doc,
		getDoc,
	} from 'firebase/firestore'

	//Variables
	const tasksRef = collection(db, 'tasks')
	$: tasks = []
	const user = auth.currentUser
	const userName = getUserName()

	async function getUserName() {
		const userRef = doc(db, 'users', user.uid)
		const snap = await getDoc(userRef)
		return snap.data().name
	}

	async function getTasks() {
		try {
			const q = query(tasksRef, where('user', '==', user.uid))
			let documents = await getDocs(q)
			return documents.docs
		} catch (e) {
			console.log(e)
		}
	}

	function listenToTasks() {
		try {
			const q = query(tasksRef, where('user', '==', user.uid))
			const unsubscribe = onSnapshot(q, snapshot => {
				tasks = snapshot.docs
			})
		} catch (e) {
			console.log(e)
		}
	}

	listenToTasks()
</script>

<main in:fade={{ delay: 500 }}>
	<nav
		class="bg-blue-400 shadow-md py-2 px-6 text-white grid grid-cols-3 place-items-center"
	>
		{#await userName then name}
			<h1 class="justify-self-start">Willkommen, {name}</h1>
		{/await}
		<div class="justify-self-center">
			<button class="navbar-button mx-2">Aufgaben</button>
			<button class="navbar-button mx-2">Gruppen</button>
		</div>
		<div class="justify-self-end">
			<button on:click={() => window.close()}
				><i class="fa-solid fa-xmark navbar-icon" /></button
			>
		</div>
	</nav>
	{#each tasks as task}
		<p>{task.description}</p>
	{/each}
</main>
