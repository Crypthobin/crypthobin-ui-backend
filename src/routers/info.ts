import { Router } from 'express'
import { db, bitcoin } from '../classes'

const router = Router()

router.get('/', async (_, res) => {
  const userCount = await db.getUserCount()
  const nodeCount = await bitcoin.getNodeCount()
  const blockCount = await bitcoin.getBlockCount()

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
      userCount,
      blockCount,
      nodeCount: nodeCount + 1, // add 1 for the node itself
      blocks: blocksInfo
    }
  })
})

export default router
