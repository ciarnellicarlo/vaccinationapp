//Importing the countries

const start = async () => {
    try {
        const response = await fetch("https://covid.ourworldindata.org/data/owid-covid-data.json");
        const dataBefore = await response.json();

        //Deleting countries that do not have recent data

        const dataDelete = await function() {
            console.log (dataBefore)
            Object.keys(dataBefore).forEach(item => {
                if (dataBefore[item].data.length <= 5) {
                    delete dataBefore[item]
                }  else {
                    let checkTodayData = dataBefore[item].data.length - 1;
                    let checkYesterdayData = dataBefore[item].data.length - 2;
                    if (!dataBefore[item].data[checkTodayData].people_fully_vaccinated && !dataBefore[item].data[checkTodayData].people_vaccinated && !dataBefore[item].data[checkYesterdayData].people_fully_vaccinated && !dataBefore[item].data[checkYesterdayData].people_vaccinated) {
                        delete dataBefore[item]
                    }
                }
              });
        }
        dataDelete();
        createCountryList(dataBefore)
        console.log(dataBefore)
    } catch(e) {
        console.log(e)
    }
    
}

start();

//Creating the option list

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

//Importing the data

const getData = async country => {
    if (country != "Choose a country") {
        const response = await fetch("https://covid.ourworldindata.org/data/owid-covid-data.json");
        const data = await response.json();
        let todayData = (data[country].data.length - 1);
        console.log(todayData);

        let totalVaccinated = data[country].data[todayData].people_fully_vaccinated
        if (totalVaccinated == undefined) {
            totalVaccinated = data[country].data[todayData].people_vaccinated
            if (totalVaccinated == undefined) {
                todayData--;
                totalVaccinated = data[country].data[todayData].people_fully_vaccinated;
                if (totalVaccinated == undefined) {
                    totalVaccinated = data[country].data[todayData].people_vaccinated;
                }
            }
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

//Showing the data

const showData = (totalVaccinated, percentageVaccinated) => {
    document.getElementById("vaccination").style.display = "flex"
    document.getElementById("total").innerHTML = "<span>" + totalVaccinated + "</span> People have been vaccinated ";
    document.getElementById("percentage").innerHTML = "which equates to " + "<span>" + percentageVaccinated + "%</span>" + " of the population";
    document.getElementById("bar").style.height = percentageVaccinated + "vh";
}