import { useState } from "react";
import { HexColorPicker } from "react-colorful";

import "./ColorPickerModal.css";
import { IBall } from "../interface";

type Props = {
  position: { X: number; Y: number };
  ball: IBall;
  onClose?: () => void;
};

const Modal = (props: Props) => {
  const { ball, onClose } = props;

  const [color, setColor] = useState("#aabbcc");

  const onChanged = (color: string) => {
    console.log(color);
    ball.color = color;
    setColor(color);
  };

  return (
    <div 
      className="colorPicker"
      style={{ top: `${props.position.Y}px`, left: ` ${props.position.X}px` }}
    >
      <HexColorPicker color={color} onChange={onChanged} />
      <button onClick={onClose}> поменять </button>
    </div>
  );
};

export default Modal;
