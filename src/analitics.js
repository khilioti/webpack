import * as $ from 'jquery'
function createAnalitics() {
   let counter = 0
   let destroyed = false

    const listener = () => counter++

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

window.analitics = createAnalitics()