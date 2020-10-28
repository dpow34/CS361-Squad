function updateSale(id)
{
    let page_data = {};
    // build an array of item quantites and repairDetails_ids from the table
    item_quantity_array = [];
    sale_details_ID_array = [];
	sale_Item_ID_array = [];
    $("tr.item").each(function(){
        item_quantity_array.push($(this).find("input.item_quantity").val());
        sale_details_ID_array.push($(this).find("input.sale_details_ID").val());
		sale_Item_ID_array.push($(this).find("input.sale_Item_ID").val());
    })
    // state=jaime&input_date_completed=2011-08-26&zip_code=adsa%3Bld&phone=
    page_data = $('#update-sale').serialize();
    page_data += "&item_quantity_array="+encodeURIComponent(JSON.stringify(item_quantity_array));
    page_data += "&sale_details_ID_array="+encodeURIComponent(JSON.stringify(sale_details_ID_array));
	page_data += "&sale_Item_ID_array="+encodeURIComponent(JSON.stringify(sale_Item_ID_array));
    
    
    $.ajax(
        {
            url: '/sales/' + id,
            type: 'PUT',
            data:page_data,
            success:function(result)
            {
                console.log("success")
                window.location.replace("./");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("Status: " + textStatus); 
                alert("Error: " + errorThrown); 
            }       
        })
    window.history.back();
}

 console.log("in the update Sale page script");