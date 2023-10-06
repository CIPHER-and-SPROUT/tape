import { createData, EthereumSigner } from '../irys'

export interface Env {
  WALLET_PRIVATE_KEY: string
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

const handleRequest = async (request: Request, env: Env) => {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Only POST requests are supported'
      }),
      {
        headers
      }
    )
  }

  const payload = await request.json()

  if (!payload) {
    return new Response(
      JSON.stringify({ success: false, message: 'No body provided' }),
      { headers }
    )
  }

  try {
    const signer = new EthereumSigner(env.WALLET_PRIVATE_KEY)
    const tx = createData(JSON.stringify(payload), signer, {
      tags: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'Tape' }
      ]
    })
    await tx.sign(signer)
    const irysRes = await fetch('http://node2.irys.xyz/tx/matic', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: tx.getRaw()
    })

    if (irysRes.statusText === 'Created' || irysRes.statusText === 'OK') {
      return new Response(
        JSON.stringify({
          success: true,
          id: tx.id,
          url: `ar://${tx.id}`
        }),
        {
          headers
        }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Something went wrong!',
          irysRes
        }),
        {
          headers
        }
      )
    }
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Something went wrong!' }),
      { headers }
    )
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await handleRequest(request, env)
  }
}
