import React, { useCallback, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import type { MouseEventHandler } from "react";

import "./ColorPickerModal.css";
import { IBall } from "../interface";

type Props = {
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

  useEffect(() => {}, []);

  return (
    <div className="colorPicker">
      <HexColorPicker color={color} onChange={onChanged} />
      <button onClick={onClose}> поменять </button>
    </div>
  );
};

export default Modal;
