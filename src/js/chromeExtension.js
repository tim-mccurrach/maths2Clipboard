/* global chrome */
import {
    MQ,
    mathQuillConfig,
    copyMaths,
    overwriteMathQuillKeyDown,
    sanitiseLatex,
} from "./core.js";

// chrome.storage.local.set({ mathsValue: "x" });

var mathsInput = document.getElementById("mathsInput");
var mathsInputWrapper = document.getElementById("mathsInputWrapper");
var mathsInputScroller = document.getElementById("mathsInputScroller");
var copyButton = document.getElementById("copyButton");
var colourInput = document.getElementById("colorInput");

var copying = false;
var onCopyMaths = function () {
    chrome.storage.local.get({ scaleFactor: 4 }, async function (result) {
        if (copying) {
            return;
        }
        copying = true;
        var buttonHTML = copyButton.innerHTML;
        copyMaths(mathsInput, result.scaleFactor).then(async () => {
            copyButton.innerHTML = "Copied...";
            await new Promise((resolve) => setTimeout(resolve, 750));
            copyButton.innerHTML = buttonHTML;
            copying = false;
        });
    });
};

chrome.storage.local.get({ mathsValue: "ax^2 + bx + c = 0" }, function (
    result
) {
    mathsInput.innerHTML = result.mathsValue;
    var mathField = MQ.MathField(mathsInput, {
        ...mathQuillConfig,
        handlers: {
            edit: function () {
                var newValue = sanitiseLatex(mathField.latex());
                if (newValue) {
                    chrome.storage.local.set({ mathsValue: newValue });
                }
            },
        },
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

    overwriteMathQuillKeyDown(
        document.body,
        mathsInput,
        mathField,
        onCopyMaths
    );

    // the mathQuill edit event isn't fired when text is added inside a latex
    // text block, so we add a keyup listener to pick this up. This means
    // that we store the value to localStorage twice - this isn't ideal, but
    // it's not the worst thing in the world either.
    mathsInput.addEventListener("keyup", function () {
        var newValue = sanitiseLatex(mathField.latex());
        if (newValue) {
            chrome.storage.local.set({ mathsValue: newValue });
        }
    });

    //focus the input on load
    mathField.focus();
});

chrome.storage.local.get({ mathsColour: "#000000" }, function (result) {
    document.documentElement.style.setProperty(
        "--maths-colour",
        result.mathsColour
    );
    colourInput.value = result.mathsColour;
});

copyButton.addEventListener("click", onCopyMaths);

colourInput.addEventListener("input", function (event) {
    document.documentElement.style.setProperty(
        "--maths-colour",
        event.target.value
    );
    chrome.storage.local.set({ mathsColour: event.target.value });
});
