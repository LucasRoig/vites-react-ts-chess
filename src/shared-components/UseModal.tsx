import { useState } from "react";

const useModal = (): [boolean, () => void] => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return [
    isShowing,
    toggle
  ];
};

export default useModal;
