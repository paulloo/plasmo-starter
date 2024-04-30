
import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    console.log("ping handler called:", req.body.id)
  const message = `pong ${req.body.id}`
 
  res.send({
    message
  })
}
 
export default handler