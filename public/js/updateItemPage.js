function updateItem(id)
{
    $.ajax(
        {
            url: '/items/' + id,
            type: 'PUT',
            data:$('#update-item').serialize(),
            success:function(result)
            {
                window.location.replace("./");
            }
        })
}
console.log("in the update item page script")