'use strict'


const cont = document.querySelector('.container')
const btnControls = document.querySelectorAll('.controls button')
const timerElem = document.querySelector('#timer')
const recordElem = document.getElementById('record')
const modal = document.querySelector('.modal')
const modalRecord = document.querySelector('.modal-record span')
const modalTime = document.querySelector('.modal-time span')
const modalRecordMess = document.querySelector('.new-record-mess')
const modalCloseBtn = document.querySelector('.modal-close-btn')


let allColor = ['red', 'gold', 'lime', 'steelblue', 'purple']
let arrColor = []
let size = 5

let timer = 0
let interval = null
let started = false

let records = JSON.parse(localStorage.getItem('records')) || {}
let record = records[size] ?? null

let startTime = 0


btnControls.forEach(item => {
	item.addEventListener('click', () => {
		size = Number(item.dataset.size)
		createField()
	})
})

modalCloseBtn.addEventListener('click', () => {
	modal.classList.remove('modal-open')
})

function formatTime(ms) {
	let min = Math.floor(ms / 60000)
	let sec = Math.floor((ms % 60000) / 1000)
	let hundred = Math.floor((ms % 1000) / 10)

	return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(hundred).padStart(2, '0')}` 
}

function startTimer() {
	if (started) return

	started = true
	
	startTime = performance.now() - timer

	interval = setInterval(() => {
		timer = performance.now() - startTime
		timerElem.textContent = formatTime(timer) 
	}, 10)
}

function stopTimer() {
	clearInterval(interval)
	started = false
	interval = null
}

function resetTimer() {
	stopTimer()

	timer = 0
	timerElem.textContent = '00:00:00'
}

const createField = () => {
	resetTimer()
	cont.innerHTML = ''
	modalRecordMess.style.display = 'none'

	arrColor = allColor.slice(0, size)

	record = records[size] ?? null

	recordElem.textContent = record ? formatTime(record) : '--:--:--'

	let topRow = document.createElement('div')
	topRow.classList.add('row')
	for (let i = 0; i < size; i++) {
		topRow.innerHTML += `<button class='btn btn-up'> ⬆⬆⬆ </button>`
	}

	cont.appendChild(topRow)

	for (let i = 0; i < size; i++) {
		let row = document.createElement('div')
		row.classList.add('row')
		row.innerHTML = `<button class='btn btn-left'> <<< </button>`

		for (let j = 0; j < size; j++) {
			let block = document.createElement('div')
			block.classList.add('block')
			row.appendChild(block)
		}

		row.innerHTML += `<button class='btn btn-right'> >>> </button>`
		cont.appendChild(row)
	}

	let bottomRow = document.createElement('div')
	bottomRow.classList.add('row')
	for (let i = 0; i < size; i++) {
		bottomRow.innerHTML += `<button class='btn btn-down'> ⬇⬇⬇ </button>`
	}

	cont.appendChild(bottomRow)

	randColors()
	addEvents()
}

function addColors() {
	let row = document.querySelectorAll('.row') 

	row.forEach((item, index) => {
		item.querySelectorAll('.block').forEach((elem, idx) => {
			elem.style.backgroundColor = arrColor[idx]
		})
	})
}


function randColors() {
	let colors = []

	arrColor.forEach(item => {
		for(let i = 0; i < size; i++) {
			colors.push(item)
		}
	})

	for (let i = colors.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		let buff

		buff = colors[i]
		colors[i] = colors[j]
		colors[j] = buff 

		// [colors[i], colors[j]] = [colors[j], colors[i]]

	}

	let blocks = document.querySelectorAll('.block')
	blocks.forEach((item, index) => {
		item.style.backgroundColor = colors[index]
	})
	
}


function addEvents() {
	const btnLeft = document.querySelectorAll('.btn-left')
	const btnRight = document.querySelectorAll('.btn-right')
	const btnUp = document.querySelectorAll('.btn-up')
	const btnDown = document.querySelectorAll('.btn-down')

	for (let i = 0; i < btnLeft.length; i++) {
		btnLeft[i].addEventListener('click', () => {
			moveLeft(i)

		})
	}

	for (let i = 0; i < btnRight.length; i++) {
		btnRight[i].addEventListener('click', () => {
			moveRight(i)
		})
	}

	for (let i = 0; i < btnUp.length; i++) {
		btnUp[i].addEventListener('click', () => {
			moveUp(i)
		})
	}

	for (let i = 0; i < btnDown.length; i++) {
		btnDown[i].addEventListener('click', () => {
			moveDown(i)
		})
	}

}

function moveLeft(index) {
	startTimer()
	let rows = document.querySelectorAll('.row')
	let currentRow = rows[index + 1]
	let blocks = currentRow.querySelectorAll('.block')
	let firstColor = blocks[0].style.backgroundColor

	for (let i = 0; i < blocks.length - 1; i++) {
		blocks[i].style.backgroundColor = blocks[i + 1].style.backgroundColor
	}

	blocks[blocks.length - 1].style.backgroundColor = firstColor
	checkWins()
}

function moveRight(index) {
	startTimer()
	let rows = document.querySelectorAll('.row')
	let currentRow = rows[index + 1]
	let blocks = currentRow.querySelectorAll('.block')
	let lastColor = blocks[blocks.length - 1].style.backgroundColor

	for (let i =  blocks.length - 1; i > 0; i--) {
		blocks[i].style.backgroundColor = blocks[i - 1].style.backgroundColor
	}

	blocks[0].style.backgroundColor = lastColor
	checkWins()
}


function moveUp(index) {
	startTimer()
	let rows = document.querySelectorAll('.row')
	let firstColor = rows[1].querySelectorAll('.block')[index].style.backgroundColor

	for(let i = 1; i < size; i++) {
		let currentBlock = rows[i].querySelectorAll('.block')[index]

		let nextBlock = rows[i + 1].querySelectorAll('.block')[index]

		currentBlock.style.backgroundColor = nextBlock.style.backgroundColor
	}

	rows[size].querySelectorAll('.block')[index].style.backgroundColor = firstColor
	checkWins()
}

function moveDown(index) {
	startTimer()
	let rows = document.querySelectorAll('.row')
	let lastColor = rows[size].querySelectorAll('.block')[index].style.backgroundColor

	for(let i = size; i > 1; i--) {
		let currentBlock = rows[i].querySelectorAll('.block')[index]

		let prevBlock = rows[i - 1].querySelectorAll('.block')[index]

		currentBlock.style.backgroundColor = prevBlock.style.backgroundColor
	}

	rows[1].querySelectorAll('.block')[index].style.backgroundColor = lastColor
	checkWins()
}

function checkWins() {
	let rows = document.querySelectorAll('.row')
	let colors = new Set()

	for (let i = 1; i <= size; i++) {
			
		let blocks = rows[i].querySelectorAll('.block')
		let color = blocks[0].style.backgroundColor

		let flag = true

		for (let j = 1; j < size; j++) {
			if (blocks[j].style.backgroundColor != color) {
				flag = false
				break
			}
		}
		if (flag) colors.add(color)
	}
	
	for (let i = 0; i < size; i++) {
		let color = rows[1].querySelectorAll('.block')[i].style.backgroundColor

		let flag = true

		for(let j = 2; j <= size; j++) {
			if(rows[j].querySelectorAll('.block')[i].style.backgroundColor != color) {
				flag = false
				break
			}
		}
		if (flag) colors.add(color)
	}
	
	if (colors.size == size) {
		stopTimer()
		modalTime.textContent = formatTime(timer)
		modalRecord.textContent = formatTime(record)

		if (record === null || timer < record) {
			record = timer
			records[size] = timer
			modalRecordMess.style.display = 'block'
			
			localStorage.setItem('records', JSON.strigify(records))

			recordElem.textContent = formatTime(record)
		}


		modal.classList.add('modal-open')
		
	}
}


createField()


