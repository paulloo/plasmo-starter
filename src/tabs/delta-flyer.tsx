import { usePort } from "@plasmohq/messaging/hook"

type RequestBody = {
  hello: string
}

type ResponseBody = {
  message: string
}

export default function DeltaFlyerPage() {
  
  const mailPort = usePort<RequestBody, ResponseBody>("mail")

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16
        }}>
        <h2>Delta Flyer Tab</h2>
  
        <p>This tab is only available on the Delta Flyer page.</p>
        
        {mailPort.data?.message}
        <button
          onClick={async () => {
            mailPort.send({
              hello: "world"
            })
          }}>
          Send Port
        </button>
      </div>
    )
  }