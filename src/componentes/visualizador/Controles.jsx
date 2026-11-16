import { Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react'
import { useStore } from 'zustand'
import { Button } from '@/componentes/ui/button'
import { Slider } from '@/componentes/ui/slider'
import { usePreferencias, VELOCIDAD_MAX, VELOCIDAD_MIN } from '@/motor/preferencias'

export function Controles({ reproductor }) {
  const indice = useStore(reproductor, (s) => s.indice)
  const total = useStore(reproductor, (s) => s.pasos.length)
  const reproduciendo = useStore(reproductor, (s) => s.reproduciendo)
  const { alternar, siguiente, retroceder, reiniciar, irA } = reproductor.getState()
  const velocidad = usePreferencias((s) => s.velocidad)
  const setVelocidad = usePreferencias((s) => s.setVelocidad)

  const ultimo = total - 1
  const alInicio = indice === 0
  const alFinal = indice >= ultimo

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Slider
          etiqueta="Posición en la ejecución"
          min={0}
          max={ultimo}
          step={1}
          value={indice}
          onValueChange={(valor) => irA(valor)}
        />
        <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
          Paso {indice + 1} de {total}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={reiniciar} disabled={alInicio} aria-label="Volver al inicio">
            <RotateCcw />
          </Button>
          <Button variant="ghost" size="icon" onClick={retroceder} disabled={alInicio} aria-label="Paso anterior">
            <StepBack />
          </Button>
          <Button size="icon-lg" onClick={alternar} aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}>
            {reproduciendo ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={siguiente} disabled={alFinal} aria-label="Paso siguiente">
            <StepForward />
          </Button>
        </div>

        <div className="flex w-full max-w-72 items-center gap-3 sm:w-auto sm:min-w-72">
          <span className="shrink-0 text-xs text-muted-foreground">Velocidad</span>
          <Slider
            etiqueta="Velocidad de reproducción"
            min={VELOCIDAD_MIN}
            max={VELOCIDAD_MAX}
            step={1}
            value={velocidad}
            onValueChange={(valor) => setVelocidad(valor)}
          />
          <span className="w-[4.75rem] shrink-0 text-right font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums">
            {velocidad} {velocidad === 1 ? 'paso/s' : 'pasos/s'}
          </span>
        </div>
      </div>
    </div>
  )
}
