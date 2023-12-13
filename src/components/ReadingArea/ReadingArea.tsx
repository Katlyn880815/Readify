"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./ReadingArea.module.css";

import Spinner from "../Spinner/Spinner";

/* HOOKS */
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/hooks";
import { useAuth } from "@/context/AuthContext";
import useFirestore from "@/hooks/firebase_db/useFirestore";
import parseEpub from "@/server-actions/parseEpub/parseEpub";

import { setCurrentBook } from "@/lib/redux/features/readSlice";

import { literata } from "@/fonts/fonts";

export default function ReadingArea() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentBook } = useAppSelector((state) => state.read);
  const { user } = useAuth();
  const firestore = useFirestore();

  const pathname = usePathname();
  const arrPath = pathname.split("/");
  const category = arrPath[1];
  const bookId = arrPath[arrPath.length - 1];

  const parser = parseEpub();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bookRender = async () => {
      try {
        setIsLoading(true);
        if (user) {
          const bookData = await firestore.getDocumentById(
            `/users/${user.uid}/${category}`,
            bookId
          );
          if (bookData) {
            dispatch(setCurrentBook(bookData));
            const epubDocuments = await parser.getAllDocuments(
              bookData.bookDownloadURL
            );
            const cleanChapterDivs = parser.handleDocuments(
              epubDocuments,
              bookData.images
            );
            const container = document.querySelector("#viewer");
            cleanChapterDivs.forEach((chapterDivElement) => {
              if (chapterDivElement) {
                container?.appendChild(chapterDivElement);
              }
            });
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    bookRender();
  }, [user]);

  return (
    <>
      {isLoading && <Spinner />}
      <div
        id="epub-viewer"
        className={`${styles.epubContainer} ${literata.className}`}
      >
        <div className={styles.book_intro}>
          <h2>{currentBook?.title}</h2>
          <p>{currentBook?.author}</p>
        </div>
        <div id="viewer" className={styles.viewer}></div>
      </div>
    </>
  );
}
