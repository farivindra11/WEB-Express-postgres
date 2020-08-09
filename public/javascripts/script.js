
const API_URL = 'http://localhost:3000/api/'

$(document).ready(() => {
  loadData();
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
              <a href="#" class="btn btn-success">Edit</a>
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
