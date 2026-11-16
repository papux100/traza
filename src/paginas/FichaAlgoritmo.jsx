import { useParams } from 'react-router'
import { FICHAS } from '@/fichas'
import NoEncontrada from './NoEncontrada'

export default function FichaAlgoritmo() {
  const { id } = useParams()
  const Componente = FICHAS[id]
  if (!Componente) return <NoEncontrada />
  return <Componente />
}
