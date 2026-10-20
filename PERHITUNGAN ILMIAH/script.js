
const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let lastAnswer = 0;
let justCalculated = false;

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            display.value = "";
            justCalculated = false;
            return;
        }

        if (action === "delete") {
            display.value = display.value.slice(0, -1);
            justCalculated = false;
            return;
        }

        if (action === "calculate") {
            calculate();
            return;
        }

        if (value !== undefined) {
            const isOperator = ["+", "-", "*", "/", "%", "^"].includes(value);

            if (justCalculated && !isOperator && value !== ")") {
                display.value = "";
            }

            display.value += value;
            justCalculated = false;
        }
    });
});

function calculate() {
    try {
        let expression = display.value;

        if (!expression.trim()) return;

        // Mengubah simbol matematika menjadi fungsi JavaScript
        expression = expression
            .replace(/\bsin\(/g, "sin(")
            .replace(/\bcos\(/g, "cos(")
            .replace(/\btan\(/g, "tan(")
            .replace(/\blog\(/g, "log(")
            .replace(/\bln\(/g, "ln(")
            .replace(/\bsqrt\(/g, "sqrt(")
            .replace(/\bpi\b/g, "PI")
            .replace(/\be\b/g, "E")
            .replace(/\bans\b/g, "ANS");

        // Mengubah fungsi pangkat x^y menjadi operasi pangkat
        expression = expression.replace(/\^/g, "**");

        // Membatasi karakter yang boleh digunakan
        if (!/^[0-9+\-*/().%\sA-Za-z_]+$/.test(expression)) {
            throw new Error("Input tidak valid");
        }

        // Evaluasi dengan fungsi matematika yang diizinkan
        const allowed = {
            sin: x => Math.sin(x * Math.PI / 180),
            cos: x => Math.cos(x * Math.PI / 180),
            tan: x => Math.tan(x * Math.PI / 180),
            log: x => Math.log10(x),
            ln: x => Math.log(x),
            sqrt: x => Math.sqrt(x),
            PI: Math.PI,
            E: Math.E,
            ANS: lastAnswer
        };

        const names = Object.keys(allowed);
        const values = Object.values(allowed);

        const result = new Function(
            ...names,
            `"use strict"; return (${expression});`
        )(...values);

        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Hasil tidak valid");
        }

        lastAnswer = result;
        display.value = Number(result.toPrecision(12)).toString();
        justCalculated = true;

    } catch (error) {
        display.value = "Error";
        justCalculated = true;
    }
}
