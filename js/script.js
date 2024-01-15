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
    tryAgain = document.querySelector("#try-again"),
    nextButton = document.querySelector("#next")

let charIndex = mistakes = 0,
    isTyping = false,
    timer, maxTime = 60,
    timeLeft = maxTime,
    wpm,
    viewportWidth = window.innerWidth,
    widthPerSec = (viewportWidth / maxTime),
    initialWidth = 0,
    chars;

//  this function takes a paragraph and add in DOM 
function randomParagraph(para) {
    const randomInd = Math.floor(Math.random() * para.length);
    typingText.innerHTML = "";
    para[randomInd].split("").forEach((letter) => {
        typingText.innerHTML += `<span>${letter}</span>`
    });
    document.addEventListener("keydown", () => inputField.focus());
    typingText.addEventListener("click", () => inputField.focus());
}



// Takes level an check local strorage for Language
// and then call randomParagraph
function paraChanger(level) {
    let lang = localStorage.getItem("lang");
    let paraCollection = lang === "fa" ?
        [fa1, fa2, fa3, fa4, fa5, fa6] :
        [en1, en2, en3, en4, en5, en6];
    randomParagraph(paraCollection[level - 1]);
}

// Checks if modal is not active
function showResult() {
    if (!modal.classList.contains("active")) {
        mistakeTag.textContent = mistakes;
        wpmTag.textContent = wpm;
        modal.classList.add("active");
        failOrPass();
        setSelected(levelSelector, localStorage.getItem("level"));
    }
}

//  Check mistakes if 
//  > 5 Fail
//  < 5 OR < 15% Pass
function failOrPass() {
    let percentage = (mistakes * 100) / charIndex;
    if ((mistakes < 5 && charIndex == chars.length - 1) || percentage < 15) {
        let currentLevel = Number(localStorage.getItem("level"));
        localStorage.setItem("level", currentLevel + 1);
        localStorage.setItem("maxLevel", currentLevel + 1);
        nextButton.removeAttribute("hidden");
        tryAgain.setAttribute("hidden", "hidden");
    }
}

function levelEnabler() {
    let allOptions = levelSelector.querySelectorAll("option");
    let maxLevel = localStorage.getItem("maxLevel") || 1;
    allOptions.forEach((option) => {
        if (maxLevel < option.value) {
            option.setAttribute("disabled", "disabled")
        }
    })
}
levelEnabler();


function initTimer() {
    if (timeLeft > 0 && !modal.classList.contains("active")) {
        timeLeft--;
        initialWidth += widthPerSec
        progressBar.style.width = initialWidth + "px";
        timeTag.innerHTML = timeLeft;
        wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
    } else {
        clearInterval(timer);
        showResult();
    }
}

function resetGame() {
    paraChanger(localStorage.getItem("level"));
    tryAgain.removeAttribute("hidden");
    charIndex = mistakes =
    wpmTag.innerHTML =
    mistakeTag.innerHTML =
    initialWidth = 0,
    isTyping = false,
    timeLeft = maxTime,
    timeTag.innerHTML = timeLeft,
    modal.classList.remove("active"),
    mistakeList.innerHTML = "",
    progressBar.style.width = initialWidth + "px";
}

function setSelected(selector, lango) {
    for (let i = 0; i < selector.childElementCount; i++) {
        if (lango == selector.children[i].value) {
            selector.children[i].setAttribute("selected", true);
        }
    }
}

function initTyping() {
    chars = typingText.querySelectorAll("span");
    const typedChar = inputField.value.split("")[charIndex];
    if (timeLeft != 0) {
        if (charIndex == chars.length - 1) {
            showResult();
            timeLeft = 0;
            return;
        }
        chars[charIndex].classList.add("active");
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if (typedChar == null) {
            charIndex--;
            if (chars[charIndex].classList.contains("incorrect")) {
                mistakes--;
                mistakeList.removeChild(mistakeList.lastChild);
            }
            chars[charIndex].classList.remove("correct", "incorrect")
        } else {
            if (chars[charIndex].innerText === typedChar) {
                chars[charIndex].classList.add("correct");
            } else {
                mistakes++
                chars[charIndex].classList.add("incorrect");
                mistakeList.innerHTML +=
                `<li>Need <span class="correct">${chars[charIndex].innerText}</span> Typed <span class="incorrect">${typedChar}</span></li>`;
                mistakeList.scrollTop += 40;
            }
            charIndex++;
        }
        chars.forEach(char => char.classList.remove("active"));
    }
}

levelSelector.addEventListener("change", function () {
    localStorage.setItem("level", levelSelector.value);
    paraChanger(localStorage.getItem("level"));
})

langSelector.addEventListener("change", function () {
    localStorage.setItem("lang", langSelector.value);
    paraChanger(localStorage.getItem("level"));
})

inputField.addEventListener("input", initTyping);

tryAgain.addEventListener("click", resetGame);

nextButton.addEventListener("click", () => {
    paraChanger(localStorage.getItem("level"));
    resetGame();
})

setSelected(langSelector, localStorage.getItem("lang"));
setSelected(levelSelector, localStorage.getItem("level"));
paraChanger(localStorage.getItem("level") || 1);