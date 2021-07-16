import "regenerator-runtime/runtime";
import $ from "jquery";

window.jQuery = $;

// jsdom doesn't support getComputedStyle with a second argument.
// The following removes a lot of noisy warnings from test-output.
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

Object.assign(navigator, {
    clipboard: {
        write: jest.fn(),
    },
});
window.ClipboardItem = function (clipboardItem) {
    const type = Object.keys(clipboardItem)[0];
    this.type = type;
    this.data = clipboardItem[type];
};

// Utility used for image-snaphots
global.blobToBuffer = function (file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            const buffer = Buffer.from(reader.result);
            resolve(buffer);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};
