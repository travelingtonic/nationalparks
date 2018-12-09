'use strict';
// Proper api call: https://api.nps.gov/api/v1/parks?stateCode=nc&api_key=ss3gYGYNRTcLsnKEgaaeQs4iBXMoe6ztWOg2W8mq
const apiKey = 'ss3gYGYNRTcLsnKEgaaeQs4iBXMoe6ztWOg2W8mq'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


function getParks(codes,limitNum) {
    const codeList = removeSpaces(codes);
    const params = {
        api_key: apiKey,
        stateCode: codeList,
        limit: limitNum,
        start: 0
    };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
  .then(response => response.status >= 400 ? Promise.reject(error) : response.json())
  .then(responseJson => getResultCount(responseJson) >= 1 ? displayResults(responseJson,codeList) : Promise.reject('no results found'))
  .catch(error => displayError(error));
}

function removeSpaces(val) {
    return val.split(' ').join('');
 }

 function limitResults(val) {
  if(val >= 1 && val <= 50) {
    return val;
  }
  else {
    return null;
  }
 }

 function getResultCount(responseJson) {
  return responseJson.data.length;
 }

function emptyResults() {
    $('.js-error-message').empty();
    $('.js-states').empty();
    $('.js-resultcount').empty();
    $('.js-resultList').empty();
}

function displayError(error) {
    emptyResults();
    $('.js-results').addClass('hidden');
    $('.js-error-message').append(`Sorry, ${error}. Please try again.<br><br>`);
  }

function displayResults(responseJson,codes) {
    emptyResults();

    const totalResults = getResultCount(responseJson);
    $('.js-resultcount').text(`Total Results: ${totalResults}`);
    $('.js-states').text(`Searched for: ${codes}`);

    for (let i = 0; i < getResultCount(responseJson) ; i++){
      $('.js-resultList').append(
        `<li class="park-name">${responseJson.data[i].fullName}
            <li class="park-website">Website: <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></li>
            <li>${responseJson.data[i].description}</li>
        </li>`
      )};
    $('.js-results').removeClass('hidden');
}

function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    const codes = $('#js-codes').val();
    const limit = $('#js-num').val();

    limitResults(limit) === null ? displayError('max results must be a number 1 - 50') : getParks(codes,limit);
  });
}

$(watchForm);