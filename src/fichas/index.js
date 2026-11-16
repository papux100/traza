import FichaInsercion from './Insercion'
import FichaInsercionBinaria from './InsercionBinaria'
import FichaBurbuja from './Burbuja'
import FichaCoctelera from './Coctelera'
import FichaSeleccion from './Seleccion'
import FichaShell from './Shell'
import FichaPeine from './Peine'
import FichaMezcla from './Mezcla'
import FichaQuicksort from './Quicksort'
import FichaMonticulos from './Monticulos'
import FichaArbol from './Arbol'
import FichaConteo from './Conteo'
import FichaResiduos from './Residuos'
import FichaCubetas from './Cubetas'
import FichaBusquedaLineal from './BusquedaLineal'
import FichaBusquedaBinaria from './BusquedaBinaria'
import FichaBusquedaSaltos from './BusquedaSaltos'
import FichaBusquedaInterpolacion from './BusquedaInterpolacion'
import FichaBusquedaExponencial from './BusquedaExponencial'

/** Relaciona el id de cada algoritmo con el componente de su ficha. */
export const FICHAS = {
  insercion: FichaInsercion,
  'insercion-binaria': FichaInsercionBinaria,
  burbuja: FichaBurbuja,
  coctelera: FichaCoctelera,
  seleccion: FichaSeleccion,
  shell: FichaShell,
  peine: FichaPeine,
  mezcla: FichaMezcla,
  quicksort: FichaQuicksort,
  monticulos: FichaMonticulos,
  arbol: FichaArbol,
  conteo: FichaConteo,
  residuos: FichaResiduos,
  cubetas: FichaCubetas,
  'busqueda-lineal': FichaBusquedaLineal,
  'busqueda-binaria': FichaBusquedaBinaria,
  'busqueda-saltos': FichaBusquedaSaltos,
  'busqueda-interpolacion': FichaBusquedaInterpolacion,
  'busqueda-exponencial': FichaBusquedaExponencial,
}
