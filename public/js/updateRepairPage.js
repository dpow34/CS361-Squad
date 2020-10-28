function updateRepair(id)
{
    let page_data = {};
    // build an array of item quantites and repairDetails_ids from the table
    item_quantity_array = [];
    repair_details_ID_array = [];
    $("tr.item").each(function(){
        item_quantity_array.push($(this).find("input.item_quantity").val());
        repair_details_ID_array.push($(this).find("input.repair_details_ID").val());
    })
    // state=jaime&input_date_completed=2011-08-26&zip_code=adsa%3Bld&phone=
    page_data = $('#update-repair').serialize();
    x = "&notes="+encodeURIComponent($("#notes").val());
    page_data += x;
    page_data += "&item_quantity_array="+encodeURIComponent(JSON.stringify(item_quantity_array));
    page_data += "&repair_details_ID_array="+encodeURIComponent(JSON.stringify(repair_details_ID_array));
    // console.log(x);
    
    $.ajax(
        {
            url: '/repairs/' + id,
            type: 'PUT',
            data:page_data,
            success:function(result)
            {
                window.location.replace("./");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("Status: " + textStatus); 
                alert("Error: " + errorThrown); 
            }       
        })
    window.history.back();
}

// console.log("in the update repair page script");