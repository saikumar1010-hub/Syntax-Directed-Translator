function runCompiler() {
  let expr = document.getElementById("input").value.trim();

  if (expr === "") {
    alert("Please enter an expression");
    return;
  }

  lexicalAnalysis(expr);
  syntaxAnalysis(expr);
  generateTree(expr);
  attributeEvaluation(expr);
  generateSymbolTable(expr);
  semanticAnalysis(expr);
  generateTAC(expr);
  optimizeCode(expr);
}

// Module 1: Lexical Analysis
function lexicalAnalysis(expr) {
  let regex = /if|while|for|==|!=|<=|>=|&&|\|\||[a-zA-Z_][a-zA-Z0-9_]*|\d+|[=+\-*/()<>]/g;
  let tokens = expr.match(regex);

  let result = "";

  if (!tokens) {
    document.getElementById("tokens").innerText = "No tokens found";
    return;
  }

  tokens.forEach(token => {
    if (token === "if" || token === "while" || token === "for") {
      result += token + " -> Keyword\n";
    } else if (/^[a-zA-Z_]/.test(token)) {
      result += token + " -> Identifier\n";
    } else if (/^\d+$/.test(token)) {
      result += token + " -> Constant\n";
    } else {
      result += token + " -> Operator / Symbol\n";
    }
  });

  document.getElementById("tokens").innerText = result;
}

// Module 1: Syntax Analysis with Error Detection
function syntaxAnalysis(expr) {
  let result = "";

  if (expr.startsWith("if")) {
    if (!expr.includes("(") || !expr.includes(")")) {
      result = "Syntax Error: Missing brackets in if condition";
    } else {
      result = "Control Expression Detected\nGrammar: if(condition)\nSyntax Status: Accepted";
    }
  }

  else if (expr.startsWith("while")) {
    if (!expr.includes("(") || !expr.includes(")")) {
      result = "Syntax Error: Missing brackets in while condition";
    } else {
      result = "Loop Expression Detected\nGrammar: while(condition)\nSyntax Status: Accepted";
    }
  }

  else if (expr.includes("=")) {
    let parts = expr.split("=");

    if (parts[0].trim() === "" || parts[1].trim() === "") {
      result = "Syntax Error: Invalid assignment expression";
    } else if (/^[+\-*/]/.test(parts[1].trim())) {
      result = "Syntax Error: Expression cannot start with operator";
    } else if (/[+\-*/]$/.test(parts[1].trim())) {
      result = "Syntax Error: Expression cannot end with operator";
    } else {
      result = "Assignment Expression Detected\nGrammar: id = expression\nSyntax Status: Accepted";
    }
  }

  else {
    result = "Arithmetic Expression Detected\nSyntax Status: Accepted";
  }

  document.getElementById("syntax").innerText = result;
}

// New Feature: Parse Tree
function generateTree(expr) {
  let tree = "";

  if (expr.startsWith("if")) {
    let condition = expr.match(/\((.*?)\)/);
    condition = condition ? condition[1] : "condition";

    tree =
`        IF
       /  \\
 condition  statement
    |
  ${condition}`;
  }

  else if (expr.startsWith("while")) {
    let condition = expr.match(/\((.*?)\)/);
    condition = condition ? condition[1] : "condition";

    tree =
`       WHILE
       /   \\
 condition  body
    |
  ${condition}`;
  }

  else if (expr.includes("=")) {
    let parts = expr.split("=");
    let left = parts[0].trim();
    let right = parts[1].trim();

    tree =
`        =
      /   \\
    ${left}    expression
          |
       ${right}`;
  }

  document.getElementById("tree").innerText = tree;
}

// Module 2: Attribute Evaluation
function attributeEvaluation(expr) {
  let result = "";

  result += "Synthesized Attribute: value/type generated from child nodes\n";
  result += "Inherited Attribute: context passed from parent node\n\n";

  if (expr.includes("+")) result += "+ : Addition operation\n";
  if (expr.includes("-")) result += "- : Subtraction operation\n";
  if (expr.includes("*")) result += "* : Multiplication operation\n";
  if (expr.includes("/")) result += "/ : Division operation\n";
  if (expr.includes(">")) result += "> : Greater than comparison\n";
  if (expr.includes("<")) result += "< : Less than comparison\n";
  if (expr.includes("&&")) result += "&& : Logical AND condition\n";
  if (expr.includes("||")) result += "|| : Logical OR condition\n";

  document.getElementById("attributes").innerText = result;
}

// New Feature: Symbol Table
function generateSymbolTable(expr) {
  let regex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
  let words = expr.match(regex);
  let table = document.getElementById("symbolTable");

  table.innerHTML = "";

  if (!words) return;

  let unique = [];

  words.forEach(word => {
    if (word !== "if" && word !== "while" && word !== "for" && !unique.includes(word)) {
      unique.push(word);
    }
  });

  unique.forEach(variable => {
    table.innerHTML += `
      <tr>
        <td>${variable}</td>
        <td>Identifier</td>
        <td>Local</td>
      </tr>
    `;
  });
}

// Module 3: Semantic Analysis
function semanticAnalysis(expr) {
  let result = "";

  if (/^\d+\s*=/.test(expr)) {
    result = "Semantic Error: Constant cannot be assigned a value";
  } else {
    result += "Type Checking: Passed\n";
    result += "Variable Usage: Valid\n";
    result += "Semantic Status: Accepted";
  }

  document.getElementById("semantic").innerText = result;
}

// Module 3: Three Address Code
function generateTAC(expr) {
  let tac = "";

  if (expr.startsWith("if")) {
    let condition = expr.match(/\((.*?)\)/)[1];

    if (condition.includes("&&")) {
      let parts = condition.split("&&");

      tac += "t1 = " + parts[0].trim() + "\n";
      tac += "t2 = " + parts[1].trim() + "\n";
      tac += "t3 = t1 && t2\n";
      tac += "if t3 goto L1\n";
      tac += "goto L2\n\n";
      tac += "L1:\nStatement Executes\n\n";
      tac += "L2:\nEnd";
    }

    else if (condition.includes("||")) {
      let parts = condition.split("||");

      tac += "t1 = " + parts[0].trim() + "\n";
      tac += "t2 = " + parts[1].trim() + "\n";
      tac += "t3 = t1 || t2\n";
      tac += "if t3 goto L1\n";
      tac += "goto L2\n\n";
      tac += "L1:\nStatement Executes\n\n";
      tac += "L2:\nEnd";
    }

    else {
      tac += "t1 = " + condition + "\n";
      tac += "if t1 goto L1\n";
      tac += "goto L2\n\n";
      tac += "L1:\nStatement Executes\n\n";
      tac += "L2:\nEnd";
    }
  }

  else if (expr.startsWith("while")) {
    let condition = expr.match(/\((.*?)\)/)[1];

    tac += "L1:\n";
    tac += "t1 = " + condition + "\n";
    tac += "if t1 goto L2\n";
    tac += "goto L3\n\n";
    tac += "L2:\nLoop Body\n";
    tac += "goto L1\n\n";
    tac += "L3:\nEnd";
  }

  else if (expr.includes("=")) {
    let parts = expr.split("=");
    let left = parts[0].trim();
    let right = parts[1].trim();
    let tokens = right.split(" ");

    if (tokens.length === 5) {
      tac += "t1 = " + tokens[0] + " " + tokens[1] + " " + tokens[2] + "\n";
      tac += "t2 = t1 " + tokens[3] + " " + tokens[4] + "\n";
      tac += left + " = t2";
    }

    else if (tokens.length === 3) {
      tac += "t1 = " + tokens[0] + " " + tokens[1] + " " + tokens[2] + "\n";
      tac += left + " = t1";
    }

    else {
      tac += left + " = " + right;
    }
  }

  document.getElementById("tac").innerText = tac;
}

// New Feature: Optimization
function optimizeCode(expr) {
  let result = "";

  if (expr.includes("+") || expr.includes("*") || expr.includes("-") || expr.includes("/")) {
    result += "Optimization Technique: Temporary variable usage\n";
    result += "Repeated computation is reduced using intermediate results.\n";
    result += "Optimized Code: Same TAC reused through temporary variables.";
  } else if (expr.startsWith("if") || expr.startsWith("while")) {
    result += "Optimization Technique: Control flow optimization\n";
    result += "Labels and conditional jumps reduce unnecessary execution.";
  } else {
    result += "No major optimization required.";
  }

  document.getElementById("optimization").innerText = result;
}

// Clear button
function clearAll() {
  document.getElementById("input").value = "";
  document.getElementById("tokens").innerText = "";
  document.getElementById("syntax").innerText = "";
  document.getElementById("tree").innerText = "";
  document.getElementById("attributes").innerText = "";
  document.getElementById("symbolTable").innerHTML = "";
  document.getElementById("semantic").innerText = "";
  document.getElementById("tac").innerText = "";
  document.getElementById("optimization").innerText = "";
}