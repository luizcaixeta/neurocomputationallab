document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("KTzChart").getContext("2d");

    let KTzChart;
    let fullOutput = ""; // Armazena a tabela completa

    document.getElementById("resetZoom").addEventListener("click", function () {
        if (KTzChart) {
            KTzChart.resetZoom();
        }
    });

    function logisticFunction(u) {
        return 1 / (1 + Math.exp(-u));
    }

    document.getElementById("simulate").addEventListener("click", function () {
        const K = parseFloat(document.getElementById("K").value);
        const H = parseFloat(document.getElementById("H").value);
        const delta = parseFloat(document.getElementById("delta").value);
        const lambda = parseFloat(document.getElementById("lambda").value);
        const xR = parseFloat(document.getElementById("xR").value);
        const T = parseFloat(document.getElementById("T").value);
        const iterations = parseFloat(document.getElementById("iterations").value);
        const iterationsTransient = parseFloat(document.getElementById("iterationsTransient").value);

        let xn = parseFloat(document.getElementById("x0").value);
        let yn = parseFloat(document.getElementById("y0").value);
        let zn = parseFloat(document.getElementById("z0").value);

        if (
            isNaN(K) ||
            isNaN(H) ||
            isNaN(delta) ||
            isNaN(lambda) ||
            isNaN(xR) ||
            isNaN(xn) ||
            isNaN(yn) ||
            isNaN(zn)
        ) {
            alert("Por favor, insira valores numéricos válidos.");
            return;
        }

        let output = "n\tx\ty\tz\n";
        fullOutput = output; // Cabeçalho da tabela completa
        const steps = [];
        const xValues = [];

        for (let n = 0; n < iterations; n++) {
            const u = (xn - K * yn + zn + H) / T;
            const xn1 = logisticFunction(u);
            const yn1 = xn;
            const zn1 = (1 - delta) * zn - lambda * (xn - xR);

            const row = `${n}\t${xn1.toFixed(4)}\t${yn1.toFixed(4)}\t${zn1.toFixed(4)}\n`;
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
            zn = zn1;
        }

        document.getElementById("output").textContent = output;

        // Exibe o botão de download após a simulação
        const downloadButton = document.getElementById("downloadTable");
        downloadButton.style.display = "inline-block";

        // Atualiza o gráfico
        if (KTzChart) {
            KTzChart.destroy();
        }

        KTzChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: steps,
                datasets: [
                    {
                        label: "x vs Steps",
                        data: xValues,
                        borderColor: "#000",
                        borderWidth: 1.5,
                        fill: false,
                        pointRadius: 0,
                        tension: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.5,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Steps",
                            font: {
                                size: 14,
                            },
                        },
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "x",
                            font: {
                                size: 14,
                            },
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: "x",
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: "x",
                        },
                    },
                },
            },
        });
    });

    document.getElementById("downloadTable").addEventListener("click", function () {
        const blob = new Blob([fullOutput], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "KTz_simulation_results.txt";
        link.click();
    });
});
