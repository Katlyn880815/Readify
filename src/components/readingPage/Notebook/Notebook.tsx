"use client";

import React, { useEffect, Dispatch, SetStateAction } from "react";
import styles from "./Notebook.module.css";
import { usePathname } from "next/navigation";

import Highlight from "../Highlight/Highlight";
import ActionIcon from "@/components/common/ActionIcon/ActionIcon";

import { useAuth } from "@/context/AuthContext";
import { useRWD } from "@/hooks/useRWD/useRWD";
import { useAppSelector, useAppDispatch } from "@/hooks/redux/hooks";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { resetNotes } from "@/lib/redux/features/noteSlice";

export default function Notebook({
  isNotebookOpen,
  onSetIsNotebookOpen,
}: {
  isNotebookOpen: boolean;
  onSetIsNotebookOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const arrPath = usePathname().split("/");
  const category = arrPath[1];
  const bookId = arrPath[arrPath.length - 1];

  const { user } = useAuth();
  const { screenWidth } = useRWD();
  const { currentCategory, currentBook } = useAppSelector(
    (state) => state.read
  );
  const { highlightList } = useAppSelector((state) => state.note);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetNotes());
    };
  }, [dispatch]);

  return (
    <div
      className={`${styles.container} ${
        !isNotebookOpen ? styles.notebook_close : ""
      }`}
    >
      <div className={styles.title}>
        <span>highlights</span>
        <ActionIcon
          iconProp={faXmark}
          promptText="Close notebooks"
          position="left"
          showPrompt={false}
          onAction={() => {
            onSetIsNotebookOpen(false);
          }}
        />
      </div>
      <div className={styles.highlight_list}>
        {highlightList &&
          highlightList.map(({ id, markerColor, text, note, chapter }) => (
            <Highlight
              key={id}
              id={id}
              markerColor={markerColor}
              text={text}
              note={note}
              chapter={chapter}
            ></Highlight>
          ))}
      </div>
    </div>
  );
}
