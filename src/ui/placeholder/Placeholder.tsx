import styles from '../diagnostics/Diagnostics.module.css';

/** A spike screen whose content arrives in a later ticket. */
export function Placeholder(props: { title: string; ticket: string }) {
  return (
    <section class={styles.screen}>
      <h1 class={styles.title}>{props.title}</h1>
      <p>Llega en el ticket {props.ticket} de la fase 0.</p>
    </section>
  );
}
