# Un Canal agrupa sus Fuentes por nombre, no por URL

Las Listas reales repiten un mismo canal con streams alternativos (`Atacama TV (1) [CL]`, `Atacama TV (2) [CL]`) y casi nunca traen `tvg-id`: la Lista de Alplox tiene 247 entradas y ninguna lo trae. Decidimos que la **Identidad de canal** es el `tvg-id` si existe y, si no, el nombre normalizado (sin el sufijo `(n)`, en minúsculas, sin tildes) más el País. Todas las entradas con la misma identidad forman **un solo Canal con varias Fuentes**, que se prueban en orden. Así el Zapping no tiene duplicados, muchos canales caídos se recuperan solos y los Favoritos sobreviven cuando la Lista cambia sus URLs.

## Consequences

- Si una Lista usa nombres distintos para el mismo canal, aparecen como Canales distintos. Lo aceptamos.
- Renombrar un canal en la Lista de origen hace que se pierda como Favorito.
