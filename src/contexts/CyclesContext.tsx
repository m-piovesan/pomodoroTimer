import { ReactNode, createContext, useEffect, useReducer, useState } from "react"
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer"
import { addNewCycleAction, markCurrentCycleAsFinishedAction, interruptCurrentCycleAction } from "../reducers/cycles/actions"
import { differenceInSeconds } from "date-fns"

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void 
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
    children: ReactNode
}

interface CreateCycleData {
    task: string
    minutesAmount: number
}

export const CyclesContext = createContext({ } as CyclesContextType)

export function CyclesContextProvider({children}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
            cycles: [],
            activeCycleId: null,
        } , (initalState) => {
            const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state(1.0.0)')

            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON)
            }

            return initalState
        }
    )

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-timer:cycles-state(1.0.0)', stateJSON)
    }, [cyclesState])

    const { cycles, activeCycleId } = cyclesState
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
    
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle)
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        
        return 0
    })

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }
    
    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
        
        const newCycle:Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

        setAmountSecondsPassed(0)
    }

    function markCurrentCycleAsFinished() { 
        dispatch(markCurrentCycleAsFinishedAction())

        document.title = `Ignite Timer`
    }

    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction())

        document.title = `Ignite Timer` 
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed, 
                createNewCycle,
                interruptCurrentCycle,
            }
        }>

            {children}
        </CyclesContext.Provider>
    )
}