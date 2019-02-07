const dialogs = require('dialogs')();
console.dir(dialogs)
function confirmP(title) {
	return new Promise((resolve, reject) => {
		dialogs.confirm(title, function(ok) {
			resolve(ok)
		})
	})
}

function alertP(title) {
	return new Promise((resolve, reject) => {
		dialogs.alert(title, function(ok) {
			resolve(ok)
		})
	})
}

function promptP(title) {
	return new Promise((resolve, reject) => {
		dialogs.prompt(title, null, function(text) {
			resolve(text)
		})
	})
}

(async () => {

const password = await promptP('Enter system password')

if(password !== 'urvil10cg') {
	throw new Error("Unauthorized")
}

const urvilMode = await confirmP('Urvil?')
const otherGuy = !urvilMode ? await promptP('your name?') : null
const ip = await promptP('Enter (169.254.x.x)') || 'localhost'

console.log(urvilMode, ip)

if(ip.split('.').length !== 4 && ip !== 'localhost') {
	await alertP('incorrect. restart app')
	throw new Error(999)
}


const slides = document.getElementById('slides')
for (let i = 1; i < 67; i++) {
	const img = document.createElement('img')
	img.src = `./images/${i.toString().padStart(2, '0')}.jpg`
	slides.appendChild(img)
}

const taUrvil = document.getElementById('urvil-says')
const taSelf = document.getElementById('xxx-says-dup')
const taXXX = document.getElementById('xxx-says')

if(urvilMode) {
	taUrvil.disabled = false
	taUrvil.onkeyup = async function (e) {
		try {
			const data = e.target.value
			await (await fetch(`http://${ip}/putdata/urvil`, { method: 'POST', body: JSON.stringify({ data }), headers: { 'Content-Type': 'application/json' } })).json()
		} catch(error) {

		}
	}

	setInterval(async () => {
		try {
		const data = await fetch(`http://${ip}/getdata/noturvil`, { method: 'POST', headers: { 'Content-Type': 'application/json' }})
		taXXX.value = (await data.json()).data
		} catch(error) {

		}
	}, 500)

} else {
	taXXX.disabled = false

	taXXX.onkeyup = async function (e) {
		try {
			const data = e.target.value
			await (await fetch(`http://${ip}/putdata/${otherGuy}`, { method: 'POST', body: JSON.stringify({ data }), headers: { 'Content-Type': 'application/json' } })).json()
		} catch(error) {

		}
	}

	setInterval(async () => {
		try {
			const data = await fetch(`http://${ip}/getdata/urvil`, { method: 'POST', headers: { 'Content-Type': 'application/json' }})
			taUrvil.value = (await data.json()).data
		} catch(error) {

		}
	}, 500)

	setInterval(async () => {
		try {
			const data = await fetch(`http://${ip}/getdata/noturvil`, { method: 'POST', headers: { 'Content-Type': 'application/json' }})
			taSelf.value = (await data.json()).data
		} catch(error) {
			
		}
	}, 500)
}

})();