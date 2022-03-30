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
		updateDoc,
		deleteDoc,
	} from 'firebase/firestore'
	import Content from './content.svelte'
	import AddTask from './addTaskPopup.svelte'

	//Variables
	const tasksRef = collection(db, 'tasks')
	$: tasks = []
	$: userName = ''
	$: addTaskIsHidden = true
	const user = auth.currentUser
	const userId =
		user == null || user === undefined
			? '5lSb7uK3jccB5gL4EyNCIedmv7F3'
			: user.uid

	try {
		const userRef = doc(db, 'users', userId)
		getDoc(userRef).then(snapshot => {
			userName = snapshot.data().name
		})
	} catch (e) {
		console.log(e)
	}

	try {
		const taskQuery = query(tasksRef, where('user', '==', userId))
		getDocs(taskQuery).then(snapshot => {
			tasks = snapshot.docs
		})
	} catch (error) {
		console.log(error)
		tasks = ["Documents couldn't be loaded"]
	}

	try {
		const subscribeQuery = query(tasksRef, where('user', '==', userId))
		onSnapshot(subscribeQuery, snapshot => {
			snapshot.docs.forEach(doc => {
				tasks.push(doc)
			})
		})
	} catch (e) {
		console.log(e)
	}

	const refresh = () => {
		const taskQuery = query(tasksRef, where('user', '==', userId))
		getDocs(taskQuery).then(snapshot => {
			tasks = snapshot.docs
		})
	}

	const markAsDone = task => {
		if (task.data().done == false) {
			updateDoc(doc(db, 'tasks', task.id), {
				done: true,
			})
		} else {
			updateDoc(doc(db, 'tasks', task.id), {
				done: false,
			})
		}
		refresh()
	}

	const deleteTask = task => {
		deleteDoc(doc(db, 'tasks', task.id))
		refresh()
	}

	$: buttonIsHidden = false

	export const hideAddTask = () => {
		buttonIsHidden = false
		addTaskIsHidden = true
	}

	export const showAddTask = () => {
		buttonIsHidden = true
		addTaskIsHidden = false
	}

	const afterFormSuccess = () => {
		hideAddTask()
		refresh()
	}
</script>

<main in:fade={{ delay: 500 }}>
	<nav
		class="bg-blue-400 shadow-md py-2 px-6 text-white grid grid-cols-3 place-items-center"
	>
		<h1 class="justify-self-start">Willkommen, {userName}</h1>

		<div class="justify-self-center">
			<button class="navbar-button mx-2">Aufgaben</button>
			<button class="navbar-button mx-2">Gruppen</button>
		</div>
		<div class="justify-self-end">
			<button on:click={refresh}
				><i class="fa-solid fa-refresh navbar-icon" /></button
			>
		</div>
	</nav>
	<div class="p-8 grid grid-cols-3 overflow-auto">
		<div class="grid grid-cols-3 font-bold gap-8 col-span-2">
			<h2>Name</h2>
			<h2>Fällig bis</h2>
			{#each tasks as task}
				{#if task.data().done == true}
					<div
						class="grid grid-cols-3 col-span-3 font-light gap-8 text-green-400"
					>
						<p>{task.data().name}</p>
						<p>{task.data().date.toDate().toDateString()}</p>
						<div class="justify-self-end">
							<button on:click={() => deleteTask(task)}
								><i
									class="fa fa-trash ml-4 opacity-50 hover:opacity-100"
								/></button
							>
							<button
								><i
									class="fa fa-info ml-4 opacity-50 hover:opacity-100"
								/></button
							>
							<button on:click={() => markAsDone(task)}
								><i
									class="fa fa-check ml-4 opacity-50 hover:opacity-100"
								/></button
							>
						</div>
					</div>
				{:else}
					<div class="grid grid-cols-3 col-span-3 font-light gap-8">
						<p>{task.data().name}</p>
						<p>{task.data().date.toDate().toDateString()}</p>
						<div class="justify-self-end">
							<button on:click={() => deleteTask(task)}
								><i
									class="fa fa-trash ml-4 opacity-50 hover:opacity-100"
								/></button
							>
							<button
								><i
									class="fa fa-info ml-4 opacity-50 hover:opacity-100"
								/></button
							>
							<button on:click={() => markAsDone(task)}
								><i
									class="fa fa-check ml-4 opacity-50 hover:opacity-100"
								/></button
							>
						</div>
					</div>
				{/if}
			{/each}
			<div class="col-span-3 flex justify-center">
				<button hidden={buttonIsHidden}
					><i
						class="fa fa-plus opacity-50 hover:opacity-100"
						on:click={showAddTask}
					/></button
				>
			</div>
			<div class="col-span-3 flex justify-center content-center">
				<AddTask
					afterSuccess={afterFormSuccess}
					hidden={addTaskIsHidden}
				/>
			</div>
		</div>
	</div>
</main>
