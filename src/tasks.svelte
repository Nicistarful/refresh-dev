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
	import AddTask from './addTaskPopup.svelte'

	//Variables
	const tasksRef = collection(db, 'tasks')
	$: tasks = []
	$: selectedTask = tasks[0]
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
				tasks = [...tasks, doc]
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

<main in:fade={{ delay: 500 }} out:fade={500}>
	<nav
		class="bg-blue-400 shadow-md py-2 px-6 text-white grid grid-cols-3 place-items-center h-14"
	>
		<h1 class="justify-self-start">Willkommen, {userName}</h1>

		<div class="justify-self-center">
			<a href="#/tasks" class="navbar-button mx-2">Aufgaben</a>
			<a href="#/groups" class="navbar-button mx-2">Gruppen</a>
		</div>
		<div class="justify-self-end">
			<button on:click={refresh}
				><i class="fa-solid fa-refresh navbar-icon" /></button
			>
		</div>
	</nav>
	<div class="p-8 grid grid-cols-3 auto-rows-max overflow-y-auto h-screen">
		<div class="grid grid-cols-3 font-bold gap-8 col-span-2">
			<h2>Name</h2>
			<h2>Fällig bis</h2>
			{#each tasks as task}
				<div
					class="grid grid-cols-3 col-span-3 font-light gap-2 {task.data()
						.done == true
						? 'text-green-400'
						: ''} auto-rows-auto pl-4"
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
							on:click={() => {
								selectedTask = task
							}}
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
			{/each}
			<div class="col-span-3 flex justify-center ">
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
		<div class="border-2 ml-8 p-6 rounded-lg h-fit">
			<p class="text-semibold opacity-50 uppercase">
				Ausgewählte Aufgabe
			</p>
			<br />
			{#if tasks.length != 0}
				<p>{selectedTask.data().name}</p>
				{#if selectedTask.data().description != ''}
					<hr />
				{/if}
				<p>{selectedTask.data().description}</p>
				<hr />
				<p>Bis: {selectedTask.data().date.toDate().toDateString()}</p>
				<hr />
				<p>Erledigt: {selectedTask.data().done ? 'Ja' : 'Nein'}</p>
			{/if}
		</div>
	</div>
</main>
