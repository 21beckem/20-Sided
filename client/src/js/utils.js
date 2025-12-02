import { mount } from 'svelte';
import Nav from '../components/Nav.svelte';
import Head from '../components/Head.svelte';

export function mountComponent(component, targetSelector, props = {}) {
    let target = document.querySelector(targetSelector);
    if (target) {
        mount(component, {
            target,
            props
        });
    }
}

export function mountOnEveryPage(isProtected=false) {
    mountComponent(Head, 'head');
    mountComponent(Nav, 'body > nav', { isProtected: isProtected });
}

export async function waitForClerkToInit() {
    while (!window.clerk) {
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}