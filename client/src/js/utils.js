import { mount } from 'svelte'
import Nav from '../components/Nav.svelte'
import Head from '../components/Head.svelte'

export function mountComponent(component, targetSelector) {
    let target = document.querySelector(targetSelector);
    if (target) {
        mount(component, target);
    }
}

export function mountOnEveryPage() {
    debugger;
    mountComponent(Head, 'head');
    mountComponent(Nav, 'body > nav');
}