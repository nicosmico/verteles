import styles from '../diagnostics/Diagnostics.module.css';

/** A spike screen that is not ready yet: still loading, or arriving in a later ticket. */
export function Placeholder(props: { title: string; detail: string }) {
  return (
    <section class={styles.screen}>
      <h1 class={styles.title}>{props.title}</h1>
      <p>{props.detail}</p>
    </section>
  );
}
