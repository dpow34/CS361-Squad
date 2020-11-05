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
        const element = tableRows[i];
        element.style.display = "";
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
            element.style.display = ""
        }
    }
    
}

function getDesiredMood()
{
    if ($("#easyAndChill").is(":checked"))
    {
        return 1;
    }
    else if (($("#matchFitness").is(":checked")))
    {
        return 2;
    }
    else if (($("#challengeMe").is(":checked")))
    {
        return 3;
    }
    else
    {
        return null;
    }
}