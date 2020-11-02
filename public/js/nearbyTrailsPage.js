function openMapTab(latitude, longitude)
{
    let mapsQuery = "https://www.google.com/maps?q=" + latitude + "," + longitude;
    window.open(mapsQuery, "_blank");
}