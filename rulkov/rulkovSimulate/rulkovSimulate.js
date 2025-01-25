document.addEventListener("DOMContentLoaded", () => {
    const simulateButton = document.getElementById("simulate");
    const resetZoomButton = document.getElementById("resetZoom");
    const downloadButton = document.getElementById("downloadTable");

    let rulkovChart;
    let fullOutput = ""; // Armazena a tabela completa

    function simulateRulkovModel() {
        const alpha = parseFloat(document.getElementById("alpha").value);
        const mu = parseFloat(document.getElementById("mu").value);
        const sigma = parseFloat(document.getElementById("sigma").value);
        const iterations = parseInt(document.getElementById("iterations").value);
        const iterationsTransient = parseInt(document.getElementById("iterationsTransient").value);

        let xn = parseFloat(document.getElementById("x0").value);
        let yn = parseFloat(document.getElementById("y0").value);

        if (isNaN(alpha) || isNaN(mu) || isNaN(sigma) || isNaN(xn) || isNaN(yn)) {
            alert("Por favor, insira valores numéricos válidos.");
            return;
        }

        let steps = [];
        let xValues = [];
        let output = "n\tx\ty\n";
        fullOutput = output; // Cabeçalho da tabela completa

        for (let n = 0; n < iterations; n++) {
            const xn1 = alpha / (1 + xn ** 2) + yn;
            const yn1 = yn - mu * (xn - sigma);

            const row = `${n}\t${xn1.toFixed(4)}\t${yn1.toFixed(4)}\n`;
            fullOutput += row; // Adiciona todas as linhas ao arquivo completo

            // Limita a exibição na tabela até n = 25
            if (n <= 25) {
                output += row;
            }

            if (n >= iterationsTransient) {
                steps.push(n);
                xValues.push(xn1);
            }

            xn = xn1;
            yn = yn1;
        }

        // Atualiza a saída exibida
        const outputElement = document.getElementById("output");
        outputElement.textContent = output;

        // Exibe o botão de download após a simulação
        downloadButton.style.display = "inline-block";

        // Atualiza o gráfico
        const ctx = document.getElementById("rulkovChart").getContext("2d");
        if (rulkovChart) {
            rulkovChart.destroy();
        }

        rulkovChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: steps,
                datasets: [
                    {
                        label: "x vs Steps",
                        data: xValues,
                        borderColor: "black",
                        borderWidth: 1.5,
                        fill: false,
                        pointRadius: 0,
                        tension: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    zoom: {
                        zoom: {
                            wheel: { enabled: true },
                            mode: "x",
                        },
                        pan: {
                            enabled: true,
                            mode: "x",
                        },
                    },
                },
            },
        });
    }

    function resetZoom() {
        if (rulkovChart) {
            rulkovChart.resetZoom();
        }
    }

    function downloadTable() {
        const blob = new Blob([fullOutput], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "rulkov_simulation_results.txt";
        link.click();
    }

    simulateButton.addEventListener("click", simulateRulkovModel);
    resetZoomButton.addEventListener("click", resetZoom);
    downloadButton.addEventListener("click", downloadTable);
});
