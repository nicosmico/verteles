/** A Channel of an imported Lista. See CONTEXT.md. */
export interface Channel {
  /** Identidad de canal: survives re-downloading the Lista (ADR-0009). */
  key: string;
  /** Número de canal: 1-based position in its Lista. */
  number: number;
  name: string;
  logo: string | null;
  /** Grupo as the Lista declares it, e.g. "news". */
  group: string | null;
  /** País code from the trailing tag of the name, e.g. "CL". */
  country: string | null;
  /** Fuentes: stream URLs, tried in order. */
  sources: string[];
}
