import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className="layout-container"> 
      <div className={styles.container}>
        <h1>🌤 Select a City</h1>
        <div className={styles.buttons}>
          <Link href="/Seoul"><button>Seoul</button></Link>
          <Link href="/Tokyo"><button>Tokyo</button></Link>
          <Link href="/Paris"><button>Paris</button></Link>
          <Link href="/London"><button>London</button></Link>
        </div>
      </div>
    </div>
  );
}
