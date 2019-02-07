const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')


app.use(bodyParser.json())

app.use('/assets', express.static(path.resolve(__dirname, 'assets')))

let urvilData = ""
let otherData = {}

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.post('/putdata/:user', (req, res) => {
	if(req.params.user == 'urvil') {
		// data coming from urvil
		urvilData = req.body.data
	} else {
		otherData[req.params.user] = req.body.data
	}
	res.send({ status: 'ok' })
})

app.post('/getdata/:user', (req, res) => {
	if(req.params.user === 'urvil') {
		// sent from other guys
		res.json({ status: 'ok', data: urvilData })
	} else {
		// requested by urvil
		const keys = Object.keys(otherData)
		let string = ''
		keys.forEach(key => {
			string += key + ' - ' + otherData[key] + '\n\n'
		})
		res.json({
			status: 'ok',
			data: string
		})
	}
})

app.listen(80, '0.0.0.0', _ => _)