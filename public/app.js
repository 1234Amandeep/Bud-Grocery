// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const grocery = document.getElementById('grocery')
const form = document.querySelector('.grocery-form')
const submitBtn = document.querySelector('.submit-btn')
const groceryContainer = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editFlag = false
let editId = ''
let editElement;
// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem)
clearBtn.addEventListener('click', clearItems)
// ****** FUNCTIONS **********
function addItem(e)
{

  e.preventDefault()

  
  const id = new Date().getTime()
  const value = grocery.value
  
  // *******************


  if(value && !editFlag)
  {
    const element = document.createElement('article')
    element.classList.add('grocery-item')
    const attr = document.createAttribute('data-id')
    attr.value = id
    element.setAttributeNode(attr)

    
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
    <button class="edit-btn" type="button">
    <i class="fas fa-edit"></i>
    </button>
    <button class="delete-btn" type="button">
    <i class="fas fa-trash"></i>
    </button>
    </div>`
            const deleteBtn = element.querySelector('.delete-btn')
            const editBtn = element.querySelector('.edit-btn')
            
            deleteBtn.addEventListener('click', deleteItem)
            editBtn.addEventListener('click', editItem)
            list.appendChild(element)
            displayAlert('Item has been added to the list', 'success')
            groceryContainer.classList.add('show-container')
            addToDatabase(value, id)
            setBackToDefault()
  }
  else if(value && editFlag)
  {
    editElement.firstChild.innerText = value
    displayAlert('Item has been edited', 'success')
    editFromDatabase(editId, value)
    setBackToDefault()
  }
  else
  {
    displayAlert('Please enter some value.', 'danger')
  }
}
// ****** display alert
function displayAlert(msg, action)
{
  alert.innerText = msg
  alert.classList.add(`alert-${action}`)

  setTimeout(() => {
    alert.innerText = ''
    alert.classList.remove(`alert-${action}`)
  }, 800)
}

// edit item
function editItem(e)
{
  submitBtn.innerText = 'edit'
  editId = e.currentTarget.parentElement.parentElement.dataset.id
  editElement = e.currentTarget.parentElement.parentElement
  const editableItemValue = e.currentTarget.parentElement.parentElement.firstChild.innerText
  editFlag = true
  grocery.value = editableItemValue.toLowerCase()
}
// delete item
function deleteItem(e)
{
  const deletableItem = e.currentTarget.parentElement.parentElement;
  const dId = e.currentTarget.parentElement.parentElement.dataset.id
  list.removeChild(deletableItem)
  displayAlert('Item has been removed', 'danger')
  if(list.children.length === 0)
  {
    groceryContainer.classList.remove('show-container')
  }

  removeFromDatabase(dId)
}
// clear all items
function clearItems()
{
  const items = document.querySelectorAll('.grocery-item')

  items.forEach((item) => {
    list.removeChild(item)
  })
  groceryContainer.classList.remove('show-container')
  displayAlert('empty list', 'danger')
  clearAllFromDatabase()
}
// ****** set back to default
function setBackToDefault()
{
  grocery.value = ''
  submitBtn.innerText = 'submit'
  editFlag = false
}

// ****** SETUP ITEMS **********



async function addToDatabase(item, pk)
{
  const data = { pk, item }
  const post = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch('/api/add', post)
  const resdata = await response.json();

  console.log(resdata);
}

async function removeFromDatabase(pk)
{
  const data = { pk }
  const post = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  
  const response = await fetch('/api/remove', post)
  const resdata = await response.json()
  
  console.log(resdata);
}

async function clearAllFromDatabase()
{
  const data = { something: "how are you Mr. server" }
  const post = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const response = await fetch('/api/clearall', post)
  const resdata = await response.json()
  console.log(resdata);
}

async function editFromDatabase(id, value)
{
  const data = { id, value }
  const post = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  const resposne = await fetch('/api/edit', post)
  const resdata = await resposne.json()
  
  console.log(resdata);
}

async function getDB()
{
  const response = await fetch('/api')
  const data = await response.json()

const condition = data.length
  const items = data
  if(condition != 0)
  {
    items.forEach((item) => {
        const element = document.createElement('article')
        element.classList.add('grocery-item')
        const attr = document.createAttribute('data-id')
        attr.value = item.pk
        element.setAttributeNode(attr)

        element.innerHTML = `<p class="title">${item.item}</p>
        <div class="btn-container">
        <button class="edit-btn" type="button">
        <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" type="button">
        <i class="fas fa-trash"></i>
        </button>
        </div>`
        const deleteBtn = element.querySelector('.delete-btn')
        const editBtn = element.querySelector('.edit-btn')
            
        deleteBtn.addEventListener('click', deleteItem)
        editBtn.addEventListener('click', editItem)
        list.appendChild(element)
        displayAlert('Saved items', 'success')
        groceryContainer.classList.add('show-container')
    })
  }
  else
  {
    displayAlert('')
  }
}

window.addEventListener('DOMContentLoaded', () => {
  getDB()
})

















