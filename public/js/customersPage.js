function deleteCustomer(id)
{
    $.ajax(
    {
        url: '/customers/' + id,
        type : 'DELETE',
        success: function(result)
        {
            window.location.reload(true);
        }
    })
}

function editCustomer(id)
{
    console.log("in customer edit");
    location.href = window.location.href + "/" + id;
}
