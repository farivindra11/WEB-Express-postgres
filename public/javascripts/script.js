
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

})


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
            <button type="button" class="btn btn-success" data-toggle="modal" data-target="#editModal">Edit</button>

              <a href="#" class="btn btn-danger">Delete</a>
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
