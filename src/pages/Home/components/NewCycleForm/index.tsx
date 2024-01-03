import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

import { useContext } from "react";
import { useFormContext } from "react-hook-form";

import { CyclesContext } from "../../../../contexts/CyclesContext";

export function NewCycleForm() {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()

    return (
        <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        list="tasks-suggestions"
                        placeholder="Dê um nome para o seu projeto"
                        disabled={!!activeCycle}
                        {...register('task')}                    
                    />

                    <datalist id="tasks-suggestions">
                        <option value="Projeto 1"></option>
                        <option value="Estudar React"></option>
                        <option value="Ler meu livro"></option>
                        <option value="Treinar Kung Fu"></option>
                    </datalist>

                    <label htmlFor="minutesAmount">Durante</label>
                    <MinutesAmountInput
                        id="minutesAmount"
                        type="number"
                        placeholder="0"
                        step={5}
                        min={5}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
        </FormContainer>
    )
}