import { mount } from 'svelte';
import '../app.css'
import * as utils from './utils.js';

utils.mountOnEveryPage(true);

async function getProtected() {
    const response = await fetch('https://localhost:3000/users/proctected', {
        headers: {
            Authorization: `Bearer ${ClerkComponents.session?.access_tocken}`,
        },
    })
}

async function init() {
    await getProtected();

}

init()
export default app