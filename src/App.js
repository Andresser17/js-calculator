import "./App.css";
import { Component } from "react";
import { Parser } from "expr-eval";

const NUMBERS = [
  {
    id: "one",
    symbol: "1",
  },
  {
    id: "two",
    symbol: "2",
  },
  {
    id: "three",
    symbol: "3",
  },
  {
    id: "four",
    symbol: "4",
  },
  {
    id: "five",
    symbol: "5",
  },
  {
    id: "six",
    symbol: "6",
  },
  {
    id: "seven",
    symbol: "7",
  },
  {
    id: "eight",
    symbol: "8",
  },
  {
    id: "nine",
    symbol: "9",
  },
  {
    id: "zero",
    symbol: "0",
  },
  {
    id: "decimal",
    symbol: ".",
  },
];
const OPERATORS = [
  {
    id: "add",
    symbol: "+",
  },
  {
    id: "subtract",
    symbol: "-",
  },
  {
    id: "multiply",
    symbol: "x",
  },
  {
    id: "divide",
    symbol: "/",
  },
];

const OPTIONS = [
  {
    id: "clear",
    symbol: "C",
  },
  {
    id: "equals",
    symbol: "=",
  },
];

class CalcButton extends Component {
  constructor(props) {
    super(props);
    this.onActionClick = this.onActionClick.bind(this);
  }

  onActionClick(e, value) {
    this.props.funct(value);
  }

  render() {
    const buttons = this.props.buttons.slice().map((item, index) => {
      const id = item.id;
      const symbol = item.symbol;
      const funct = (e) => this.onActionClick(e, symbol);

      return (
        <button onClick={funct} className="actionButton" id={id} key={index}>
          {symbol}
        </button>
      );
    });
    return buttons;
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numbers: NUMBERS,
      operators: OPERATORS,
      options: OPTIONS,
      delete: [{ id: "delete", symbol: "<" }],
      total: 0,
      actualCalc: "0",
      historial: [],
      completedCalc: false,
      decimal: false,
    };
    this.showCalc = this.showCalc.bind(this);
    this.calc = this.calc.bind(this);
    this.delete = this.delete.bind(this);
  }

  showCalc(symbol) {
    const actualCalc = this.state.actualCalc;
    const completedCalc = this.state.completedCalc;

    if (actualCalc === "0") {
      if (
        symbol === "." ||
        symbol === "+" ||
        symbol === "-" ||
        symbol === "x" ||
        symbol === "/"
      ) {
        return;
      }

      this.setState({
        actualCalc: symbol,
      });
    } else if (
      (symbol === "+" && completedCalc) ||
      (symbol === "-" && completedCalc) ||
      (symbol === "x" && completedCalc) ||
      (symbol === "/" && completedCalc)
    ) {
      this.setState((state) => ({
        actualCalc: String(state.actualCalc + String(symbol)),
        completedCalc: false,
        decimal: false,
      }));
    } else if (completedCalc) {
      this.setState({
        actualCalc: symbol,
        completedCalc: false,
      });
    } else if (symbol === ".") {
      if (this.state.decimal) {
        return;
      }

      this.setState((state) => ({
        actualCalc: String(state.actualCalc + String(symbol)),
        decimal: true,
      }));
    } else {
      if (
        symbol === "+" ||
        symbol === "-" ||
        symbol === "x" ||
        symbol === "/"
      ) {
        this.setState((state) => ({
          decimal: false,
        }));
      }

      const lastChar = actualCalc[actualCalc.length - 1];
      const lastCharEval =
        (lastChar === "+" || lastChar === "x" || lastChar === "/") &&
        (symbol === "+" || symbol === "x" || symbol === "/");

      if (lastCharEval) {
        this.setState((state) => ({
          actualCalc: String(state.actualCalc.slice(0, -1) + String(symbol)),
        }));
        return;
      }

      const penChar = actualCalc[actualCalc.length - 2];
      if (lastChar === "-" && symbol === "-") {
        return;
      } else if (
        lastChar === "-" &&
        (penChar === "+" || penChar === "x" || penChar === "/") &&
        (symbol === "+" || symbol === "x" || symbol === "/")
      ) {
        this.setState((state) => ({
          actualCalc: String(state.actualCalc.slice(0, -2) + String(symbol)),
        }));
        return;
      } else if (
        lastChar === "-" &&
        (symbol === "+" || symbol === "x" || symbol === "/")
      ) {
        this.setState((state) => ({
          actualCalc: String(state.actualCalc.slice(0, -1) + String(symbol)),
        }));
        return;
      }

      this.setState((state) => ({
        actualCalc: String(state.actualCalc + String(symbol)),
      }));
    }
  }

  calcHelper(op) {
    const calc = op.replace("x", "*");
    let parser = new Parser();
    let expr = parser.parse(calc);
    return expr.evaluate();
  }

  calc(symbol) {
    const actualCalc = this.state.actualCalc.slice();

    if (symbol === "=") {
      const calc = this.calcHelper(actualCalc);

      this.setState((state) => ({
        historial: [...state.historial, actualCalc],
        actualCalc: String(calc),
        completedCalc: true,
        decimal: false,
      }));
    } else {
      this.setState((state) => ({
        historial: [],
        actualCalc: "0",
        completedCalc: false,
        decimal: false,
        lastInputCharacter: "",
      }));
    }
  }

  delete() {
    this.setState((state) => ({
      actualCalc: state.actualCalc.slice(0, -1),
    }));
  }

  render() {
    const historial = this.state.historial.map((item, index) => {
      return <li key={index}>{item}</li>;
    });
    const actualCalc = this.state.actualCalc;

    return (
      <div className="App">
        <div id="calc-container">
          <ul id="historial">{historial}</ul>
          <span id="display">{actualCalc}</span>
        </div>
        <div id="calc">
          <CalcButton funct={this.showCalc} buttons={this.state.numbers} />
          <CalcButton funct={this.showCalc} buttons={this.state.operators} />
          <CalcButton funct={this.calc} buttons={this.state.options} />
          <CalcButton funct={this.delete} buttons={this.state.delete} />
        </div>
      </div>
    );
  }
}

export default App;
