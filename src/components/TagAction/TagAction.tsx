import { useState } from "react";
import Link from "next/link";

import styles from "./TagAction.module.css";
import ActionIcon from "../ActionIcon/ActionIcon";

import TagProps from "@/types/TagProps";
import useTag from "@/hooks/createTag/useTag";

import { faCheck, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TagAction = ({
  onAction,
  tag,
  mode,
}: {
  onAction: (e: any) => void;
  tag: TagProps;
  mode: "add" | "delete" | "search" | "edit";
}) => {
  const { deleteTag, updateTagName } = useTag();
  const [text, setText] = useState(tag.name);
  const [isEditModeOpen, setIsEditModeOpen] = useState(false);

  return (
    <button
      onClick={(e) => onAction(e)}
      id={tag.id}
      className={`${
        mode === "search"
          ? styles.book_tag
          : mode === "edit"
          ? styles.user_tag
          : ""
      }`}
    >
      {mode === "add" && tag.name}
      {mode === "delete" && (
        <>
          <span>{tag.name}</span>
          <span>x</span>
        </>
      )}
      {mode === "search" && (
        <Link href={`/search?tag=${tag.name}`}>{tag.name}</Link>
      )}
      {mode === "edit" && (
        <>
          <span>
            {isEditModeOpen && (
              <input
                type="text"
                value={text}
                className={styles.input}
                autoFocus
                onChange={(e) => setText(e.target.value)}
              />
            )}
            {!isEditModeOpen && (
              <input
                type="text"
                defaultValue={text}
                className={styles.input}
                readOnly
              />
            )}
          </span>
          <span className={styles.user_tag_actions}>
            {isEditModeOpen && (
              <ActionIcon
                iconProp={faCheck}
                promptText="Save"
                position="top"
                showPrompt={false}
                onAction={() => {
                  if (text !== tag.name) {
                    updateTagName(tag.id, tag.name, text);
                  }
                  setIsEditModeOpen(false);
                }}
                color="green-400"
              />
            )}
            {!isEditModeOpen && (
              <ActionIcon
                iconProp={faPen}
                promptText="edit"
                position="top"
                showPrompt={false}
                onAction={() => {
                  setIsEditModeOpen(true);
                }}
              />
            )}
            <ActionIcon
              iconProp={faTrashCan}
              promptText="delete"
              position="top"
              showPrompt={false}
              onAction={() => {
                deleteTag(tag.id, tag.name);
              }}
            />
          </span>
        </>
      )}
    </button>
  );
};

export default TagAction;