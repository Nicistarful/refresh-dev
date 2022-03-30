<script>
	import { fade } from 'svelte/transition'
	import { db, auth } from './stores'
	import {
		doc,
		getDoc,
		getDocs,
		collection,
		query,
		where,
		arrayRemove,
		arrayUnion,
		updateDoc,
		addDoc,
	} from 'firebase/firestore'

	$: userName = ''
	$: groupName = ''
	$: members = ['']
	$: admins = ['']
	const groupsRef = collection(db, 'groups')

	const user = auth.currentUser
	const userId =
		user == null || user === undefined
			? '5lSb7uK3jccB5gL4EyNCIedmv7F3'
			: user.uid

	try {
		getDoc(doc(db, 'users', userId)).then(snapshot => {
			userName = snapshot.data().name
		})
	} catch (e) {}

	const fetchGroup = () => {
		const groupQuery = query(
			groupsRef,
			where('members', 'array-contains', userId)
		)

		getDocs(groupQuery).then(snapshot => {
			snapshot.forEach(document => {
				groupName = document.data().name

				document.data().members.forEach(member => {
					getDoc(doc(db, 'users', member))
						.then(userDoc => {
							members = [...members, userDoc.data().name]
						})
						.catch(e => {})
				})

				document.data().admins.forEach(member => {
					getDoc(doc(db, 'users', member))
						.then(userDoc => {
							admins = [...admins, userDoc.data().name]
						})
						.catch(e => {})
				})
			})
		})
	}

	const leaveGroup = () => {
		const groupQuery = query(
			groupsRef,
			where('members', 'array-contains', userId)
		)
		getDocs(groupQuery).then(snapshot => {
			snapshot.forEach(document => {
				updateDoc(document.ref, 'members', arrayRemove(userId))
			})
		})
		userName = ''
		groupName = ''
		members = ['']
		admins = ['']
	}

	fetchGroup()

	const groupSubmit = value => {
		console.log(value)
		const groupQuery = query(groupsRef, where('name', '==', value))
		getDocs(groupQuery)
			.then(snapshot => {
				if (snapshot.empty) {
					window.alert('Diese Gruppe existiert leider nicht!')
				} else {
					snapshot.forEach(document => {
						updateDoc(document.ref, 'members', arrayUnion(userId))
					})
				}
			})
			.finally(setTimeout(fetchGroup, 500))
	}

	const createGroup = value => {
		addDoc(collection(db, 'groups'), {
			admins: [userId],
			members: [userId],
			name: value,
		}).then(setTimeout(fetchGroup, 500))
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
	</nav>
	{#if groupName != ''}
		<div class="p-16 grid grid-cols-2">
			<section>
				<label for="group-name" class="uppercase opacity-50"
					>Gruppenname</label
				>
				<p id="group-name">{groupName}</p>
				<br />
				<label for="admins" class="uppercase opacity-50"
					>Administratoren</label
				>
				<section id="admins">
					{#each admins as admin}
						<p>{admin}</p>
					{/each}
				</section>
				<br />
				<label for="members" class="uppercase opacity-50"
					>Mitglieder</label
				>
				<section id="members">
					{#each members as member}
						<p>{member}</p>
					{/each}
				</section>
			</section>
			<section>
				<button class="login-button" on:click={leaveGroup}
					>Gruppe verlassen</button
				>
			</section>
		</div>
	{:else}
		<form class="p-16">
			<input
				id="group-input"
				type="text"
				class="login-input"
				required
				placeholder="Gruppennamen eingeben..."
				name="name"
			/>
			<button
				class="login-button"
				name="join"
				on:click={() =>
					groupSubmit(document.querySelector('#group-input').value)}
				>Gruppe beitreten</button
			>
			<button
				class="login-button"
				name="create"
				on:click={() =>
					createGroup(document.querySelector('#group-input').value)}
				>Gruppe erstellen</button
			>
		</form>
	{/if}
</main>
