<script>
    import { onMount } from "svelte";
    import { Clerk } from "@clerk/clerk-js";


    // let authRef;
    // let { isProtected = true }  = $props();
    // function signUpHandler(){
    //     ClerkComponents.openSignUp(authRef);
    // }

    let signInBtn = $state(null);
    const { isProtected = false } = $props();
    
    onMount(async () => {
        const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
        let clerk = new Clerk(clerkPubKey);
        await clerk.load();
        if (clerk.isSignedIn) {
            clerk.mountUserButton(signInBtn);
        } else {
            if (isProtected) {
                clerk.redirectToSignIn();
            } else {
                signInBtn.innerHTML = 'Sign In / Register';
                signInBtn.onclick = () => clerk.openSignIn();
            }
        }

        // make span elements clickable
        document.querySelectorAll('.right span[href]').forEach((span) => {
            span.addEventListener('click', () => {
                window.location.href = span.getAttribute('href');
            });
        })
    });

</script>

<div class="row">
    <img src="/images/DragonQuill.png" alt="Logo">
    <h1><a href="/">The Dragon's Quill</a></h1>
    <div class="right">
        <span bind:this={signInBtn} class="register-btn"></span>
        <a href="/browse/">Browse</a>
    </div>
</div>

<style>

div.row {
    display: flex;
    flex-direction: row;
    position: absolute;
    background-color: var(--primary-color);
    width: 100vw;
    top: 0;
    left: 0;
    align-items: center;
    color: var(--font-color);
    font-weight: bold;
}

img {
    margin-left: 1rem;
    max-width: 60px;
}

h1 {
    margin: 0.75rem 1.5rem;
    font-family: var(--scroll-font);
    text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
}

.right {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    position: absolute;
    right: 1.5rem;
    cursor: pointer;
    gap: 2rem;
    font-weight: normal;
    color: var(--font-color);
    font-family: var(--scroll-font);
    font-size: large;
}
a {
    text-decoration: none;
    color: inherit;
}
.right .register-btn {
    border: 1px solid var(--font-color);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}

</style>