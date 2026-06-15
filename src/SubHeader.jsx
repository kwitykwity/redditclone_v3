import styles from './SubHeader.module.css'

export default function SubHeader() {
  return (
    <div className={styles.wrap}>
      <div className={styles.banner}></div>
      <div className={styles.info}>
        <div className={styles.iconWrap}>
          <div className={styles.icon}>⬤</div>
        </div>
        <div className={styles.details}>
          <h1 className={styles.name}>r/AITAH</h1>
        </div>
        <div className={styles.actions}>
          <button className={styles.createBtn}>＋ Create Post</button>
          <button className={styles.joinBtn}>Join</button>
          <button className={styles.moreBtn}>•••</button>
        </div>
      </div>
    </div>
  )
}
