import {
    copyMaths,
    mathQuillConfig,
    MQ,
    overwriteMathQuillKeyDown,
    sanitiseLatex,
} from "./core.js";

//////////////////////// Maths Input ////////////////////////

var mathsInput = document.getElementById("mathsInput");
var mathsInputWrapper = document.getElementById("mathsInputWrapper");
var mathsInputScroller = document.getElementById("mathsInputScroller");

mathsInput.innerHTML =
    localStorage.getItem("mathsValue") || "ax^2 + bx + c = 0";
// Initialise mathQuill field
var mathField = MQ.MathField(mathsInput, {
    ...mathQuillConfig,
    handlers: {
        edit: function () {
            var newValue = sanitiseLatex(mathField.latex());
            if (newValue) {
                localStorage.setItem("mathsValue", newValue);
            }
        },
    },
});

// the mathQuill edit event isn't fired when text is added inside a latex
// text block, so we add a keyup listener to pick this up. This means
// that we store the value to localStorage twice - this isn't ideal, but
// it's not the worst thing in the world either.
mathsInput.addEventListener("keyup", function () {
    var newValue = sanitiseLatex(mathField.latex());
    if (newValue) {
        localStorage.setItem("mathsValue", newValue);
    }
});

mathsInputWrapper.addEventListener("click", function (event) {
    if (
        event.target === mathsInputWrapper ||
        event.target === mathsInputScroller
    ) {
        mathField.focus();
        mathField.moveToRightEnd();
    }
});
//////////////////////// Static Maths ////////////////////////
var staticMathElements = document.getElementsByClassName("staticMath");
for (let element of staticMathElements) {
    MQ.StaticMath(element);
}

//////////////////////// Copy Logic ////////////////////////
var copyButton = document.getElementById("copyButton");
var copying = false;

var onCopyMaths = async function () {
    if (copying) {
        return;
    }
    copying = true;
    var buttonHTML = copyButton.innerHTML;
    var scaleFactor = localStorage.getItem("scaleFactor") || 2;
    copyMaths(mathsInput, scaleFactor);
    copyButton.innerHTML = "Copied...";
    await new Promise((resolve) => setTimeout(resolve, 750));
    copyButton.innerHTML = buttonHTML;
    copying = false;
};

copyButton.addEventListener("click", onCopyMaths);
overwriteMathQuillKeyDown(document.body, mathsInput, mathField, onCopyMaths);

//////////////////////// Colour Logic ////////////////////////

document
    .getElementById("colorInput")
    .addEventListener("input", function (event) {
        document.documentElement.style.setProperty(
            "--maths-colour",
            event.target.value
        );
    });

//////////////////////// Settings Dialogue ////////////////////////
var settingsDialogue = document.getElementById("settingsDialogue");
var settingsButton = document.getElementById("settingsButton");
var settingsButtonGroup = document.getElementById("settingsButtonGroup");
var settingsForm = document.getElementById("settingsForm");

settingsButton.addEventListener("click", function () {
    if (!settingsDialogue.open) {
        settingsForm.elements.scaleFactor.value =
            localStorage.getItem("scaleFactor") || 2;
        settingsDialogue.show();
    } else {
        settingsDialogue.close();
    }
});

/*
 * If a keyboard-user tabs out of the dialog they should
 * expect the dialog to close. If focus is lost to the
 * dialog-trigger then this is handled by the click event above.
 */
settingsButtonGroup.addEventListener("focusout", function (event) {
    if (
        settingsButtonGroup.contains(event.relatedTarget) ||
        !document.hasFocus()
    ) {
        return;
    }
    settingsDialogue.close();
});

// Exit if escape key is pressed
settingsDialogue.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        settingsDialogue.close();
        settingsButton.focus();
    }
});

settingsDialogue.addEventListener("close", function (event) {
    if (event.target.returnValue == "submit") {
        var scaleFactor = settingsForm.elements.scaleFactor.value;
        localStorage.setItem("scaleFactor", scaleFactor);
        settingsButton.focus();
    } else if (event.target.returnValue == "close") {
        settingsButton.focus();
    }
});

//////////////////////// Burger Menu ////////////////////////
var burgerMenuButton = document.getElementById("burgerMenuButton");
var mobileNavMenu = document.getElementById("mobileNavMenu");

var toggleBurgerMenu = function () {
    // maybe redo this later
    if (burgerMenuButton.classList.contains("closed")) {
        burgerMenuButton.classList.replace("closed", "open");
    } else {
        burgerMenuButton.classList.replace("open", "closed");
    }
};
burgerMenuButton.addEventListener("click", toggleBurgerMenu);
mobileNavMenu.addEventListener("focusout", function (event) {
    if (!mobileNavMenu.contains(event.relatedTarget)) {
        toggleBurgerMenu();
    }
});
document.addEventListener("mousedown", function (event) {
    if (
        burgerMenuButton.classList.contains("open") &&
        !mobileNavMenu.contains(event.target) &&
        event.target !== burgerMenuButton
    ) {
        burgerMenuButton.classList.replace("open", "closed");
    }
});
