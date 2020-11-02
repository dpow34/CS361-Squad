let submitButton = $("#zipSubmit");

submitButton.click(function()
{
    Cookies.set("zipCode", $("#userZipInput").val())
})