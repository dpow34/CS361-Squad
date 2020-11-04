function openMapTab(latitude, longitude)
{
    let mapsQuery = "https://www.google.com/maps?q=" + latitude + "," + longitude;
    window.open(mapsQuery, "_blank");
}

function clearTable()
{
    $("#trailTable").empty();
}

function addTrailsToTable(trails)
{
    trails.forEach(element => {
        console.log(element);
    });
}