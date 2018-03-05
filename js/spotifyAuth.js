/* global $ client_id redirect_uri*/

$.ajaxSetup({
  headers: {
    'Authorization': 'Basic <base64 encoded '+client_id+':'+client_secret+'>'
  }
});

function onClickSpotifyLogin() {
  const scopes = 'user-read-private user-read-email user-top-read user-follow-read';

  const spotifyAuthUrl = 'https://accounts.spotify.com/authorize/?client_id='
    + client_id + '&response_type=token&redirect_uri='
    + redirect_uri + '&state=34fFs29kd09'
    + (scopes ? '&scope=' + encodeURIComponent(scopes) : '');

  $(location).attr('href', spotifyAuthUrl);
}

function onLogin(accessToken){
  // If has code. THis means that the user just logged in.
    // OnLogin
    console.log(accessToken);
    // Store the access_token into the access_token.
    localStorage.setItem('access_token',accessToken);
    // Redirect to play. ! Play page also has to check the access_token first!
    $(location).attr('href', './menu.html');

}

function init() {
  $('#spotifyLogin').click(onClickSpotifyLogin);

  const accessToken = localStorage.getItem('access_token');
  // Check from storage if user has any access token or not
  if(accessToken){
    // If already contain, then redirect to play page.
    onLogin(accessToken);
  } else {
    const accessToken = $.urlParam('access_token');
    if (accessToken) {
      // If not, check if url has any code parameters or not.
      onLogin(accessToken);
    } else {
      // If not show the login button
      console.log('Please login');
    }
  }
}
init();

