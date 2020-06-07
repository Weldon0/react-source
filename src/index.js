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
    this.setState(state => ({ number: state.number + 1}))
  }

  render() {
    console.log(this);
    return (
      <div id="counter">
        <h1>{this.state.number}</h1>
        <h2>{this.props.name}</h2>
        <button onClick={this.onClick}>数字加一</button>
      </div>
    )
  }
}

ReactDOM.render(<Counter name="计数器" />, document.getElementById('root'));