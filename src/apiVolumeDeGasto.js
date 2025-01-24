const url = "http://www.randomnumberapi.com/api/v1.0/randomnumber";

async function getApi() {
    const response = await fetch(url);
    const data = await response.json();
    const number = await data[0];

    return {
        number,
    }
}

getApi();

console.log(number + 5)


