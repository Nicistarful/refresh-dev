<script>
	import * as storage from './stores'
	import { collection, addDoc, Timestamp } from 'firebase/firestore'

	export let afterSuccess = () => {}
	export let hidden = true

	const submit = form => {
		form.preventDefault()
		const data = {
			date: Timestamp.fromDate(
				new Date(form.target.elements.duedate.value)
			),
			description: form.target.elements.description.value,
			done: false,
			name: form.target.elements.taskname.value,
			user: storage.auth.currentUser.uid,
		}
		console.log(data)
		addDoc(collection(storage.db, 'tasks'), data).then(() => {
			form.target.reset()
			afterSuccess()
		})
	}
</script>

{#if !hidden}
	<main class="p-8">
		<form class="flex flex-col h-fit" on:submit={submit}>
			<div class="w-full h-content flex flex-row items-baseline">
				<label for="taskname" class="form-label w-60"
					>Name der Aufgabe:</label
				>
				<br />
				<input
					type="text"
					id="taskname"
					name="taskname"
					class="login-input text-left"
					minlength="4"
					placeholder="Kurzer beschreibender Name"
					required
				/>
			</div>
			<div class="w-full h-content flex flex-row items-baseline">
				<label for="duedate" class="form-label w-60">Fällig bis:</label>
				<br />
				<input
					type="datetime-local"
					id="duedate"
					name="duedate"
					class="login-input"
					required
				/>
			</div>
			<div class="w-full h-content flex flex-row items-baseline">
				<label for="description" class="form-label w-60"
					>Beschreibung:</label
				>
				<br />
				<textarea
					type="text"
					id="description"
					name="description"
					class="login-input h-60 text-left resize-none"
					placeholder="Die Aufgabe näher beschreiben, was genau ist zu tun, etc..."
				/>
			</div>
			<button class="login-button" action="submit">Hinzufügen</button>
		</form>
	</main>
{/if}
