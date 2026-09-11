import { $ } from "./dom"
import { doneCount } from "./levels"
import { options, resetProgress, saveOptions, type Options } from "./storage"
import { back, onShow } from "./router"

// Écran « Options » : cases à cocher liées à `options` (data-opt="clé"), sauvegarde immédiate.
// Effacer la progression demande une confirmation en deux temps (pas de confirm() en WebView).

const refresh = () => {
  document.querySelectorAll<HTMLInputElement>("[data-opt]").forEach((inp) => {
    inp.checked = options[inp.dataset.opt as keyof Options]
  })
  const n = doneCount()
  $("o-progress").textContent = `${n} niveau${n > 1 ? "x" : ""} terminé${n > 1 ? "s" : ""}`
}

export const initOptions = (onChange: () => void) => {
  const saved = $("o-saved")
  const flashSaved = () => {
    saved.textContent = "● ENREGISTRÉ"
    saved.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 300 })
  }

  document.querySelectorAll<HTMLInputElement>("[data-opt]").forEach((inp) => {
    inp.addEventListener("change", () => {
      options[inp.dataset.opt as keyof Options] = inp.checked
      saveOptions()
      flashSaved()
      onChange()
    })
  })

  const reset = $<HTMLButtonElement>("o-reset")
  let armed = false
  reset.addEventListener("click", () => {
    if (!armed) {
      armed = true
      reset.textContent = "CONFIRMER ?"
      setTimeout(() => {
        armed = false
        reset.textContent = "EFFACER"
      }, 3000)
      return
    }
    armed = false
    reset.textContent = "EFFACER"
    resetProgress()
    refresh()
    flashSaved()
  })

  $("o-close").addEventListener("click", back)
  onShow("options", refresh)
}
