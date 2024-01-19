"use client";
import React, { useEffect, useState } from "react";
import styles from "./BookList.module.css";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
/* TYPE */
import { BookListProps, BookProps } from "@/types/BookListProps";

/* COMPONENT */
import Categorize from "../Categorize/Categorize";
import ActionPrompt from "../ActionPrompt/ActionPrompt";

/* THIRD-LIB */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeather } from "@fortawesome/free-solid-svg-icons";

/* CUSTOM-HOOKS */
import { useAppDispatch, useAppSelector } from "@/hooks/redux/hooks";
import {
  reset,
  setMoreActionBtnClose,
} from "@/lib/redux/features/moreActionSlice";
import TagProps from "@/types/TagProps";
import useTag from "@/hooks/createTag/useTag";
import TagAction from "../TagAction/TagAction";

/////////////////////////////////////////////////////////

function Book({ book }: { book: BookProps }) {
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [tags, setTags] = useState<TagProps[]>(book.tags);
  const { isMoreActionBtnOpen, isOtherMoreActionBtnOpen } = useAppSelector(
    (state) => state.moreAction
  );
  const { deleteTagFromBook, updateTagNameFromBook } = useTag();
  const router = useRouter();
  const pathname = usePathname();
  const category = pathname.split("/").pop();

  const dispatch = useAppDispatch();
  const { deleteId, updateId, updateName } = useAppSelector(
    (state) => state.moreAction
  );

  useEffect(() => {
    if (tags && deleteId) {
      const isContainDeletedTag = tags.filter((cur) => cur.id === deleteId);
      if (isContainDeletedTag.length > 0) {
        setTags((prev) => prev.filter((cur) => cur.id !== deleteId));
        deleteTagFromBook(
          book.bookId,
          tags.filter((cur) => cur.id !== deleteId)
        );
        dispatch(reset());
      }
    }
  }, [deleteId]);

  useEffect(() => {
    if (tags && updateId) {
      const isContainUpdateId = tags.filter((cur) => cur.id === updateId);
      if (isContainUpdateId.length > 0) {
        const oldName = isContainUpdateId[0].name;
        setTags((prev) => prev.filter((cur) => cur.id !== updateId));
        setTags((prev) => [
          ...prev,
          {
            id: updateId,
            name: updateName,
          },
        ]);
        updateTagNameFromBook(book.bookId, updateId, oldName, updateName);
        dispatch(reset());
      }
    }
  }, [updateId]);

  return (
    <li
      className={`${styles.book} ${isMouseEnter ? styles.book_active : ""}`}
      onMouseEnter={() => {
        if (!isMoreActionBtnOpen && !isOtherMoreActionBtnOpen)
          setIsMouseEnter(true);
      }}
      onMouseLeave={() => {
        if (!isMoreActionBtnOpen) setIsMouseEnter(false);
      }}
      onClick={() => {
        dispatch(setMoreActionBtnClose());
        router.push(`${category}/read/${book.bookId}`);
      }}
    >
      <div className={styles.img_container}>
        {book.coverURL && (
          <Image
            src={book.coverURL}
            alt={`Book-${book.title}`}
            width={80}
            height={80}
          />
        )}
        {book.coverURL === null && (
          <Image
            src="/image/image-not-found.png"
            alt={`Book-${book.title}`}
            width={80}
            height={80}
          />
        )}
      </div>
      <div className={styles.book_intro}>
        <h3>{book.title}</h3>
        <div className={styles.book_row}>
          <p className={styles.author}>
            <FontAwesomeIcon icon={faFeather} className="icon" />
            <span>{book.author}</span>
          </p>
          {tags &&
            tags.map((tag) => (
              <TagAction
                onAction={(e) => {
                  e.stopPropagation();
                }}
                key={tag.id}
                tag={tag}
                mode="search"
              />
            ))}
        </div>
      </div>
      <Categorize
        isMouseEnter={isMouseEnter}
        book={book}
        tags={tags}
        onAddTag={setTags}
      />
    </li>
  );
}

export default function BookList({ bookList }: BookListProps) {
  const { isError, isSuccessful } = useAppSelector((state) => state.book);
  return (
    <>
      <ul className={styles.books}>
        {bookList.map((book) => (
          <Book book={book} key={book.bookId} />
        ))}
      </ul>

      <ActionPrompt
        isError={isError}
        errorMes={isError ? "Delete file fail" : ""}
        isSuccessful={isSuccessful}
        successfulMes={isSuccessful ? "Delete successfully" : ""}
      />
    </>
  );
}
