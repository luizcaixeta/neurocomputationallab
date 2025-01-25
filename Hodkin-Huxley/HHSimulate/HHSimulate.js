document.addEventListener("DOMContentLoaded", () => {
    const simulateButton = document.getElementById("simulate");
    const resetZoomButton = document.getElementById("resetZoom");
    const downloadButton = document.getElementById("downloadTable");

    let charts = {};
    let fullOutput = ""; // Armazena a tabela completa

    function simulateHHModel() {
        const Cm = parseFloat(document.getElementById("alpha").value) ; // Ajuste para µF/cm²
        const IExt = parseFloat(document.getElementById("IExt").value) ; // Ajuste para µA/cm²
        const GNa = parseFloat(document.getElementById("GNa").value) ; // mS/cm²
        const GK = parseFloat(document.getElementById("GK").value) ; // mS/cm²
        const GL = parseFloat(document.getElementById("GL").value) ; // mS/cm²
        const ENa = parseFloat(document.getElementById("ENa").value) ; // Ajuste para V
        const EK = parseFloat(document.getElementById("EK").value) ; // Ajuste para V
        const EL = parseFloat(document.getElementById("EL").value) ; // Ajuste para V
        const V0 = parseFloat(document.getElementById("V_0").value) ;
        const steps = parseInt(document.getElementById("i").value);

        let V = [V0];
        let m = [0.05];
        let n = [0.32];
        let time = [0];
        const dt = 0.01;

        for (let i = 1; i < steps; i++) {
            const dm = (0.1 * (1 - m[i - 1]) - 0.05 * m[i - 1]) * dt;
            const dn = (0.01 * (1 - n[i - 1]) - 0.1 * n[i - 1]) * dt;

            m.push(m[i - 1] + dm);
            n.push(n[i - 1] + dn);

            const INa_t = GNa * Math.pow(m[i], 3) * (V[i - 1] - ENa);
            const IK_t = GK * Math.pow(n[i], 4) * (V[i - 1] - EK);
            const IL_t = GL * (V[i - 1] - EL);

            const dV = (-1 / Cm) * (INa_t + IK_t + IL_t - IExt) * dt;
            V.push(V[i - 1] + dV);

            time.push(i * dt);
        }

        const outputElement = document.getElementById("output");
        let output = "n\ttime\tV\tm\tn\n";
        fullOutput = output; // Cabeçalho da tabela completa

        for (let i = 0; i < time.length; i++) {
            const row = `${i}\t${time[i].toFixed(2)}\t${V[i].toFixed(2)}\t${m[i].toFixed(2)}\t${n[i].toFixed(2)}\n`;
            fullOutput += row;

            // Limita a tabela exibida até o passo n = 50
            if (i <= 25) {
                output += row;
            }
        }

        outputElement.textContent = output;

        // Mostrar o botão de download após a simulação
        downloadButton.style.display = "inline-block";

        charts["HHChart"] = updateChart("HHChart", time, V, "V (Potential)", "black");
        charts["MChart"] = updateChart("MChart", time, m, "m (Activation Variable)", "black");
        charts["NChart"] = updateChart("NChart", time, n, "n (Activation Variable)", "black");
    }

    function updateChart(canvasId, xData, yData, label, color) {
        const ctx = document.getElementById(canvasId).getContext("2d");
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: xData,
                datasets: [
                    {
                        label: label,
                        data: yData,
                        borderColor: color,
                        borderWidth: 1,
                        pointRadius: 0,
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
        Object.values(charts).forEach((chart) => chart.resetZoom());
    }

    function downloadTable() {
        const blob = new Blob([fullOutput], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "HH_simulation_results.txt";
        link.click();
    }

    simulateButton.addEventListener("click", simulateHHModel);
    resetZoomButton.addEventListener("click", resetZoom);
    downloadButton.addEventListener("click", downloadTable);
});
