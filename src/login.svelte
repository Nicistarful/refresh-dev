<script>
	import {
		getAuth,
		signInWithEmailAndPassword,
		createUserWithEmailAndPassword,
	} from 'firebase/auth'
	import {
		collection,
		query,
		where,
		getDocs,
		setDoc,
		doc,
	} from 'firebase/firestore'
	import { fade } from 'svelte/transition'
	import { replace } from 'svelte-spa-router'
	import { auth, db } from './stores'

	let loginError = ''
	let isLoginError = false

	const loginSubmit = async form => {
		const mail = form.target.elements.email.value
		const password = form.target.elements.password.value
		const name = form.target.elements.name.value
		form.preventDefault()

		const usersRef = collection(db, 'users')
		const q = query(usersRef, where('mail', '==', mail))
		const snapshot = await getDocs(q)
		if (snapshot.docs[0] === undefined) {
			console.log('Email does not exist!')
			const createdUser = await createUserWithEmailAndPassword(
				auth,
				mail,
				password
			)
			const uid = createdUser.user.uid
			const data = {
				name: name,
				mail: mail,
			}
			await setDoc(doc(db, 'users', uid), data)
			window.alert('Account wurde erstellt, bitte nun einloggen')
			form.target.reset()
			return
		} else if (snapshot.docs[0].data().mail === mail) {
			console.log('Email exists!')
		}

		signInWithEmailAndPassword(auth, mail, password)
			.then(userCredential => {
				// Signed in
				const user = userCredential.user
				replace('/tasks')
				// ...
			})
			.catch(error => {
				isLoginError = true
				const errorCode = error.code
				const errorMessage = error.message
				switch (errorCode) {
					case 'auth/user-not-found':
						loginError =
							'Die E-Mail wurde nicht erkannt, bitte eine gültige E-Mail eingeben!'
						break

					case 'auth/wrong-password':
						loginError = 'Das Passwort ist falsch!'
						break

					case 'auth/too-many-requests':
						loginError =
							'Der Server hat zu viele Anfragen erhalten, bitte einen Moment warten...'
						break
				}
			})
		form.target.reset()
		setTimeout(() => (isLoginError = false), 5000)
		form.target.elements.email.focus()
	}
</script>

<main
	in:fade
	out:fade={{ duration: 500 }}
	class="p-16 font-poppins select-none"
>
	<h1 class="text-center text-3xl mb-2">Willkommen bei ReFresh!</h1>
	<img class="m-auto mb-2" src="../img/ReFresh-Logo128.png" alt="App Logo" />
	<p class="text-center">Bitte einloggen um fortzufahren</p>
	<p class="text-center opacity-50 uppercase">
		Hinweis: Sollten Sie keinen Account haben, bitte im Namesfeld Ihren
		Namen eingeben
	</p>

	<div class="absolute top-1/2 left-1/4 right-1/4">
		<form on:submit={loginSubmit}>
			<input
				name="email"
				type="email"
				class="login-input"
				placeholder="E-Mail"
				required
				pattern=".*@.*\..*"
			/>
			<input
				name="password"
				type="password"
				class="login-input"
				placeholder="Passwort"
				required
				minlength="8"
			/>
			<input
				name="name"
				type="text"
				class="login-input"
				placeholder="Vor- und Nachname"
			/>
			<input type="submit" class="login-button" value="Log In" />
		</form>
		{#if isLoginError}
			<p in:fade out:fade class="text-center mt-8 text-red-500">
				{loginError}
			</p>
		{/if}
	</div>
</main>
