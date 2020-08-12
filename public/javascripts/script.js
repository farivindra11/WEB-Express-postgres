
const API_URL = 'http://localhost:3000/api/'

$(document).ready(() => {
  loadData();

  $('nav').on('click', 'li', function (e) {
    e.preventDefault();
    $('#page').val($(this).attr('pageid'));
    loadData();
})

$('#searchForm').submit(function (e) {
    e.preventDefault();
    $('#page').val(1);
    loadData();
});

$('#reset').on('click', function (e) {
    loadData();
})

  $('.btn-add').on('click', '.btn-save', function (event) {
    let string = $('#addString').val();
    let integer = $('#addInteger').val();
    let float = $('#addFloat').val();
    let date = $('#addDate').val();
    let boolean = $('#addBoolean').val();
    addData(string, integer, float, date, boolean);
  })

  $('table tbody').on('click', '.btn-delete', function (event) {
    deleteData($(this).attr('dataid'));
  })

  $('table tbody').on('click', '.btn-edit', function (event) {
    // console.log(this);
    dataModal($(this).attr('dataid'));
  }); 

  $('.btn-edit').on('click', '.btn-change', function (event) {
    let id = $('#editId').val();
    let string = $('#editString').val();
    let integer = $('#editInteger').val();
    let float = $('#editFloat').val();
    let date = $('#editDate').val();
    let boolean = $('#editBoolean').val();
    editData(id, string, integer, float, date, boolean);
  })

});


//jquery ajax
const loadData = () => {

    let page = $('#page').val();
    let id = $('#id').val();
    let integer = $('#integer').val();
    let string = $('#string').val();
    let float = $('#float').val();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let boolean = $('#boolean').val();
    let cId = $("input[type=checkbox][name=checkId]:checked").val();
    let cInteger = $("input[type=checkbox][name=checkInteger]:checked").val();
    let cString = $("input[type=checkbox][name=checkString]:checked").val();
    let cFloat = $("input[type=checkbox][name=checkFloat]:checked").val();
    let cDate = $("input[type=checkbox][name=checkDate]:checked").val();
    let cBoolean = $("input[type=checkbox][name=checkBoolean]:checked").val();

  $.ajax({
    method: "GET",
    url: `${API_URL}bread`,
    data: { page, id, string, integer, float, startDate, endDate, boolean, cId, cString, cFloat, cInteger, cDate, cBoolean },
    dataType: 'json'
  }).done(result => {

    const data = result.data;
        let page = result.page;
        let pages = result.pages;
        let html = "";
        let pagination = "";
      // console.log(`this page ${result.page}/ this pages ${result.pages}`)
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
        });
        if (page == 1) {
            pagination += `<li class="page-item prevoius disabled" pageid="${page - 1}"><a class="page-link" href="#">Previous</a></li>\n`;
        } else {
            pagination += `<li class="page-item previous" pageid=${page - 1}><a class="page-link" href="#">Previous</a></li>\n`;
        }
        for (i = 1; i <= pages; i++) {
            if (i == page) {
                pagination += `<li class="page-item active" pageid="${i}"><a class="page-link" href="#">${i}</a></li>\n`;
            } else {
                pagination += `<li class="page-item" pageid="${i}"><a class="page-link" href="#">${i}</a></li>\n`;
            }
        }

        if (page == parseInt(pages)) {
            pagination += `<li class="page-item next disabled" pageid="${page + 1}"><a class="page-link" href="#">Next</a></li>\n`;
        } else {
            pagination += `<li class="page-item next" pageid=${page + 1}><a class="page-link" href="#">Next</a></li>\n`;
        }

        $("table tbody").html(html);
        $('nav ul').html(pagination);
    })
        .fail(function (err) {
            $("#notFoundModal").modal('show');
            console.log('Data yang diminta tidak ditemukan')
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
      console.log('edit-data failed');
    })

};  