window.onload = function()
{
    renderAllTrails();
}

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