const assert = require('node:assert/strict')
const http = require('node:http')
const { test } = require('node:test')
const TelegramBot = require('node-telegram-bot-api')
const { DataTypes, Sequelize } = require('sequelize')

test('Telegram requests support forms and multipart uploads', async (t) => {
    const requests = []
    const server = http.createServer((req, res) => {
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => {
            requests.push({
                path: req.url,
                contentType: req.headers['content-type'],
                body: Buffer.concat(chunks).toString()
            })
            res.writeHead(200, { 'content-type': 'application/json' })
            res.end(JSON.stringify({ ok: true, result: { message_id: 1 } }))
        })
    })
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    t.after(() => new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve())))

    const bot = new TelegramBot('test-token', { baseApiUrl: `http://127.0.0.1:${server.address().port}` })
    await bot.sendMessage(123, 'hello', { parse_mode: 'HTML' })
    await bot.sendPhoto(123, 'https://example.com/image.jpg', { caption: 'photo' })
    await bot.sendDocument(123, Buffer.from('backup contents'), { caption: 'backup' }, {
        filename: 'backup.txt',
        contentType: 'text/plain'
    })

    assert.equal(requests.length, 3)
    assert.equal(requests[0].path, '/bottest-token/sendMessage')
    assert.equal(new URLSearchParams(requests[0].body).get('text'), 'hello')
    const photoUrl = new URL(requests[1].path, 'http://localhost')
    assert.equal(photoUrl.pathname, '/bottest-token/sendPhoto')
    assert.equal(photoUrl.searchParams.get('photo'), 'https://example.com/image.jpg')
    assert.equal(new URL(requests[2].path, 'http://localhost').pathname, '/bottest-token/sendDocument')
    assert.match(requests[2].contentType, /^multipart\/form-data;/)
    assert.match(requests[2].body, /filename="backup\.txt"/)
    assert.match(requests[2].body, /backup contents/)
})

test('Sequelize supports SQLite operations and UUID defaults', async (t) => {
    const sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false })
    t.after(() => sequelize.close())
    const Item = sequelize.define('Item', {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        legacyId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1 },
        name: DataTypes.STRING
    })
    await sequelize.sync()
    const item = await sequelize.transaction(transaction => Item.create({ name: 'test' }, { transaction }))
    const saved = await Item.findByPk(item.id)
    assert.match(saved.id, /^[0-9a-f-]{36}$/)
    assert.match(saved.legacyId, /^[0-9a-f-]{36}$/)
    assert.equal(saved.name, 'test')
})
