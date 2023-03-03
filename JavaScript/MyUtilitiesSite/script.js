"use strict";

const citiesList = [
    "Torino",
    "Milano",
    "Venezia",
    "Firenze",
    "Roma",
    "Napoli",
    "Palermo",
];

const apiKey = "226fd001f12815c8782b631a657f2c7d";
const countryCode = "it-IT";
const units = "metric";

const tboxLocation = $("#tbox-location");
const h2FindErrors = $("#findErrors");

let selectedCity = "";

var autocomplete = $("#cities-autocomplete").kendoAutoComplete({
    dataSource: citiesList,
    fillMode: "flat",
    filter: "startswith",
    placeholder: "Seleziona una città...",
}).data("kendoAutoComplete");

var editButton = $("#find-button").kendoButton({
    click: onEditButtonClick,
    icon: "search",
}).data("kendoButton");


function onEditButtonClick(e) {
    selectedCity = autocomplete.value();

    $.ajax({
        type: "POST",
        url: `//api.openweathermap.org/data/2.5/weather?q=${selectedCity}&lang=it&appid=${apiKey}&units=${units}`,
        dataType: "json",
        success: (innerResult, innerStatus, innerXhr) => {
            let actualConditions = innerResult.weather[0].description;          // descrizione dello stato attuale del meteo (broken clouds, ...)
            let actualTemperature = innerResult.main.temp;                      // temperatura
            let actualHumidity = innerResult.main.humidity;                     // umidita

            let icon = innerResult.weather[0].icon;                             // icona rappresentante lo stato attuale del meteo
            let srcImg = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            buildConditionsParagraph(actualConditions);
            buildTemperatureParagraph(actualTemperature.toFixed(1));
            buildHumidityParagraph(actualHumidity);


            $("#img").attr("src", srcImg);
            $('#img').removeAttr("hidden");

        }, error: (innerXhr, innerStatus, innerError) => {
            alert(`Non è stata trovata alcuna città corrispondente a '${selectedCity}'`);
        }
    });
}

function buildConditionsParagraph(actualConditions) {
    $("#pConditions").empty();
    $("#pConditions").append(`Condizioni attuali a <strong>${selectedCity}</strong>: <strong>${actualConditions}</strong>`);
    $("#pConditions").attr("hidden", false);
}

function buildTemperatureParagraph(actualTemperature) {
    $("#pTemperature").empty();
    $("#pTemperature").append(`Temperatura: <strong>${actualTemperature}</strong>°`);
    $("#pTemperature").attr("hidden", false);
}

function buildHumidityParagraph(actualHumidity) {
    $("#pHumidity").empty();
    $("#pHumidity").append(`Umidità: <strong>${actualHumidity}</strong>%`);
    $("#pHumidity").attr("hidden", false);
}