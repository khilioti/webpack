import * as $ from 'jquery'
function createAnalitics(): object {
   let counter = 0
   let destroyed: boolean = false

    const listener = (): number => counter++

    $(document).on('click', listener)

    return {
       destroy() {
           $(document).off('click', listener)
           destroyed = true
       },
       getClicks() {
           if (destroyed) {
               return `Analitics is destroyed. Total clics = ${counter}`
           }
           return counter
       }
    }
}

window['analitics'] = createAnalitics()