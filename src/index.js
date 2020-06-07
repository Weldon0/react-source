import React from './react';
import ReactDOM from './react-dom';

let style = {
  border: '2px solid green',
  margin: '5px',
  padding: '5px',
  color: 'red',
}

let Element = (
  <div id="A1" style={style}>
    A1
    <div id="B1" style={style}>
      B1
      <div id="C1" style={style}>C1</div>
      <div id="C2" style={style}>C2</div>
    </div>
    <div id="B2" style={style}>B2</div>
    <button onClick={() => alert('234')}>点击</button>
  </div>
)

// const Element = React.createElement("div", {
//   id: "A1"
// }, React.createElement("div", {
//   id: "B1"
// }, React.createElement("div", {
//   id: "C1"
// }), React.createElement("div", {
//   id: "C2"
// })), React.createElement("div", {
//   id: "B2"
// }));

ReactDOM.render(
  Element,
  document.getElementById('root')
);

let render2 = document.getElementById('button2');
render2.addEventListener('click', () => {
  let Element2 = (
    <div id="A1-new" style={style}>
      A1-new
      <div id="B1-new" style={style}>
        B1-new3
        <div id="C1-new" style={style}>C1-new</div>
        <div id="C2-new" style={style}>C2-new</div>
      </div>
      <div id="B2-new" style={style}>B2-new</div>
      <span>武晓慧</span>
      <div id="b3">B3</div>
    </div>
  );
  ReactDOM.render(
    Element2,
    document.getElementById('root')
  );
})

let render3 = document.getElementById('button3');
render3.addEventListener('click', () => {
  let Element3 = (
    <div id="A1-new2" style={style}>
      A1-new2
      <div id="B1-new2" style={style}>
        B1-new2
        <div id="C1-new2" style={style}>C1-new2</div>
        <div id="C2-new2" style={style}>C2-new2</div>
      </div>
      <div id="B2-new2" style={style}>B2-new2</div>
      <h1 style={{ color: 'green' }}>武晓慧</h1>
    </div>
  );
  ReactDOM.render(
    Element3,
    document.getElementById('root')
  );
})