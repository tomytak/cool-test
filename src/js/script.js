import {Parallax, Scroll} from 'giftbag'

console.log(Parallax)

// All Giftbag follow a pattern
// 1. Create
// 2. Setup
// 3. Initialize

// 1. Create new parallax
const parallax = new Parallax();

// 2. Setup parallax
const parallaxElements = document.querySelectorAll('.parallax-element');
parallax.setup({
    selector: parallaxElements //these elements will be selected
});

// 3. Init
parallax.init();


// Scroll based animations
const scroll = new Scroll();
const scrollElements = document.querySelectorAll('.scroll-element');
scroll.setup({
    selector: scrollElements
});
scroll.init()