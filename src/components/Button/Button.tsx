import React from "react";

import { buttonClass } from "./styles";

interface Props {
  onClickSave: () => void;
}
const Button = (props: Props): React.ReactElement => (
  <button type="button" className={buttonClass} onClick={props.onClickSave}>
    Save
  </button>
);
export default Button;
