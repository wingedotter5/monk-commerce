import { useRef, useEffect } from "react";

export const CHECKBOX_STATES = {
  Checked: "Checked",
  Indeterminate: "Indeterminate",
  Empty: "Empty",
};

const Checkbox = ({ value, onChange }) => {
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (value === CHECKBOX_STATES.Checked) {
      checkboxRef.current.checked = true;
      checkboxRef.current.indeterminate = false;
    } else if (value === CHECKBOX_STATES.Empty) {
      checkboxRef.current.checked = false;
      checkboxRef.current.indeterminate = false;
    } else if (value === CHECKBOX_STATES.Indeterminate) {
      checkboxRef.current.checked = false;
      checkboxRef.current.indeterminate = true;
    }
  }, [value]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={value === CHECKBOX_STATES.Checked}
      onChange={onChange}
    />
  );
};

export default Checkbox;
