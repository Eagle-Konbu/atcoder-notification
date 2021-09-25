import { IncomingWebhook } from '@slack/webhook'
import axios from 'axios'
import moment from 'moment-timezone'
import 'source-map-support'

type ACDetail = {
  acCount: number,
  rank: number,
  user: string
}

(async () => {
  const now = moment().tz("Asia/Tokyo")
  const users = ["cl17"]

  let data: ACDetail[] = []
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    const detail: ACDetail = await axios.get("https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank", {
      params: {
        user: user
      },
      headers: {
        "accept-encoding": "gzip"
      }
    }).then(res => res.data).then(json => {
      return {
        acCount: json.count,
        rank: json.rank,
        user: user
      }
    })
    data.push(detail)
  }

  data.sort((a, b) => a.rank < b.rank ? -1 : 1)

  let message = now.format("YYYY年MM月DD日 HH:mm現在")
  for (let i = 0; i < data.length; i++) {
    let rank = i + 1
    if (i >= 1 && data[i].rank == data[i - 1].rank) {
      rank--
    }
    message += `\n${rank}位 (AC:${data[i].acCount}回): ${data[i].user}`
  }

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