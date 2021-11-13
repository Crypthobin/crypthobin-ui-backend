import { Router } from 'express'
import { db } from '../classes/DatabaseClient'
import { bitcoin } from '../classes/BitcoinRPC'

const router = Router()

router.get('/', async (req, res) => {
  const blockCount = await bitcoin.getBlockCount()
  const nodeCount = await bitcoin.getNodeCount()

  const usersCount = await db.getUserCount()

  const blocks =
    Array(10).fill(0)
      .map((_, i) => blockCount - i)
      .map(async (v) => await bitcoin.getNthBlockHash(v))
      .map(async (v) => await bitcoin.getBlockFromHash(await v))

  const blocksData = await Promise.all(blocks)
  const blocksInfo =
    blocksData.map((v) => ({
      index: v.height,
      time: v.time,
      miner: v.tx[0].vout[0].scriptPubKey.address,
      minerReturns: v.tx[0].vout[0].value,
      txCount: v.tx.length
    }))

  res.send({
    success: true,
    data: {
      blockCount,
      nodeCount: nodeCount + 1, // add 1 for the node itself
      usersCount,
      blocks: blocksInfo
    }
  })
})

export default router
