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

export function isObjectEmpty(obj) {
    // First, ensure the input is a non-null object
    if (obj === null || typeof obj !== 'object') {
        return false; // Or throw an error, depending on desired behavior
    }
    return Object.keys(obj).length === 0;
}