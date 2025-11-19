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
                signInBtn.innerHTML = 'Sign In';
                signInBtn.onclick = () => clerk.openSignIn();
            }
        }
    });

</script>

<div class="row">
    <img src="/images/DragonQuill.png" alt="Logo">
    <h1>Dragon's Quill</h1>
    <div class="user-btn" bind:this={signInBtn}></div>
</div>

<style>

    div.row{
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

    img{
        max-width: 60px;
    }

    h1{
        text-shadow:
            -1px -1px 0 #000,
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
    }

    .user-btn{
        position: absolute;
        right: 2rem;
        cursor: pointer;
    }
    
</style>