'use strict';
// Proper api call: https://api.nps.gov/api/v1/parks?stateCode=nc&api_key=ss3gYGYNRTcLsnKEgaaeQs4iBXMoe6ztWOg2W8mq
const apiKey = 'ss3gYGYNRTcLsnKEgaaeQs4iBXMoe6ztWOg2W8mq'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


function getParks(codes) {
    const codeList = removeSpaces(codes);
    const params = {
        api_key: apiKey,
        stateCode: codeList,
    };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
  .then(response => response.status >= 400 ? Promise.reject(error) : response.json())
  .then(responseJson => responseJson.data.length >= 1 ? displayResults(responseJson,codeList) : Promise.reject('no results found'))
  .catch(error => {
        emptyResults();
        $('.js-results').addClass('hidden');
        $('.js-error-message').append(`Sorry, ${error}. Please try again.<br><br>`);
        }
    );
}

function removeSpaces(val) {
    return val.split(' ').join('');
 }

function emptyResults() {
    $('.js-error-message').empty();
    $('.js-states').empty();
    $('.js-resultcount').empty();
    $('.js-resultList').empty();
}

function displayResults(responseJson,codes) {
    emptyResults();

    $('.js-resultcount').text(`Total Results: ${responseJson.total}`);
    $('.js-states').text(`Searched for: ${codes}`);

    for (let i = 0; i < responseJson.data.length ; i++){
      $('.js-resultList').append(
        `<li class="park-name">${responseJson.data[i].fullName}
            <li class="park-website">Website: ${responseJson.data[i].url}</li>
            <li>${responseJson.data[i].description}</li>
        </li>`
      )};
    $('.js-results').removeClass('hidden');
}

function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    const codes = $('#js-codes').val();
    //TODO const maxResults = $('#js-num').val();
    getParks(codes);
  });
}

$(watchForm);