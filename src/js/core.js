import MathQuill from "exports-loader?exports=default|window.MathQuill!imports-loader?imports=jquery&additionalCode=window.jQuery=jquery!../../vendor/mathquill-0.10.1/mathquill.min.js";
import domtoimage from "dom-to-image";
import { autoCommands } from "./latexCommands";

export const MQ = MathQuill.getInterface(2);
export const mathQuillConfig = {
	autoCommands,
	// Replace standard textarea so that we can give it an id and assign
	// a label. Mathquill isn't very screen-reader friendly. But this
	// seems better than nothing.
	substituteTextarea: function () {
		var textArea = document.createElement("textarea");
		textArea.setAttribute("autocapitalize", "off");
		textArea.setAttribute("autocomplete", "off");
		textArea.setAttribute("autocorrect", "off");
		textArea.setAttribute("spellcheck", false);
		textArea.setAttribute("x-palm-disable-ste-all", true);
		textArea.setAttribute("id", "mathsInputTextArea");
		textArea.setAttribute("data-testid", "mathsInputTextArea");
		return textArea;
	},
};

const {
	toPng,
	impl: { util: domToImageUtils },
} = domtoimage;

function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this

	var byteString = atob(dataURI.split(",")[1]);

	// separate out the mime component
	var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	var ia = new Uint8Array(ab);

	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	var blob = new Blob([ab], { type: mimeString });
	return blob;
}

export const copyMaths = function (node, scaleFactor = 1) {
	return toPng(node, {
		width: domToImageUtils.width(node) * scaleFactor,
		height: domToImageUtils.height(node) * scaleFactor,
		style: {
			transform: `scale(${scaleFactor})`,
			"transform-origin": "top left",
		},
		filter: function (element) {
			if (element.classList) {
				return !element.classList.contains("mq-cursor");
			}
			return true;
		},
	})
		.then(function (dataUrl) {
			const imgBlob = dataURItoBlob(dataUrl);
			navigator.clipboard.write([
				new ClipboardItem({
					"image/png": imgBlob,
				}),
			]);
		})
		.catch(function (error) {
			console.error("oops, something went wrong!", error);
		});
};

export const overwriteMathQuillKeyDown = function (
	body,
	mathsInput,
	mathField,
	copyMathsCallback
) {
	body.addEventListener(
		"keydown",
		function (event) {
			if (!mathsInput.contains(event.target)) {
				return;
			}

			var ctrlDown = event.ctrlKey || event.metaKey;
			// custom handling of Ctrl-C
			if (
				ctrlDown &&
				event.key === "c" &&
				// if something is selected let mathquill
				// handle copying.
				!mathField.__controller.cursor.selection
			) {
				copyMathsCallback();
			}
			// replace * with '\times'
			else if (event.key === "*") {
				mathField.write("\\times");
			} else {
				return;
			}
			event.stopImmediatePropagation();
			event.preventDefault();
		},
		true
	);
};

export const sanitiseLatex = function (latex) {
	// initialising mathQuill with \text{} seems to cause
	// an error, so replace with \text{ } before saving
	return latex.replace("\\text{}", "\\text{ }");
};
