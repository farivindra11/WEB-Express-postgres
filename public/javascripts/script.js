
const API_URL = 'http://localhost:3000/api/'

$(document).ready(() => {
  loadData();

  $('.btn-add').on('click', '.btn-save', function () {
    let string = $('#addString').val();
    let integer = $('#addInteger').val();
    let float = $('#addFloat').val();
    let date = $('#addDate').val();
    let boolean = $('#addBoolean').val();
    addData(string, integer, float, date, boolean);
  })

  $('table tbody').on('click', '.btn-delete', function () {
    deleteData($(this).attr('dataid'));
  })

  $('table tbody').on('click', '.btn-edit', function () {
    console.log(this);
    dataModal($(this).attr('dataid'));
  }); 

  $('.btn-edit').on('click', '.btn-change', function () {
    let id = $('#editId').val();
    let string = $('#editString').val();
    let integer = $('#editInteger').val();
    let float = $('#editFloat').val();
    let date = $('#editDate').val();
    let boolean = $('#editBoolean').val();
    editData(id, string, integer, float, date, boolean);
  })

});


const loadData = () => {
  $.ajax({
    method: "GET",
    url: `${API_URL}bread`
  })
    .done(function (data) {
      let html = '';
      data.forEach(item => {
        html += ` <tr>
            <td>${item.id}</td>
            <td>${item.string}</td>
            <td>${item.integer}</td>
            <td>${item.float}</td>
            <td>${moment(item.date).format('YYYY-MM-DD')}</td>
            <td>${item.boolean}</td>
            <td>
            <button type="button" class="btn btn-success btn-edit" dataid="${item.id}" data-toggle="modal" data-target="#editModal"> Edit </button>
            <button type="button" class="btn btn-danger btn-delete" dataid="${item.id}"> Delete </button>
            </td>
          </tr>`
      })
      $('table tbody').html(html)
    })

    .fail(function (jqXHR, textStatus) {
      alert("Request failed: " + textStatus);
    });
}

const addData = (string, integer, float, date, boolean) => {
  $.ajax({
    method: "POST",
    url: `${API_URL}bread`,
    data: { string, integer, float, date, boolean },
    dataType: 'json'
  }).done(() => {
    loadData();
  })
    .fail((err) => {
      console.log("gagal-add")
    });
  $('#addForm').trigger('reset');
}

const deleteData = (id) => {
  $.ajax({
    method: "DELETE",
    url: `${API_URL}bread/${id}`,
  })
    .done(() => {
      loadData();
    })
    .fail((err) => {
      console.log('error delete');
    })
}

const editData = (id, string, integer, float, date, boolean) => {
  $.ajax({
    method: "PUT",
    url: `${API_URL}bread/${id}`,
    data: { string, integer, float, date, boolean },
    dataType: 'json'
  }).done(() => {
    loadData();
  })
    .fail((err) => {
      console.log("Failed")
    });
}

// GET edit, show data in edit-modal 
const dataModal = id => {
  $.ajax({
    method: 'GET',
    url: `${API_URL}bread/${id}`,
    dataType: 'json'
  })
    .done(result => {
      // console.log(result);
      let html = '';
      let item = result.data;
      $('#editId').val(item.id);
      $('#editString').val(item.string);
      $('#editInteger').val(item.integer);
      $('#editFloat').val(item.float);
      $('#editDate').val(moment(item.date).format('YYYY-MM-DD'));

      if (item.boolean == true) {
        html += `<option value="true" selected>true</option>
                          <option value="false">false</option>`;
      } else {
        html += `<option value="false" selected>false</option>
              <option value="true">true</option>`;
      };
      $('#editBoolean').html(html);
    })
    .fail(() => {
      console.log('edit-data gagal');
    })

};  