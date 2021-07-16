import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/dom";
import {
	copyMaths,
	mathQuillConfig,
	MQ,
	overwriteMathQuillKeyDown,
	sanitiseLatex,
} from "../../src/js/core";

jest.mock("dom-to-image", () => ({
	...jest.requireActual("dom-to-image"),
	toPng: jest.fn(async (node, options) => {
		jest.requireActual("dom-to-image").toSvg(node, options);
		const { dataUrl } = require("../fixtures");
		return Promise.resolve(dataUrl);
	}),
}));

const renderMathsInput = () => {
	document.body.innerHTML = `
		<div id="mathsInput" data-testid="mathsInput">x^2+3</div>
		<button id="copyButton" type="button">Copy Maths</button>
	`;

	var mathsInput = screen.getByTestId("mathsInput");
	var mathField = MQ.MathField(mathsInput, {
		...mathQuillConfig,
	});
	return mathField;
};

describe("Check MathQuill Input Configuration", () => {
	var mathField, mathsInput, mockCopyMaths;
	beforeEach(() => {
		mathField = renderMathsInput();
		mathsInput = screen.getByTestId("mathsInput");
		mockCopyMaths = jest.fn();
		overwriteMathQuillKeyDown(
			document.body,
			mathsInput,
			mathField,
			mockCopyMaths
		);
		userEvent.click(mathsInput);
	});

	test("Ctrl + C with selection", async () => {
		userEvent.keyboard("{shift}{arrowLeft}{arrowLeft}{/shift}");
		const textarea = screen.getByTestId("mathsInputTextArea");
		await waitFor(() => {
			expect(textarea.value).toEqual("+3");
		});
		expect(mockCopyMaths.mock.calls.length).toBe(0);
	});

	test("Ctrl + C, without selection triggers copy", () => {
		userEvent.keyboard("+2*3");
		userEvent.keyboard("{ctrl}c");
		expect(mockCopyMaths.mock.calls.length).toBe(1);
	});

	test("Meta + C, without selection triggers copy", () => {
		userEvent.keyboard("+2*3");
		userEvent.keyboard("{meta}c");
		expect(mockCopyMaths.mock.calls.length).toBe(1);
	});

	test("asterix key produces times symbol", async () => {
		userEvent.keyboard("+2*3");
		await waitFor(() => {
			expect(mathField.latex()).toEqual("x^2+3+2\\times3");
		});
	});

	test("auto-commands work as expected", async () => {
		userEvent.keyboard("+sqrtpi+gamma");
		await waitFor(() => {
			expect(mathField.latex()).toEqual("x^2+3+\\sqrt{\\pi+\\gamma}");
		});
	});
});

describe("Check copy to clipboard functionaliy", () => {
	test("Check snap-shot", async () => {
		renderMathsInput();
		const copyButton = screen.getByText("Copy Maths");
		const mathsInput = screen.getByTestId("mathsInput");
		copyButton.addEventListener("click", () => {
			copyMaths(mathsInput, 1);
		});
		userEvent.click(copyButton);
		await waitFor(() => {
			expect(navigator.clipboard.write.mock.calls.length).toEqual(1);
		});
		expect(navigator.clipboard.write.mock.calls[0][0][0].type).toEqual(
			"image/png"
		);
		const blob = navigator.clipboard.write.mock.calls[0][0][0].data;
		const blobData = await blobToBuffer(blob);
		expect(blobData).toMatchImageSnapshot();
	});
});

describe("sanitiseLatex", () => {
	test("A space is inserted in empty text", () => {
		expect(sanitiseLatex("\\text{}")).toEqual("\\text{ }");
		expect(sanitiseLatex("x^3 + y_2 +1\\text{}")).toEqual(
			"x^3 + y_2 +1\\text{ }"
		);
	});
});
