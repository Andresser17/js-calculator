import "./App.css";
import { Component } from "react";

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
  {
    id: "add",
    symbol: "+",
  },
  {
    id: "subtract",
    symbol: "-",
  },
  {
    id: "divide",
    symbol: "/",
  },
  {
    id: "multiply",
    symbol: "x",
  },
];

const OPERATORS = [
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
      total: 0,
      actualOp: "0",
      historial: [],
      clearAll: false,
      completedOp: false,
    };
    this.showOp = this.showOp.bind(this);
    this.calc = this.calc.bind(this);
  }

  showOp(symbol) {
    const actualOp = this.state.actualOp;
    const completedOp = this.state.completedOp;

    if (actualOp === "0") {
      this.setState({
        actualOp: symbol,
      });
    } else if (
      symbol === "+" && completedOp ||
      symbol === "-" ||
      symbol === "/" ||
      symbol === "x"
    ) {
      this.setState((state) => ({
        actualOp: String(state.actualOp + String(symbol)),
        completedOp: false
      }));

    } else if (completedOp) {
      this.setState({
        actualOp: symbol,
        completedOp: false,
      });
    } else {
      this.setState((state) => ({
        actualOp: String(state.actualOp + String(symbol)),
      }));
    }
  }

  calc(symbol) {
    const actualOp = this.state.actualOp.slice();
    const calc = eval(actualOp.replace("x", "*"));
    const completedOp = this.state.completedOp;

    if (symbol === "=" && !completedOp) {
      this.setState((state) => ({
        historial: [...state.historial, actualOp],
        actualOp: String(calc),
        clearAll: false,
        completedOp: true,
      }));
    } else if (symbol === "=" && completedOp) {
      this.setState((state) => ({
        clearAll: false,
      }));
    } else if (!this.state.clearAll) {
      this.setState((state) => ({
        actualOp: "0",
        clearAll: true,
        completedOp: false,
      }));
    } else {
      this.setState((state) => ({
        historial: [],
        actualOp: "0",
        clearAll: false,
        completedOp: false,
      }));
    }
  }

  clear(symbol) {}

  render() {
    const historial = this.state.historial.map((item, index) => {
      return <li key={index}>{item}</li>;
    });
    const actualOp = this.state.actualOp;

    return (
      <div className="App">
        <div id="display">
          <ul id="historial">{historial}</ul>
          <span id="actual-op">{actualOp}</span>
        </div>
        <div id="calc">
          <CalcButton funct={this.showOp} buttons={this.state.numbers} />
          <CalcButton funct={this.calc} buttons={this.state.operators} />
        </div>
      </div>
    );
  }
}

export default App;
