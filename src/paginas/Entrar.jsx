import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { Campo } from '@/componentes/Campo'
import { MarcoCuenta } from '@/componentes/MarcoCuenta'
import { Button } from '@/componentes/ui/button'
import { useSesion } from '@/stores/sesion'
import { destinoTrasEntrar, validarCuenta } from './formularios'

export default function Entrar() {
  const navegar = useNavigate()
  const { state } = useLocation()
  const usuario = useSesion((s) => s.usuario)
  const iniciarSesion = useSesion((s) => s.iniciarSesion)
  const [valores, setValores] = useState({ correo: '', contrasena: '' })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const destino = destinoTrasEntrar(state)

  if (usuario && !enviando) return <Navigate to={destino} replace />

  const cambiar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }))
    setErrores((er) => ({ ...er, [campo]: undefined }))
    setErrorGeneral(null)
  }

  async function enviar(evento) {
    evento.preventDefault()
    const encontrados = validarCuenta({ ...valores, nombre: '' }, { conNombre: false })
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    try {
      await iniciarSesion({ correo: valores.correo.trim(), contrasena: valores.contrasena })
      navegar(destino, { replace: true })
    } catch (error) {
      setErrorGeneral(error.message)
      setEnviando(false)
    }
  }

  return (
    <MarcoCuenta semilla={11}>
      <h1 className="text-4xl">Iniciar sesión</h1>
      <p className="mt-3 text-foreground/85">Entra para ver todas las fichas del catálogo.</p>

      <form onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-5">
        <Campo
          etiqueta="Correo"
          type="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={valores.correo}
          onChange={cambiar('correo')}
          error={errores.correo}
        />
        <Campo
          etiqueta="Contraseña"
          type="password"
          autoComplete="current-password"
          value={valores.contrasena}
          onChange={cambiar('contrasena')}
          error={errores.contrasena}
        />

        {errorGeneral && (
          <p role="alert" className="rounded-[3px] border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" className="h-10" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" state={state} className="text-primary underline underline-offset-4">
          Crea una
        </Link>
      </p>
    </MarcoCuenta>
  )
}
