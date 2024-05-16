import {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  MouseEvent,
} from "react";

import "./App.css";
import { IBall, IPosition } from "./interface";
import ColorPickerModal from "./modal/ColorPickerModal";

function App() {
  const entropy = 0.9;

  const [counter, setCounter] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [colorPickerActive, setColorPickerActive] = useState(false);

  const cvsRef = useRef<HTMLCanvasElement>(null);
  const timerMouse = useRef(0);

  const balls = useRef<IBall[]>([
    {
      position: {
        X: 100,
        Y: 100,
      },
      mass: 100,
      color: "#000",
      radius: 20,
      velocity: {
        X: 0,
        Y: 0,
      },
      movable: true,
    },
    {
      position: {
        X: 300,
        Y: 100,
      },
      mass: 100,
      color: "#000",
      radius: 20,
      velocity: {
        X: -30,
        Y: 10,
      },
      movable: true,
    },
    {
      position: {
        X: 200,
        Y: 100,
      },
      mass: 100,
      color: "#000",
      radius: 30,
      velocity: {
        X: -30,
        Y: 0,
      },
      movable: true,
    },
  ]);

  const targetBall = useRef({
    position: {
      X: 0,
      Y: 0,
    },
    mass: 100,
    color: "#000",
    radius: 0,
    velocity: {
      X: 0,
      Y: 0,
    },
    movable: false,
  });

  useEffect(() => {
    if (cvsRef.current) {
      const ctx = cvsRef.current.getContext("2d") as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, 500, 250);
      reLocation();
      for (let i = 0; i < balls.current.length; i++) {
        //отрисовка объектов
        ctx.beginPath();
        ctx.arc(
          balls.current[i].position.X,
          balls.current[i].position.Y,
          balls.current[i].radius,
          0,
          2 * Math.PI,
        );
        ctx.fillStyle = balls.current[i].color;
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [counter]);

  useLayoutEffect(() => {
    let timerId: number;
    const animate = () => {
      setCounter((c) => c + 1);

      timerId = requestAnimationFrame(animate);
    };
    timerId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timerId);
  }, []); // Make sure the effect runs only once

  function MacroCollision(obj1: IPosition, obj2: IPosition, distance: number) {
    return (
      Math.sqrt(Math.pow(obj1.X - obj2.X, 2) + Math.pow(obj1.Y - obj2.Y, 2)) <
      distance
    );
  }

  const onDownMouse = (e: MouseEvent) => {
    setMouseDown(true);
    timerMouse.current = Date.now();
    setColorPickerActive(false);
    targetBall.current.movable = true;
    if (cvsRef.current) {
      for (let i = 0; i < balls.current.length; i++) {
        if (
          MacroCollision(
            balls.current[i].position,
            {
              X: e.clientX - cvsRef.current.clientLeft,
              Y: e.clientY - cvsRef.current.clientTop,
            },
            balls.current[i].radius,
          )
        ) {
          targetBall.current = balls.current[i];

          balls.current[i].movable = false;
        }
      }
    }
  };
  const onUpMouse = () => {
    setMouseDown(false);
    console.log(colorPickerActive);
    if (Date.now() - timerMouse.current < 500 && !targetBall.current.movable) {
      setColorPickerActive(true);
    } else {
      targetBall.current.movable = true;
    }
  };

  const onMoveMouse = (e: MouseEvent<HTMLCanvasElement>) => {
    if (mouseDown && !targetBall.current.movable) {
      targetBall.current.velocity = {
        X: targetBall.current.position.X - e.clientX,
        Y: targetBall.current.position.Y - e.clientY,
      };
    }
  };
  const onMouseLeave = () => {
    if (mouseDown && !targetBall.current.movable) {
      targetBall.current.movable = true;
    }
  };

  const onCloseColorPicker = () => {
    targetBall.current.movable = true;
    setColorPickerActive(false);
  };

  const reLocation = () => {
    for (let i = 0; i < balls.current.length; i++) {
      if (balls.current[i].movable) {
        balls.current[i].position.X += balls.current[i].velocity.X / 10; //передвижение объекта(ов) согласно его(их) скорости
        balls.current[i].position.Y += balls.current[i].velocity.Y / 10;
      }
      if (
        (balls.current[i].position.X <= balls.current[i].radius &&
          balls.current[i].velocity.X < 0) ||
        (balls.current[i].position.X >= 500-balls.current[i].radius && balls.current[i].velocity.X > 0)
      ) {
        balls.current[i].velocity.X = -balls.current[i].velocity.X * entropy;
      } else if (
        (balls.current[i].position.Y <= balls.current[i].radius &&
          balls.current[i].velocity.Y < 0) ||
        (balls.current[i].position.Y >= 250-balls.current[i].radius && balls.current[i].velocity.Y > 0)
      ) {
        balls.current[i].velocity.Y = -balls.current[i].velocity.Y * entropy;
      }
      for (let j = i + 1; j < balls.current.length; j++) {
        if (
          MacroCollision(
            balls.current[i].position,
            balls.current[j].position,
            balls.current[i].radius + balls.current[j].radius,
          )
        ) {
          const vCollision: IPosition = {
            X: balls.current[j].position.X - balls.current[i].position.X,
            Y: balls.current[j].position.Y - balls.current[i].position.Y,
          };
          const distance = Math.sqrt(
            Math.pow(
              balls.current[i].position.X - balls.current[j].position.X,
              2,
            ) +
              Math.pow(
                balls.current[i].position.Y - balls.current[j].position.Y,
                2,
              ),
          );
          const vCollisionNorm = {
            X: vCollision.X / distance,
            Y: vCollision.Y / distance,
          };
          const vRelativeVelocity = {
            X: balls.current[i].velocity.X - balls.current[j].velocity.X,
            Y: balls.current[i].velocity.Y - balls.current[j].velocity.Y,
          };
          const speed =
            vRelativeVelocity.X * vCollisionNorm.X +
            vRelativeVelocity.Y * vCollisionNorm.Y;
          if (speed < 0) {
            break;
          }
          balls.current[j].velocity.X += speed * vCollisionNorm.X * entropy;
          balls.current[j].velocity.Y += speed * vCollisionNorm.Y * entropy;
          balls.current[i].velocity.X -= speed * vCollisionNorm.X * entropy;
          balls.current[i].velocity.Y -= speed * vCollisionNorm.Y * entropy;
        }
      }
    }
  };
  return (
    <div className="App">
      {colorPickerActive ? (
        <ColorPickerModal
          position={{
            X: targetBall.current.position.X,
            Y: targetBall.current.position.Y,
          }}
          ball={targetBall.current}
          onClose={onCloseColorPicker}
        ></ColorPickerModal>
      ) : null}
      <canvas
        ref={cvsRef}
        onMouseLeave={onMouseLeave}
        onMouseUp={onUpMouse}
        onMouseDown={onDownMouse}
        onMouseMove={(e) => {
          onMoveMouse(e);
        }}
        id="canvas"
        width="500"
        height="250"
      ></canvas>
    </div>
  );
}

export default App;
