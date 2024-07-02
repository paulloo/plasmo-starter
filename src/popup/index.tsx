import axios from "axios"
import { useEffect, useState } from "react"

import {
  sendToBackground,
  sendToBackgroundViaRelay,
  sendToContentScript
} from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import "../styles/main.css"

function IndexPopup() {
  const [data, setData] = useState("")
  const [selector, setSelector] = useState("#itero")
  const [csResponse, setCsData] = useState("")
  const [pong, setPong] = useState("")

  const [hailingFrequency, setHailingFrequency] = useStorage("hailing", "42")

  async function handleBackgroundMessage(data) {
    const resp = await sendToBackground({
      name: "ping",
      body: {
        id: data || "none"
      }
    })

    console.log(resp)
    setPong(resp.message)
  }

  async function handleBackgroundMessagePop(data) {
    const resp = await sendToBackground({
      // name: "open-extension",
      name: "hash-tx",
      // name: "get-manifest",
      body: {
        input: 2
      }
    })
  }

  async function articleSpider() {
    try {
      const apiURL = "http://111.231.107.70:5508/parse_article"
      const response = await axios.post(apiURL, {
        url: "https://www.sohu.com/a/246999709_119570",
        title_node: "h1",
        content_primary_node: "article",
        content_class: "article"
      })
      console.log(response.data)
      const { title } = response.data
      setPong(title)
      // 在这里可以处理获取到的数据
    } catch (error) {
      console.error("Fetching data failed", error)
      // 处理错误情况
    }
  }

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <div className="w-full p-12">
      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
      <button
        onClick={() => {
          articleSpider();
        }}
        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-80"
      >
        文章采集
      </button>
      <div>
        <label for="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input 
          value={hailingFrequency}
          onChange={(e) => setHailingFrequency(e.target.value)}
          type="text" name="price" id="price" className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label for="currency" className="sr-only">Currency</label>
            <select id="currency" name="currency" className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
              <option>USD</option>
              <option>CAD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
      </div>
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
          handleBackgroundMessage(data);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        ping ping
      </button>

      <button
        onClick={() => {
          handleBackgroundMessagePop(data);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        popup..
      </button>
      <button
        onClick={() => {
          chrome.tabs.create({
            url: "./tabs/delta-flyer.html",
          });
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        open tab page
      </button>
      <button
        onClick={() => {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const { id } = tabs[0];
              chrome.scripting.executeScript({
                target: { tabId: id },
                func: () => {
                  const iframe = document.createElement("iframe");
                  iframe.src = chrome.runtime.getURL("/tabs/delta-flyer.html");
                  iframe.name = "delta-flyer";
                  document.body.appendChild(iframe);
                },
              });
            }
          );
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        iframe mounting
      </button>

      <input
        value={selector}
        onChange={(e) => setSelector(e.target.value)}
      />
      <button
        onClick={async () => {
          const csResponse = await sendToContentScript({
            name: "query-selector-text",
            body: selector,
          });
          console.log("csResponse: ", csResponse);
          setCsData(csResponse);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Query Text on Web Page
      </button>
      <br />
      <p>Text Data:{csResponse}</p>
      <div>{pong}</div>
    </div>
  );
}

export default IndexPopup
