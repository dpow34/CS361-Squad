document.addEventListener("DOMContentLoaded", setupConnections);

function setupConnections()
{
    addItemByDoubleClick();
}

function addItemByDoubleClick()
{
    // Set up the double click function to add item to repair
    var item_picker = document.getElementById('input_item');
    var item_field = document.getElementById('input_sale_items');
    item_picker.ondblclick = function()
    {
        let item_data = {"name":this.options[this.selectedIndex].text, "id":this.options[this.selectedIndex].value}
        if (item_field.textContent != "")
        {
            item_field.textContent += ", "+item_data.id;
        }
        else
        {
            item_field.textContent += item_data.id;
        }
    };
}

function searchSales() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search_input");
  filter = input.value.toUpperCase();
  table = document.getElementById("searchTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function editSale(id)
{
    location.href = window.location.href + "/" + id;
}

function deleteSale(id)
{
    $.ajax(
    {
        url: '/sales/' + id,
        type : 'DELETE',
        success: function(result)
        {
            window.location.reload(true);
        }
    })
}
