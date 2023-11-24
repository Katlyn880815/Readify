import React, { Suspense } from "react";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import SignupForm from "@/components/SignupForm/SignupForm";
import Loading from "../loading";

export default function Signup() {
  return (
    <Suspense fallback={<Loading />}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <Image
            src="/image/logo-light.png"
            alt="logo"
            width={80}
            height={60}
            priority={true}
          />
          <div>
            <h3 className="font-strong">Sign up</h3>
            <p>Create an account to continue</p>
          </div>
        </div>
        <SignupForm />
        <div className={styles.guide_to_signup}>
          <Link href="/signin">Already have a Readify account? Sign in</Link>
        </div>
      </div>
    </Suspense>
  );
}
