const typingText = document.querySelector(".typing-text p"),
    inputField = document.querySelector(".input-field"),
    mistakeTag = document.querySelector(".mistake b"),
    wpmTag = document.querySelector(".wpm b"),
    timeTag = document.querySelector(".time span b"),
    modal = document.querySelector(".modal"),
    mistakeList = document.querySelector(".mistake-list ul"),
    progressBar = document.querySelector(".progress-bar"),
    levelSelector = document.querySelector("#level-selector"),
    langSelector = document.querySelector("#lang-selector"),
    tryAgain = document.querySelector("#try-again")


let charIndex = mistakes = 0,
    isTyping = false,
    timer, maxTime = 60,
    timeLeft = maxTime,
    wpm,
    viewportWidth = window.innerWidth,
    widthPerSec = (viewportWidth / maxTime),
    initialWidth = 0;

function randomParagraph(para) {
    const randomInd = Math.floor(Math.random() * para.length)
    typingText.innerHTML = "";
    para[randomInd].split("").forEach((letter) => {
        typingText.innerHTML += `<span>${letter}</span>`
    })
    document.addEventListener("keydown", () => inputField.focus())
    typingText.addEventListener("click", () => inputField.focus())
}



// This function check local strorage for lang and level
function paraChanger(level) {
    if (localStorage.getItem("lang") == 'fa') {
        typingText.style.direction = "rtl";
        switch (level) {
            case "1":
                randomParagraph(fa1);
                break;
            case "2":
                randomParagraph(fa2);
                break;
            case "3":
                randomParagraph(fa3);
                break;
            case "4":
                randomParagraph(fa4);
                break;
            case "5":
                randomParagraph(fa5);
                break;
            case "6":
                randomParagraph(fa6);
                break;
        }
    } else if (localStorage.getItem("lang") == 'en') {
        typingText.style.direction = "ltr";
        switch (level) {
            case "1":
                randomParagraph(en1);
                break;
            case "2":
                randomParagraph(en2);
                break;
            case "3":
                randomParagraph(en3);
                break;
            case "4":
                randomParagraph(en4);
                break;
            case "5":
                randomParagraph(en5);
                break;
            case "6":
                randomParagraph(en6);
                break;
        }
    }
}

function setSelected() {
    if (localStorage.getItem("lang") == "en") {
        langSelector.querySelector("option")
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        initialWidth += widthPerSec
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

function setSelected(selector, lango) {
    for (let i = 0; i < selector.childElementCount; i++) {
        if (lango == selector.children[i].value) {
            selector.children[i].setAttribute("selected", true)
        }
    }
}

levelSelector.addEventListener("change", function() {
    localStorage.setItem("level", levelSelector.value);
    window.location.reload()
    paraChanger(localStorage.getItem("level"))
})

langSelector.addEventListener("change", function () {
    localStorage.setItem("lang", langSelector.value);
    window.location.reload()
    paraChanger(localStorage.getItem("level"));
})

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
            mistakeList.removeChild(mistakeList.lastChild)
        }
        chars[charIndex].classList.remove("correct", "incorrect")
    } else {
        if (chars[charIndex].innerText === typedChar) {
            chars[charIndex].classList.add("correct")
        } else {
            mistakes++
            chars[charIndex].classList.add("incorrect")
            mistakeList.innerHTML +=
                `<li>Need <span class="correct">${chars[charIndex].innerText}</span> Typed <span class="incorrect">${typedChar}</span></li>`;
            mistakeList.scrollTop += 40;
        }
        charIndex++
    }
    chars.forEach(char => char.classList.remove("active"));
    chars[charIndex].classList.add("active");
})

tryAgain.addEventListener("click", () => {
    window.location.reload();
})

setSelected(langSelector, localStorage.getItem("lang"));
setSelected(levelSelector, localStorage.getItem("level"));
paraChanger(localStorage.getItem("level"));