import { mount } from 'svelte'
import Head from '../components/Head.svelte'
import Navbar from '../components/Navbar.svelte'

export function mountSvelteComponent(component, targetSelector) {
    let target = document.querySelector(targetSelector);
    if (!target) return;
    mount(component, {
        target,
    });
}

export function mountHeader() {
    mountSvelteComponent(Head, 'head');
    mountSvelteComponent(Navbar, '#footer');
}