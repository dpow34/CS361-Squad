let submitButton = $("#zipSubmit");

submitButton.click(function()
{
    Cookies.set("zipCode", $("#userZipInput").val())
})

window.onload = function() {
	document.getElementById("navbarItems").children[0].classList.add("active")
}