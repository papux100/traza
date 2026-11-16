import FichaInsercion from './Insercion'
import FichaBurbuja from './Burbuja'
import FichaSeleccion from './Seleccion'
import FichaShell from './Shell'
import FichaMezcla from './Mezcla'
import FichaQuicksort from './Quicksort'
import FichaMonticulos from './Monticulos'
import FichaBusquedaLineal from './BusquedaLineal'
import FichaBusquedaBinaria from './BusquedaBinaria'

/** Relaciona el id de cada algoritmo con el componente de su ficha. */
export const FICHAS = {
  insercion: FichaInsercion,
  burbuja: FichaBurbuja,
  seleccion: FichaSeleccion,
  shell: FichaShell,
  mezcla: FichaMezcla,
  quicksort: FichaQuicksort,
  monticulos: FichaMonticulos,
  'busqueda-lineal': FichaBusquedaLineal,
  'busqueda-binaria': FichaBusquedaBinaria,
}
