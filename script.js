/*====================================================
    BudgetFlow Pro
    Module 1 - Core Engine
====================================================*/

// ===============================
// DOM Helpers
// ===============================

const $ = (id) => document.getElementById(id);

const app = {

    budgetChart: null,
    cashChart: null,

    storageKey: "budgetflow-pro"

};

// ===============================
// Currency Formatter
// ===============================

const currency = new Intl.NumberFormat("en-PH", {

    style: "currency",

    currency: "PHP",

    minimumFractionDigits: 2

});

function formatMoney(value) {

    value = Number(value) || 0;

    return currency.format(value);

}

// ===============================
// Number Helper
// ===============================

function getValue(id) {

    return Number($(id).value) || 0;

}

// ===============================
// Save Data
// ===============================

function saveData() {

    const data = {

        income: getValue("income"),

        fixed: getValue("fixed"),

        variable: getValue("variable"),

        goal: getValue("goal"),

        opening: getValue("opening"),

        cashIn: getValue("cashIn"),

        cashOut: getValue("cashOut"),

        darkMode: document.body.classList.contains("light")

    };

    localStorage.setItem(

        app.storageKey,

        JSON.stringify(data)

    );

}

// ===============================
// Load Data
// ===============================

function loadData() {

    const saved = localStorage.getItem(app.storageKey);

    if (!saved) return;

    const data = JSON.parse(saved);

    if ($("income")) $("income").value = data.income || "";

    if ($("fixed")) $("fixed").value = data.fixed || "";

    if ($("variable")) $("variable").value = data.variable || "";

    if ($("goal")) $("goal").value = data.goal || "";

    if ($("opening")) $("opening").value = data.opening || "";

    if ($("cashIn")) $("cashIn").value = data.cashIn || "";

    if ($("cashOut")) $("cashOut").value = data.cashOut || "";

    if (data.darkMode) {

        document.body.classList.add("light");

    }

}

// ===============================
// Reset
// ===============================

function resetCalculator() {

    if (!confirm("Reset all values?")) return;

    document.querySelectorAll("input").forEach(input => {

        input.value = "";

    });

    localStorage.removeItem(app.storageKey);

    location.reload();

}

// ===============================
// Theme Toggle
// ===============================

function toggleTheme() {

    document.body.classList.toggle("light");

    saveData();

}

// ===============================
// Print
// ===============================

function printReport() {

    window.print();

}

// ===============================
// CSV Export
// ===============================

function exportCSV() {

    const rows = [

        ["Field", "Value"],

        ["Monthly Income", getValue("income")],

        ["Fixed Expenses", getValue("fixed")],

        ["Variable Expenses", getValue("variable")],

        ["Savings Goal", getValue("goal")],

        ["Opening Balance", getValue("opening")],

        ["Cash In", getValue("cashIn")],

        ["Cash Out", getValue("cashOut")]

    ];

    const csv = rows

        .map(row => row.join(","))

        .join("\n");

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "BudgetFlow.csv";

    link.click();

    URL.revokeObjectURL(url);

}

// ===============================
// Auto Save
// ===============================

function autoSave() {

    document.querySelectorAll("input").forEach(input => {

        input.addEventListener("input", saveData);

    });

}

// ===============================
// Event Listeners
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadData();

    autoSave();

    $("themeBtn").addEventListener(

        "click",

        toggleTheme

    );

    $("resetBtn").addEventListener(

        "click",

        resetCalculator

    );

    $("printBtn").addEventListener(

        "click",

        printReport

    );

    $("csvBtn").addEventListener(

        "click",

        exportCSV

    );

});
/*====================================================
    BudgetFlow Pro
    Module 2 - Budget Calculator
====================================================*/

// ====================================
// Budget Calculator
// ====================================

function calculateBudget() {

    const income = getValue("income");
    const fixed = getValue("fixed");
    const variable = getValue("variable");
    const goal = getValue("goal");

    const expenses = fixed + variable;
    const remaining = income - expenses;

    const dailyBudget = remaining / 30;
    const weeklyBudget = remaining / 4;
    const monthlyBudget = remaining;
    const yearlyBudget = remaining * 12;

    const savingsRate =
        income > 0
            ? (remaining / income) * 100
            : 0;

    //----------------------------------
    // Dashboard
    //----------------------------------

    $("incomeDisplay").textContent =
        formatMoney(income);

    $("expenseDisplay").textContent =
        formatMoney(expenses);

    $("balanceDisplay").textContent =
        formatMoney(remaining);

    $("savingRate").textContent =
        savingsRate.toFixed(1) + "%";

    $("dailyBudget").textContent =
        formatMoney(dailyBudget);

    //----------------------------------
    // Budget Health
    //----------------------------------

    let health = "";
    let color = "";

    if (savingsRate >= 40) {

        health = "🟢 Excellent";
        color = "#22c55e";

    } else if (savingsRate >= 25) {

        health = "🟡 Good";
        color = "#f59e0b";

    } else if (savingsRate >= 10) {

        health = "🟠 Warning";
        color = "#fb923c";

    } else {

        health = "🔴 Critical";
        color = "#ef4444";

    }

    $("health").textContent = health;
    $("health").style.color = color;

    //----------------------------------
    // Financial Analysis
    //----------------------------------

    const analysis = [];

    analysis.push(
        `<li><strong>Monthly Income:</strong> ${formatMoney(income)}</li>`
    );

    analysis.push(
        `<li><strong>Total Expenses:</strong> ${formatMoney(expenses)}</li>`
    );

    analysis.push(
        `<li><strong>Remaining Budget:</strong> ${formatMoney(remaining)}</li>`
    );

    analysis.push(
        `<li><strong>Daily Budget:</strong> ${formatMoney(dailyBudget)}</li>`
    );

    analysis.push(
        `<li><strong>Weekly Budget:</strong> ${formatMoney(weeklyBudget)}</li>`
    );

    analysis.push(
        `<li><strong>Monthly Savings:</strong> ${formatMoney(monthlyBudget)}</li>`
    );

    analysis.push(
        `<li><strong>Projected Yearly Savings:</strong> ${formatMoney(yearlyBudget)}</li>`
    );

    analysis.push(
        `<li><strong>Savings Goal:</strong> ${formatMoney(goal)}</li>`
    );

    //----------------------------------
    // Smart Suggestions
    //----------------------------------

    if (remaining < 0) {

        analysis.push(
            `<li style="color:#ef4444;">
            ❌ You're spending more than your income.
            </li>`
        );

    } else {

        analysis.push(
            `<li style="color:#22c55e;">
            ✅ Your budget is positive.
            </li>`
        );

    }

    if (goal > remaining) {

        analysis.push(
            `<li style="color:#f59e0b;">
            ⚠ Savings goal is higher than your remaining budget.
            </li>`
        );

    } else {

        analysis.push(
            `<li style="color:#22c55e;">
            ✔ Savings goal is achievable.
            </li>`
        );

    }

    if (expenses > income * 0.80) {

        analysis.push(
            `<li style="color:#ef4444;">
            ⚠ Expenses exceed 80% of your income.
            </li>`
        );

    } else {

        analysis.push(
            `<li style="color:#22c55e;">
            ✔ Expense ratio is healthy.
            </li>`
        );

    }

    $("analysis").innerHTML = analysis.join("");

    //----------------------------------
    // Save Data
    //----------------------------------

    saveData();

}

// ====================================
// Budget Button
// ====================================

$("calculateBudget").addEventListener(

    "click",

    calculateBudget

);

// ====================================
// Live Calculation
// ====================================

[
    "income",
    "fixed",
    "variable",
    "goal"
].forEach(id => {

    $(id).addEventListener(

        "input",

        calculateBudget

    );

});

// ====================================
// Auto Calculate on Load
// ====================================

window.addEventListener(

    "load",

    calculateBudget

);
/*====================================================
    BudgetFlow Pro
    Module 3 - Cash Flow Calculator
====================================================*/

// ====================================
// Cash Flow Calculator
// ====================================

function calculateCashFlow() {

    const opening = getValue("opening");
    const cashIn = getValue("cashIn");
    const cashOut = getValue("cashOut");

    //----------------------------------
    // Calculations
    //----------------------------------

    const netCashFlow = cashIn - cashOut;
    const endingBalance = opening + netCashFlow;

    //----------------------------------
    // Update Dashboard
    //----------------------------------

    $("cashFlow").textContent =
        formatMoney(netCashFlow);

    $("endingBalance").textContent =
        formatMoney(endingBalance);

    //----------------------------------
    // Color Indicators
    //----------------------------------

    const cashFlowCard = $("cashFlow");
    const endingCard = $("endingBalance");

    if (netCashFlow >= 0) {

        cashFlowCard.style.color = "#22c55e";

    } else {

        cashFlowCard.style.color = "#ef4444";

    }

    if (endingBalance >= 0) {

        endingCard.style.color = "#22c55e";

    } else {

        endingCard.style.color = "#ef4444";

    }

    //----------------------------------
    // Cash Flow Status
    //----------------------------------

    let status = "";
    let recommendation = "";

    if (netCashFlow > 0) {

        status = "Positive Cash Flow";

        recommendation =
            "✅ You're generating more cash than you're spending.";

    }

    else if (netCashFlow === 0) {

        status = "Break Even";

        recommendation =
            "⚠ Your cash flow is balanced. Consider increasing savings.";

    }

    else {

        status = "Negative Cash Flow";

        recommendation =
            "❌ You're spending more cash than you're bringing in.";

    }

    //----------------------------------
    // Append Analysis
    //----------------------------------

    const analysis = $("analysis");

    analysis.innerHTML += `

        <hr>

        <li><strong>Opening Balance:</strong>
        ${formatMoney(opening)}</li>

        <li><strong>Cash In:</strong>
        ${formatMoney(cashIn)}</li>

        <li><strong>Cash Out:</strong>
        ${formatMoney(cashOut)}</li>

        <li><strong>Net Cash Flow:</strong>
        ${formatMoney(netCashFlow)}</li>

        <li><strong>Ending Balance:</strong>
        ${formatMoney(endingBalance)}</li>

        <li><strong>Status:</strong>
        ${status}</li>

        <li>${recommendation}</li>

    `;

    //----------------------------------
    // Save
    //----------------------------------

    saveData();

}

// ====================================
// Calculate Button
// ====================================

$("calculateCash").addEventListener(

    "click",

    calculateCashFlow

);

// ====================================
// Live Cash Flow
// ====================================

[
    "opening",
    "cashIn",
    "cashOut"

].forEach(id => {

    $(id).addEventListener(

        "input",

        calculateCashFlow

    );

});

// ====================================
// Auto Run
// ====================================

window.addEventListener(

    "load",

    calculateCashFlow

);
/*====================================================
    BudgetFlow Pro
    Module 4 - Interactive Charts
====================================================*/

// =====================================
// Chart Colors
// =====================================

const chartColors = {

    income: "#3B82F6",
    expense: "#EF4444",
    remaining: "#22C55E",
    cashIn: "#06B6D4",
    cashOut: "#F97316"

};

// =====================================
// Budget Doughnut Chart
// =====================================

function renderBudgetChart() {

    const fixed = getValue("fixed");
    const variable = getValue("variable");
    const income = getValue("income");

    const expenses = fixed + variable;
    const remaining = Math.max(0, income - expenses);

    const ctx = $("budgetChart").getContext("2d");

    if (app.budgetChart) {

        app.budgetChart.destroy();

    }

    app.budgetChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Fixed",

                "Variable",

                "Remaining"

            ],

            datasets: [{

                data: [

                    fixed,

                    variable,

                    remaining

                ],

                backgroundColor: [

                    chartColors.expense,

                    chartColors.cashOut,

                    chartColors.remaining

                ],

                borderWidth: 0,

                hoverOffset: 12

            }]

        },

        options: {

            responsive: true,

            cutout: "70%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: "#ffffff",

                        padding: 20,

                        font: {

                            size: 14

                        }

                    }

                }

            }

        }

    });

}

// =====================================
// Cash Flow Bar Chart
// =====================================

function renderCashChart() {

    const cashIn = getValue("cashIn");
    const cashOut = getValue("cashOut");

    const ctx = $("cashChart").getContext("2d");

    if (app.cashChart) {

        app.cashChart.destroy();

    }

    app.cashChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [

                "Cash In",

                "Cash Out"

            ],

            datasets: [{

                label: "Amount",

                data: [

                    cashIn,

                    cashOut

                ],

                backgroundColor: [

                    chartColors.cashIn,

                    chartColors.expense

                ],

                borderRadius: 10

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        display: false

                    }

                },

                y: {

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "rgba(255,255,255,.08)"

                    }

                }

            }

        }

    });

}

// =====================================
// Refresh All Charts
// =====================================

function refreshCharts() {

    renderBudgetChart();

    renderCashChart();

}

// =====================================
// Update Charts Live
// =====================================

[
    "income",
    "fixed",
    "variable",
    "cashIn",
    "cashOut"

].forEach(id => {

    $(id).addEventListener("input", refreshCharts);

});

// =====================================
// Update Charts
// after calculations
// =====================================

const originalBudget = calculateBudget;

calculateBudget = function () {

    originalBudget();

    refreshCharts();

};

const originalCash = calculateCashFlow;

calculateCashFlow = function () {

    originalCash();

    refreshCharts();

};

// =====================================
// First Load
// =====================================

window.addEventListener("load", () => {

    refreshCharts();

});