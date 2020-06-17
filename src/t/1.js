

function useMouse(fn) {
  const position = {
    x: 0,
    y: 0,
  }
  window.addEventListener('mousemove', (e) => {
    position.x = e.clientX;
    position.y = e.clientY;
    fn({
      x: position.x,
      y: position.y,
    })
  })
}

function cat({ x, y }) {
  console.log('小猫', `x:${x} - y:${y}`)
}


function count({ x = 0, y = 0 }) {
  console.log('计数', `x:${x} - y:${y}`)
}

useMouse(cat)
useMouse(count)