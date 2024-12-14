const url = 'https://api.thecatapi.com/v1/images/search?limit=10'

async function getApi() {
    const response = await fetch(url);
    if (response.status === 200) {
        const data = await response.json();
        console.log(data);
    }
}

chamarApi();
