<script>
  import { initializeApp } from "firebase/app";
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
  import { fade } from "svelte/transition";
  import { replace } from "svelte-spa-router";

  let loginError = "";
  let isLoginError = false;

  const config = {
    apiKey: "AIzaSyDDn00uprCYk36uf4UKH-COOPzsLuc1JkA",
    authDomain: "putzfee-a3b88.firebaseapp.com",
    databaseURL:
      "https://putzfee-a3b88-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "putzfee-a3b88",
    storageBucket: "putzfee-a3b88.appspot.com",
    messagingSenderId: "174903135777",
    appId: "1:174903135777:web:69ca3465bc5ab545c65d60",
  };

  const app = initializeApp(config);
  const auth = getAuth(app);

  const loginSubmit = async (form) => {
    form.preventDefault();
    signInWithEmailAndPassword(
      auth,
      form.target.elements.email.value,
      form.target.elements.password.value
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        replace("/main");
        // ...
      })
      .catch((error) => {
        isLoginError = true;
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
          case "auth/user-not-found":
            loginError =
              "Your E-Mail was not found, please enter a registered E-Mail address!";
            break;

          case "auth/wrong-password":
            loginError = "You entered a wrong password!";
            break;

          case "auth/too-many-requests":
            loginError =
              "The serve received too many requests, please wait before trying again...";
            break;
        }
      });
    form.target.reset();
    setTimeout(() => (isLoginError = false), 5000);
    form.target.elements.email.focus();
  };
</script>

<main
  in:fade
  out:fade={{ duration: 500 }}
  class="p-16 font-poppins select-none"
>
  <h1 class="text-center text-3xl mb-2">Welcome to ReFresh!</h1>
  <img class="m-auto mb-2" src="../img/ReFresh-Logo128.png" alt="App Logo" />
  <p class="text-center">Please log in to continue</p>

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
        placeholder="Password"
        required
        minlength="8"
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
