"use client";

import React, { useState } from "react";
import styles from "./ActionIcon.module.css";

import Prompt from "../Prompt/Prompt";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ActionIconProps {
  iconProp: IconDefinition;
  promptText: string;
  position: "top" | "right" | "bottom" | "left";
  showPrompt?: boolean;
  onAction?: () => void;
  color?: string;
}

export default function ActionIcon({
  iconProp,
  promptText,
  position,
  showPrompt = true,
  onAction = () => {},
  color,
}: ActionIconProps) {
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  return (
    <>
      <button
        onMouseEnter={(e) => {
          setIsMouseEnter(true);
        }}
        onMouseLeave={() => {
          setIsMouseEnter(false);
        }}
        onClick={onAction}
        className={styles.btn}
      >
        <FontAwesomeIcon
          icon={iconProp}
          className="icon"
          style={{ color: `var(--color-${color})` }}
        />
        {showPrompt && (
          <Prompt isMouseEnter={isMouseEnter} position={position}>
            {promptText}
          </Prompt>
        )}
      </button>
    </>
  );
}
