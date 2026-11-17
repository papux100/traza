import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { Campo } from '@/componentes/Campo'
import { Button } from '@/componentes/ui/button'
import { useSesion } from '@/stores/sesion'
import { destinoTrasEntrar, MIN_CONTRASENA, validarCuenta } from './formularios'

export default function Registro() {
  const navegar = useNavigate()
  const { state } = useLocation()
  const usuario = useSesion((s) => s.usuario)
  const registrar = useSesion((s) => s.registrar)
  const [valores, setValores] = useState({ nombre: '', correo: '', contrasena: '' })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [revisarCorreo, setRevisarCorreo] = useState(false)
  const destino = destinoTrasEntrar(state)

  if (usuario && !enviando) return <Navigate to={destino} replace />

  const cambiar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }))
    setErrores((er) => ({ ...er, [campo]: undefined }))
    setErrorGeneral(null)
  }

  async function enviar(evento) {
    evento.preventDefault()
    const encontrados = validarCuenta(valores, { conNombre: true })
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    try {
      const { requiereConfirmacion } = await registrar({
        nombre: valores.nombre.trim(),
        correo: valores.correo.trim(),
        contrasena: valores.contrasena,
      })
      if (requiereConfirmacion) {
        setRevisarCorreo(true)
        setEnviando(false)
      } else {
        navegar(destino, { replace: true })
      }
    } catch (error) {
      setErrorGeneral(error.message)
      setEnviando(false)
    }
  }

  if (revisarCorreo) {
    return (
      <div className="max-w-md">
        <h1 className="text-4xl">Revisa tu correo</h1>
        <p className="mt-3 text-foreground/85">
          Te enviamos un enlace a <strong>{valores.correo.trim()}</strong>. Ábrelo para confirmar tu cuenta y después
          inicia sesión.
        </p>
        <p className="mt-6">
          <Link to="/entrar" state={state} className="text-primary underline underline-offset-4">
            Ir a iniciar sesión
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <h1 className="text-4xl">Crear cuenta</h1>
      <p className="mt-3 text-foreground/85">Con una cuenta puedes abrir todas las fichas del catálogo.</p>

      <form onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-5">
        <Campo
          etiqueta="Nombre"
          autoComplete="name"
          placeholder="Ana Torres"
          value={valores.nombre}
          onChange={cambiar('nombre')}
          error={errores.nombre}
        />
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
          autoComplete="new-password"
          value={valores.contrasena}
          onChange={cambiar('contrasena')}
          error={errores.contrasena}
          ayuda={`Al menos ${MIN_CONTRASENA} caracteres.`}
        />

        {errorGeneral && (
          <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">
            {errorGeneral}
          </p>
        )}

        <Button type="submit" className="h-10" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link to="/entrar" state={state} className="text-primary underline underline-offset-4">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
