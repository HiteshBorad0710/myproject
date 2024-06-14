// MOVING LETTERS
var textWrapper = document.querySelector(".text-rotate");
textWrapper.innerHTML = textWrapper.textContent.replace(
    /\S/g,
    "<span class='letter'>$&</span>"
);

anime
    .timeline({ loop: true })
    .add({
        targets: ".text-rotate .letter",
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: (el, i) => 150 * (i + 1),
    })
    .add({
        targets: ".text-rotate",
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000,
    });
// MOVING LETTERS