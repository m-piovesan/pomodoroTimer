import { HandPalm, Play } from "phosphor-react"
import { FormProvider, useForm } from 'react-hook-form'

import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { useContext } from "react";

import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Você precisa dar um nome para o seu projeto'),
    minutesAmount: zod
        .number()
        .min(5,'O tempo mínimo de um ciclo é de 5 minutos')
        .max(60,'O tempo máximo de um ciclo é de 60 minutos')
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)
    
    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const { handleSubmit, watch, reset } = newCycleForm

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }

    const task = watch('task')
    const isSubmitButtonDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    
                    <Countdown />

                { activeCycle ? (
                    <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitButtonDisabled}>
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                ) }

                
            </form>
        </HomeContainer>
    )
}