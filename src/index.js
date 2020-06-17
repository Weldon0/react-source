import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0
    }
  }

  onClick = () => {
    this.setState(state => ({number: state.number + 1}));
    console.log(this.state);
    this.setState({
      number: '100',
    })
    console.log(this.state);
    this.setState({
      number: '880',
    })
  }

  render() {
    return (
      <div id="counter">
        <h1>{this.state.number}</h1>
        <button onClick={this.onClick}>数字加一</button>
      </div>
    )
  }
}

console.log(Counter);

ReactDOM.render(
  <Counter
    name="计数器"
    id="test"
  />, document.getElementById('root'));
