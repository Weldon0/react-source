import React, {
  useEffect,
  useState,
} from 'react';

function useMouse(WrappedComponent) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleSetPosition = (e) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    })
  }
  useEffect(() =>{
    window.addEventListener('mousemove', handleSetPosition);
  }, () =>{
    window.removeEventListener('mousemove', handleSetPosition);
  });

  return <WrappedComponent {...position} />
}

function App({ x = 0, y = 0 }) {
  return <h1>{x}-{y}</h1>
}

export default useMouse(App);