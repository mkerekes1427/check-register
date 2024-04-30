import Image from "next/image";
import styles from "./page.module.css";
import Registry from "./components/registry";

export default function Home() {
  return (
    <main className={styles.main}>
        <Registry/>
    </main>
  );
}
