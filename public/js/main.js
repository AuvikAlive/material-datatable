var data = []
var editing = false

fetch('/api/exercises')
  .then(response => response.json())
  .then(serverData => {
    data = serverData
    renderTableRows()
  })
  .catch(e => console.log(e))

function renderTableRows() {
  let tbody = ''

  data.forEach((row, index) => {
    tbody += `
    <tr id=row${row.id}>
      <td>${row.name}</td>
      <td>${row.reps}</td>
      <td>${row.weight}</td>
      <td>${row.date}</td>
      <td>${row.lbs}</td>
      <td>
        <button class="mui-btn mui-btn--raised mui-btn--primary edit_buttons" id=${'edit_button' +
          row.id} onclick="editRow(${row.id})">Edit</button>
        <button class="mui-btn mui-btn--raised mui-btn--danger" onclick="deleteRow(${row.id})">Delete</button>
      </td>
    </tr>
  `
  })

  document.getElementById('rows').innerHTML = tbody
}

function editRow(id) {
  var editable = data.filter(el => el.id === id)[0]

  deleteRow(id)

  document
    .querySelectorAll('.edit_buttons')
    .forEach(el => (el.style.display = 'none'))

  document.getElementById('formTitle').innerHTML = 'Edit Entry'
  document.getElementById('name').value = editable.name
  document.getElementById('reps').value = editable.reps
  document.getElementById('weight').value = editable.weight
  document.getElementById('date').value = editable.date
  document.getElementById('lbs').value = editable.lbs
}

function deleteRow(id) {
  var deletedId
  data = data.filter(el => {
    if (el.id === id) {
      deletedId = el._id
      return false
    }

    return true
  })

  fetch(`/api/exercises/${deletedId}`, {
    method: 'delete'
  })
    .then(response => response.json())
    .then(json => {
      console.log(json)
    })

  renderTableRows()
}

function addRow(e) {
  e.preventDefault()
  var name = document.getElementById('name').value
  var reps = document.getElementById('reps').value
  var weight = document.getElementById('weight').value
  var date = document.getElementById('date').value
  var lbs = document.getElementById('lbs').value
  var rowId = data.length + 2

  var rowContent = `
    <td>${name}</td>
    <td>${reps}</td>
    <td>${weight}</td>
    <td>${date}</td>
    <td>${lbs}</td>
    <td>
      <button class="mui-btn mui-btn--raised mui-btn--primary edit_buttons" id="edit_button2" value="Edit" class="edit" onclick="edit_row('2')">Edit</button>
      <button class="mui-btn mui-btn--raised mui-btn--danger" onclick="deleteRow(${rowId})">Delete</button>
    </td>
  `

  var newRow = document.createElement('tr')

  newRow.innerHTML = rowContent

  var rows = document.getElementById('rows')

  document.getElementById('addRowForm').reset()

  var dirty = document.querySelectorAll('.mui--is-not-empty')

  dirty.forEach(el => {
    el.className = ''
  })

  document.getElementById('formTitle').innerHTML = 'Add Exercise'

  var newData = {
    id: rowId,
    name,
    reps,
    weight,
    date,
    lbs
  }

  fetch(`/api/exercises`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newData)
  })
    .then(response => response.json())
    .then(json => {

      newData._id = json._id;

      data.push(newData);

      renderTableRows();

      document
        .querySelectorAll('.edit_buttons')
        .forEach(el => (el.style.display = 'inline'))

    })
}
