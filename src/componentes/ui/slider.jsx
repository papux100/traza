import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { cn } from '@/lib/utils'

function Slider({ className, etiqueta, ...props }) {
  return (
    <SliderPrimitive.Root data-slot="slider" className={cn('w-full', className)} {...props}>
      <SliderPrimitive.Control className="flex h-6 w-full cursor-pointer touch-none items-center select-none">
        <SliderPrimitive.Track className="h-0.5 w-full bg-input">
          <SliderPrimitive.Indicator className="bg-primary" />
          <SliderPrimitive.Thumb
            aria-label={etiqueta}
            className="size-3.5 rotate-45 rounded-[2px] border-2 border-primary bg-background transition-transform has-[:focus-visible]:scale-125 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
