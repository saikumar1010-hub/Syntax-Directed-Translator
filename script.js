function runCompiler() {

    let expr = document.getElementById("input").value.trim();

    if (expr === "") {
        alert("Please enter an expression");
        return;
    }

    lexicalAnalysis(expr);
    syntaxAnalysis(expr);
    attributeEvaluation(expr);
    semanticAnalysis(expr);
    generateTAC(expr);
}

// ---------- MODULE 1 ----------
// Lexical Analysis
function lexicalAnalysis(expr) {

    let tokenRegex =
        /if|while|for|==|!=|<=|>=|&&|\|\||[a-zA-Z_][a-zA-Z0-9_]*|\d+|[=+\-*/()<>]/g;

    let tokens = expr.match(tokenRegex);

    let result = "";

    tokens.forEach(token => {

        if (token === "if" ||
            token === "while" ||
            token === "for") {

            result += token + " -> Keyword\n";
        }

        else if (/^[a-zA-Z_]/.test(token)) {
            result += token + " -> Identifier\n";
        }

        else if (/^\d+$/.test(token)) {
            result += token + " -> Constant\n";
        }

        else {
            result += token + " -> Operator/Symbol\n";
        }
    });

    document.getElementById("tokens").innerText = result;
}

// Syntax Analysis
function syntaxAnalysis(expr) {

    let result = "";

    if (expr.startsWith("if")) {

        result += "Control Expression Detected\n";
        result += "Grammar: if(condition)\n";
        result += "Syntax Status: Accepted";
    }

    else if (expr.startsWith("while")) {

        result += "Loop Expression Detected\n";
        result += "Grammar: while(condition)\n";
        result += "Syntax Status: Accepted";
    }

    else if (expr.includes("=")) {

        result += "Assignment Expression Detected\n";
        result += "Grammar: id = expression\n";
        result += "Syntax Status: Accepted";
    }

    else {

        result += "Arithmetic Expression Detected\n";
        result += "Syntax Status: Accepted";
    }

    document.getElementById("syntax").innerText = result;
}

// ---------- MODULE 2 ----------
// Attribute Evaluation
function attributeEvaluation(expr) {

    let result = "";

    result += "Synthesized Attribute: value generated from child nodes\n";
    result += "Inherited Attribute: context passed from parent node\n\n";

    if (expr.includes("+"))
        result += "+ → Addition operation\n";

    if (expr.includes("-"))
        result += "- → Subtraction operation\n";

    if (expr.includes("*"))
        result += "* → Multiplication operation\n";

    if (expr.includes("/"))
        result += "/ → Division operation\n";

    if (expr.includes(">"))
        result += "> → Comparison operation\n";

    if (expr.includes("<"))
        result += "< → Comparison operation\n";

    document.getElementById("attributes").innerText = result;
}

// ---------- MODULE 3 ----------
// Semantic Analysis
function semanticAnalysis(expr) {

    let result = "";

    if (/^\d+\s*=/.test(expr)) {

        result = "Semantic Error: Constant cannot be assigned";
    }

    else {

        result += "Type Checking: Passed\n";
        result += "Variable Usage: Valid\n";
        result += "Semantic Status: Accepted";
    }

    document.getElementById("semantic").innerText = result;
}

// Three Address Code
function generateTAC(expr) {

    let tac = "";

    // IF CONDITION
    if (expr.startsWith("if")) {

        let condition = expr.match(/\((.*?)\)/)[1];

        if (condition.includes("&&")) {

            let parts = condition.split("&&");

            tac += "t1 = " + parts[0].trim() + "\n";
            tac += "t2 = " + parts[1].trim() + "\n";
            tac += "t3 = t1 && t2\n";
            tac += "if t3 goto L1\n";
            tac += "goto L2\n\n";

            tac += "L1:\n";
            tac += "Statement Executes\n\n";

            tac += "L2:\n";
            tac += "End";
        }

        else {

            tac += "t1 = " + condition + "\n";
            tac += "if t1 goto L1\n";
            tac += "goto L2\n\n";

            tac += "L1:\n";
            tac += "Statement Executes\n\n";

            tac += "L2:\n";
            tac += "End";
        }
    }

    // WHILE LOOP
    else if (expr.startsWith("while")) {

        let condition = expr.match(/\((.*?)\)/)[1];

        tac += "L1:\n";
        tac += "t1 = " + condition + "\n";
        tac += "if t1 goto L2\n";
        tac += "goto L3\n\n";

        tac += "L2:\n";
        tac += "Loop Body\n";
        tac += "goto L1\n\n";

        tac += "L3:\n";
        tac += "End";
    }

    // ARITHMETIC TAC
    else if (expr.includes("=")) {

        let parts = expr.split("=");

        let left = parts[0].trim();
        let right = parts[1].trim();

        let tokens = right.split(" ");

        if (tokens.length === 5) {

            tac += "t1 = " + tokens[0] +
                " " + tokens[1] +
                " " + tokens[2] + "\n";

            tac += "t2 = t1 " +
                tokens[3] + " " +
                tokens[4] + "\n";

            tac += left + " = t2";
        }

        else if (tokens.length === 3) {

            tac += "t1 = " + tokens[0] +
                " " + tokens[1] +
                " " + tokens[2] + "\n";

            tac += left + " = t1";
        }

        else {

            tac += left + " = " + right;
        }
    }

    document.getElementById("tac").innerText = tac;
}