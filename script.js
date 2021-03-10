const start = async () => {
    try {
        const response = await fetch("https://covid.ourworldindata.org/data/owid-covid-data.json");
        const dataBefore = await response.json();
        const dataDelete = await function() {
            Object.keys(dataBefore).forEach(key => {
                let dataRemoval = dataBefore[key].data.length - 1;
                if (!dataBefore[key].data[dataRemoval].people_fully_vaccinated && !dataBefore[key].data[dataRemoval].people_vaccinated) {
                    delete dataBefore[key]
                }
              });
        }
        dataDelete();
        createCountryList(dataBefore)
        console.log(dataBefore)
    } catch(e) {
        console.log("Unable to fetch the data.")
    }
}

start();

const createCountryList = countryList => {

    document.getElementById("countries").innerHTML = `
    <select onchange="getData(this.value)">
                <option>Choose a country</option>
                ${Object.keys(countryList).map(function(country){
                    return `<option value="${country}">${countryList[country].location}</option>`
                }).join('')}
            </select>
    `
}

const getData = async country => {
    if (country != "Choose a country") {
        const response = await fetch("https://covid.ourworldindata.org/data/owid-covid-data.json");
        const data = await response.json();
        const todayData = (data[country].data.length - 1);
        console.log(todayData);

        let totalVaccinated = data[country].data[todayData].people_fully_vaccinated
        if (totalVaccinated == undefined) {
            totalVaccinated = data[country].data[todayData].people_vaccinated;
        }

        let percentageVaccinated = data[country].data[todayData].people_fully_vaccinated_per_hundred
        if (percentageVaccinated == undefined) {
            percentageVaccinated = data[country].data[todayData].people_vaccinated_per_hundred
        }

        console.log(percentageVaccinated + " percentage vaccinated")
        console.log(totalVaccinated + " people fully vaccinated")
        
        showData(totalVaccinated, percentageVaccinated)
    }
}

const showData = (totalVaccinated, percentageVaccinated) => {
    document.getElementById("vaccination").innerHTML = totalVaccinated + " " + percentageVaccinated;
}