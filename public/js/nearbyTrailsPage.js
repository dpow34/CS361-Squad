window.onload = function()
{
    renderAllTrails();
}

const RelativeDifficulty = {"EasyAndChill":1, "MatchMyFitness":2, "ChallengeMe":3};


function openMapTab(latitude, longitude)
{
    let mapsQuery = "https://www.google.com/maps?q=" + latitude + "," + longitude;
    window.open(mapsQuery, "_blank");
}

function clearTable()
{
    $("#trailsTable").empty();
}

function renderAllTrails()
{
    let tableRows = $('#trailsTable > tbody > tr');

    for (let i = 0; i < tableRows.length; i++)
    {
        tableRows[i].style.display = "";
        if (i%2 == 0)
        {
            tableRows[i].classList = ["table-active"];
        }
        else
        {
            tableRows[i].classList = [];
        }
    }
}

function sortTrails()
{
    let desiredMood = getDesiredMood()
    if (desiredMood == null)
    {
        renderAllTrails();
        return;
    }

    let renderedTrails = 0;
    let tableRows = $('#trailsTable > tbody > tr');

    for (let i = 0; i < tableRows.length; i++)
    {
        const element = tableRows[i];
        // last column with relDiff is hidden
        if (element.lastElementChild.innerHTML != desiredMood)
        {
            element.style.display = "none"
        }
        else
        {
            element.style.display = "table-row";
            if (renderedTrails%2 == 0)
            {
                tableRows[i].classList = ["table-active"];
            }
            else
            {
                tableRows[i].classList = [];
            }
            renderedTrails++;
        }
    }

}

function getDesiredMood()
{
    if ($("#easyAndChill").is(":checked"))
    {
        return RelativeDifficulty.EasyAndChill;
    }
    else if (($("#matchFitness").is(":checked")))
    {
        return RelativeDifficulty.MatchMyFitness;
    }
    else if (($("#challengeMe").is(":checked")))
    {
        return RelativeDifficulty.ChallengeMe;
    }
    else
    {
        return null;
    }
}

// functions and event listeners to create mutually exclusive checkboxes
document.getElementById("easyAndChill").onchange = clickEasyAndChill;
document.getElementById("matchFitness").onchange = clickMatchFitness;
document.getElementById("challengeMe").onchange = clickChallengeMe;
function clickEasyAndChill() {
    if (document.getElementById("matchFitness").checked) {
            document.getElementById("matchFitness").checked = false;
    }
    if (document.getElementById("challengeMe").checked) {
        document.getElementById("challengeMe").checked = false;
    }
}

function clickMatchFitness() {
    if (document.getElementById("easyAndChill").checked) {
            document.getElementById("easyAndChill").checked = false;
    }
    if (document.getElementById("challengeMe").checked) {
        document.getElementById("challengeMe").checked = false;
    }
}

function clickChallengeMe() {
    if (document.getElementById("matchFitness").checked) {
            document.getElementById("matchFitness").checked = false;
    }
    if (document.getElementById("easyAndChill").checked) {
        document.getElementById("easyAndChill").checked = false;
    }
}

function hideOptions() {
    var hideModalBody = document.getElementById("checkboxes");
    if (hideModalBody.style.display === "none") {
        hideModalBody.style.display = "block";
    } else {
        hideModalBody.style.display = "none";
    }

    var toggleOnOff = document.getElementById("switchMe");
    if (toggleOnOff.value == "On") {
        toggleOnOff.value = "Off";
    } else {
        toggleOnOff.value = "On";
    }
}