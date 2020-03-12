import { Parallax, Scroll } from 'giftbag'
// All giftbag follow this pattern
// 1. Create
// 2. Setup
// 3. Initialize
// 1. Create new parallax
const parallax = new Parallax();
// 2. Setup
// Selector elements
const parallaxElements = document.querySelectorAll('.parallax-element')
parallax.setup({
    selector: parallaxElements // This is the elements that will be selected
})
// 3. Init
parallax.init()
// Scroll based animations
const scroll = new Scroll();
const scrollElements = document.querySelectorAll('.scroll-element');
scroll.setup({
    selector: scrollElements
})
scroll.init()