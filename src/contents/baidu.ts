import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.baidu.com/*"]
}

window.addEventListener("load", () => {
  document.body.style.background = "gray"
})
