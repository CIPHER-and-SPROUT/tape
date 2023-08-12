import { createCors, error, json, Router } from 'itty-router'

import type { Env } from './types'
import getNfts from './getNfts'

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
})

const router = Router()

router.all('*', preflight)
router.get('/', () => new Response('gm 👋'))
router.get('/:handle/:limit/:cursor?', ({ params }, env) =>
  getNfts(env, params.handle, params.limit)
)

const routerHandleStack = (request: Request, env: Env, ctx: ExecutionContext) =>
  router.handle(request, env, ctx).then(json)

const handleFetch = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => {
  try {
    return await routerHandleStack(request, env, ctx)
  } catch {
    return error(500)
  }
}

export default {
  fetch: (request: Request, env: Env, context: ExecutionContext) =>
    handleFetch(request, env, context).then(corsify)
}
