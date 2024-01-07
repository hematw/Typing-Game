const typingText = document.querySelector(".typing-text p");
const inputField = document.querySelector(".input-field");
const mistakeTag = document.querySelector(".mistake b");
const wpmTag = document.querySelector(".wpm b");
const timeTag = document.querySelector(".time span b");
const modal = document.querySelector(".modal");
const mistakeList = document.querySelector(".mistake-list ul")
const progressBar = document.querySelector(".progress-bar");

const correctLetter = mistakeList.querySelector(".correct")
const incorrectLetter = mistakeList.querySelector(".incorrect")


let charIndex = mistakes = 0;
let isTyping = false;
let timer, maxTime = 60,
timeLeft = maxTime;
let wpm;
let viewportWidth = window.innerWidth;
console.log(viewportWidth);
let widthPerSec = (viewportWidth / maxTime);
console.log(widthPerSec);
let initialWidth = 0;

(function randomParagraph() {
    const randomInd = Math.floor(Math.random() * paragraphs.length)
    paragraphs[randomInd].split("").forEach((letter) => {
        typingText.innerHTML += `<span>${letter}</span>`
    })
    document.addEventListener("keydown", () => inputField.focus())
    typingText.addEventListener("click", () => inputField.focus())
})()

inputField.addEventListener("input", function initTyping() {

    const chars = typingText.querySelectorAll("span");
    const typedChar = inputField.value.split("")[charIndex];

    if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }
    if (typedChar == null) {
        charIndex--;
        if (chars[charIndex].classList.contains("incorrect")) {
            mistakes--
        }
        mistakeList.removeChild(mistakeList.lastChild)
        chars[charIndex].classList.remove("correct", "incorrect")
    } else {
        if (chars[charIndex].innerText === typedChar) {
            chars[charIndex].classList.add("correct")
        } else {
            mistakes++
            chars[charIndex].classList.add("incorrect")
            mistakeList.innerHTML +=
            `<li>Need <span class="correct">${chars[charIndex].innerText}</span> Typed <span class="incorrect">${typedChar}</span></li>`;
        }
        charIndex++
    }
    chars.forEach(char => char.classList.remove("active"));
    chars[charIndex].classList.add("active");
})

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        initialWidth +=widthPerSec
        progressBar.style.width = initialWidth + "px";
        timeTag.innerHTML = timeLeft;
        wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
    } else {
        clearInterval(timer);
        modal.classList.add("active")
        mistakeTag.textContent = mistakes;
        wpmTag.textContent = wpm
    }
}
