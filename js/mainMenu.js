let musicController = new MusicController();
let access_token;

let timeLeft = 30;
let ans = -1;

const questionQueue = [];
const queueMax = 10;

let soundPlayer;
let interval;

function init(){
  $("#game").hide();
  //Add logout function to button
  $("#spotifyLogout").click(logout)
  $(".btnAnswer").click(onAnswer);
  // Validate if user really logged in or not.
  setupGame();

  // Initialize image picker
  $("select").imagepicker();
}

function logout(){
  //Remove access_token from local storage
  localStorage.removeItem('access_token');
  //redirect back to the index page
  $(location).attr('href', '/index.html');
}



function setupGame(){
  //Get and check if user has really login into the website using spotify or not.
  access_token = localStorage.getItem('access_token');
  if(access_token){
    //Show game and load stuff here
    musicController.setAccessToken(access_token);
    // Get User tracks using Spotify API
    musicController.getMyTopTracks()
      .then((data)=>startGame())
      .catch((err)=>{
      console.log(err);
      alert("Maybe token expire")
    });
  }
  else{
    alert("You are not logged in yet!");
    logout();
  }
}

function startGame(){
  setupLevel(3);
}

function setupLevel(n){
  // If question queue is empty, load one.
  timeLeft = 30;
  if(questionQueue.length==0){
    loadSongs(n);
  }

  //Then get the songs from queue.
  const songs = questionQueue.pop();
  mapSongsToUI(songs);
}

function loadSongs(n){
  onStartLoad();
  if(questionQueue.length<=queueMax){
    const songs = musicController.randomSong(n);
    questionQueue.push(songs);
  }
  onFinishLoad();
}

function onStartLoad(){
  $("#game").hide();
  $("#loading").show();
}

function onFinishLoad(){
  $("#loading").hide();
  $("#game").show();
}

function mapSongsToUI(songs){
  console.log(songs);
  const imagePicker = $(".image-picker")
  imagePicker.empty();
  for(let i=0;i<songs.length;i++) {
    const song = songs[i];
    imagePicker.append($('<option data-img-src="' + song.singerPicture + '" data-img-label="'+song.artists[0].name+'" value="' + i + '">'));
  }
  imagePicker.imagepicker();

  ans = Math.floor(Math.random()*songs.length); //Random
  const answerSong = songs[ans];
  const answerSongPreview = answerSong.preview_url;
  playSound(answerSongPreview);
  startCountDown();
}

function playSound(url) {
  soundPlayer = new Audio(url);
  soundPlayer.play();
}

function stopSound(){
  soundPlayer.pause();
  soundPlayer.currentTime = 0;
}

function startCountDown(){
  const countdownUI = $("#countDown");
  interval = setInterval(function(){
    timeLeft-=1;
    if(timeLeft==0) timeUp(interval);
    countdownUI.text(timeLeft);
    }, 1000);
}

function timeUp(interval){
  clearInterval(interval);
  //Show Game Over UI here.
}

function onAnswer(e){
  const answer = $(".image-picker").data('picker').selected_values();
  console.log(answer);
  if(answer[0]==ans) onCorrectAnswer();
  else onWrongAnswer("Wrong");

  clearInterval(interval);
  $("#countDown").text(30);
  stopSound();
  setupLevel(3);
}

function onCorrectAnswer(){
  alert("Correct!");
}

function onWrongAnswer(){
  alert("Wrong");
}

init();


