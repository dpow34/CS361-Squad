document.addEventListener("DOMContentLoaded", setupConnections);

function setupConnections()
{
    addItemByDoubleClick();
}

function addItemByDoubleClick()
{
    // Set up the double click function to add item to repair
    var item_picker = document.getElementById('input_item');
    var item_field = document.getElementById('input_repair_items');
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

function editRepair(id)
{
    location.href = window.location.href + "/" + id;
}

function deleteRepair(id)
{
    $.ajax(
    {
        url: '/repairs/' + id,
        type : 'DELETE',
        success: function(result)
        {
            window.location.reload(true);
        }
    })
}
