import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import chat from './chat'
import books from './books'
import { showRoutes } from 'hono/dev'
import { HTTPException } from 'hono/http-exception'
const app = new Hono()
app.use(etag(), logger())

app.route('/chat', chat)
app.route('/books', books)

app.onError((err, c) => {
  console.error(`${err}`)
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      error: err.message,
      code: err.status
    }, err.status)
  } else {
    return c.json({
      success: false,
      error: "未知错误",
      code: 500
    }, 500)
  }
})
showRoutes(app, {
  verbose: true,
})
export default app
