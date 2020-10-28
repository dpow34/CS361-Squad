function editRepair(id)
{
    location.href = window.location.href + "/" + id;
}

function deleteItem(id)
{
    $.ajax(
    {	
        url: '/items/' + id,
        type : 'DELETE',
        success: function(result)
        {
            window.location.reload(true);
        }
    })
}