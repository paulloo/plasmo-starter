import { useEffect, useState } from "react"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

function IndexPopup() {
  const [data, setData] = useState("")
  const [selector, setSelector] = useState("#itero")
  const [csResponse, setCsData] = useState("")
  const [pong, setPong] = useState('')


  async function handleBackgroundMessage(data) {
    const resp = await sendToBackground({
      name: "ping",
      body: {
        id: data || 'none'
      }
    })
    
    console.log(resp.message)
    setPong(resp.message)
  }


  useEffect(() => {
    

    return () => {
     
    }
  }, [])


  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        padding: 16
      }}>
      <h2>
        Welcome to your{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
      
      <button
        onClick={() => {
          handleBackgroundMessage(data)
        }}>
        ping ping
      </button>
      <button
        onClick={() => {
          chrome.tabs.create({
            url: "./tabs/delta-flyer.html"
          })
        }}>
        open tab page
      </button>
      <button
        onClick={() => {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const { id } = tabs[0]
              chrome.scripting.executeScript({
                target: { tabId: id },
                func: () => {
                  const iframe = document.createElement("iframe")
                  iframe.src = chrome.runtime.getURL("/tabs/delta-flyer.html")
                  iframe.name = "delta-flyer"
                  document.body.appendChild(iframe)
                },
                
              })
            }
          )
        }}>
        iframe mounting
      </button>

      <input value={selector} onChange={(e) => setSelector(e.target.value)} />
      <button
        onClick={async () => {
          const csResponse = await sendToContentScript({
            name: "query-selector-text",
            body: selector
          })
          console.log("csResponse: ", csResponse)
          setCsData(csResponse)
        }}>
        Query Text on Web Page
      </button>
      <br />
      <p>Text Data:{csResponse}</p>
      <div>{pong}</div>
    </div>
  )
}

export default IndexPopup