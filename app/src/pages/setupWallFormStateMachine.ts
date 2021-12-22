import { useState } from "react";

export const useSetupWallFormStateMachine = () => {
  const formStages = ["wallSettings", "drawHolds", "setMirroredHolds", "confirm"];
  const [formStage, setFormStage] = useState<string>("wallSettings");
  const [onLastStage, setOnLastStage] = useState<boolean>(false);

  return {
    formStage,
    onLastStage,
    back: () => {
      const currentIndex = formStages.indexOf(formStage);
      const nextIndex = Math.max(0, Math.min(currentIndex - 1, formStages.length - 1));

      setFormStage(formStages[nextIndex]);
      setOnLastStage(false);
    },
    next: () => {
      const currentIndex = formStages.indexOf(formStage);
      const nextIndex = Math.min(formStages.length - 1, Math.max(0, currentIndex + 1));

      setFormStage(formStages[nextIndex]);

      if (nextIndex === formStages.length - 1) {
        setOnLastStage(true);
      } else {
        setOnLastStage(false);
      }
    },
  };
};
