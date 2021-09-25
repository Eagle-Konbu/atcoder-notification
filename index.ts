import { IncomingWebhook } from '@slack/webhook'
import axios from 'axios'
import moment from 'moment-timezone'
import 'source-map-support'
import data from './data.json'


(async () => {
  const now = moment().tz("Asia/Tokyo")
  const message = now.format("YYYY年MM月DD日 hh:mm:ss現在") + `\nAC数:${data.count}\n順位:${data.rank}`
  console.log(message)

  const webhook = new IncomingWebhook(process.env.SLACK_URL ?? "")
  await webhook.send({
    text: message
  })

  console.log(message)

})().catch(error => {
  console.error(error)
}).finally(() => {
  console.log("Finished!")
})