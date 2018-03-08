let musicController = new MusicController();
let access_token;

let timeLeft = 30;
let ans = -1;

const questionQueue = [];
const queueMax = 10;

let soundPlayer;
let interval;
let countdownCircular;
let answerSong;
let score = 0;
let answeredSongNumber = 0;

function init(){
  $("#onAnswerPanel").hide();
  $("#game").hide();
  //Add logout function to button
  $("#spotifyLogout").click(logout);
  // $("#btnAnswer").click(onAnswer);
  $("#afterAnswerBtn").click(onContinue);
  // Validate if user really logged in or not.
  setupGame();

  // Initialize image picker
  $("select").prop("selectedIndex", -1);
  $("select").imagepicker();
  
  // Start countdown timer UI
  countdownCircular = $("#countdownCircular").countdown360({
    radius      : 200,
    seconds     : 3,
    strokeWidth : 10,
    fillStyle   : '#64d36d',
    strokeStyle : '#519956',
    fontSize    : 60,
    fontColor   : '#FFFFFF',
    smooth:true,
    autostart: false,
    onComplete  : function () {
      startGame()
    }
  });
  countdownCircular.start();
}

function logout(){
  //Remove access_token from local storage
  localStorage.removeItem('access_token');
  //redirect back to the index page
  $(location).attr('href', './index.html');
}



function setupGame(){
  //Get and check if user has really login into the website using spotify or not.
  access_token = localStorage.getItem('access_token');
  if(access_token){
    //Show game and load stuff here
    musicController.setAccessToken(access_token);
    // Get User tracks using Spotify API
    musicController.getMyTopTracks()
      .then((data)=>
        // startGame()
        console.log("Loading Finish")
      )
      .catch((err)=>{
      console.log(err);
      alert("Maybe token expire. Please re-login")
    });
  }
  else{
    alert("You are not logged in yet!");
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
  countdownCircular.start();


}

function onFinishLoad(){
  $("#loading").hide();
  $("#game").show();
  countdownCircular.stop();
}

function updateInScoreGame(){
  $("#scoreTextInGame").text("Score: "+score);
  $("#progressTextInGame").text("Answered songs: "+ answeredSongNumber);
}



function mapSongsToUI(songs){
  const imagePicker = $(".image-picker")
  imagePicker.empty();
  for(let i=0;i<songs.length;i++) {
    const song = songs[i];
    imagePicker.append($('<option data-img-src="' + song.singerPicture + '" data-img-label="'+song.artists[0].name+'" value="' + i + '">'));
  }

  updateInScoreGame();

  imagePicker.prop("selectedIndex", -1);
  imagePicker.imagepicker({
    clicked:onAnswer //Here
  });

  ans = Math.floor(Math.random()*songs.length); //Random
  answerSong = songs[ans];
  const answerSongPreview = answerSong.preview_url;
  playSound(answerSongPreview);
  startCountDown();
}

function playSound(url) {
  soundPlayer = new Audio(url);
  soundPlayer.play(); //Comment because I want to listen ti music while working. haha. to be uncomment
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

  const finalScore = score;
  score = 0;
  answeredSongNumber = 0;
  $("#game").hide();
  $("#answerResult").text("Time Up!");
  $("#afterAnswerBtn").text("Retry");
  $("#artistImage").css({"border-color":"#aa2211"});
  $("#scoreText").text("Final score: "+finalScore);
  $("#onAnswerPanel").show();

  mapAnswerToUI();
}

function onAnswer(e){
  answeredSongNumber+=1;

  stopSound();

  const answer = $(".image-picker").data('picker').selected_values();

  if(answer[0]==ans) onCorrectAnswer();
  else onWrongAnswer("Wrong");
  //Show information about the real song. Then press next to go to next song? Should have better UX than current version
  mapAnswerToUI();

  clearInterval(interval);
  $("#countDown").text(30);
  stopSound();
  playSound(answerSong.preview_url);
  // setupLevel(3);
}

function mapAnswerToUI(){
  $("#artistImage").attr('src',answerSong.singerPicture);
  $("#songName").text(answerSong.name);
  $("#artistName").text("By "+answerSong.artists[0].name);
  $("#songUrl").attr('href',answerSong.external_urls.spotify);
}

function onCorrectAnswer(){
  score+= timeLeft;

  $("#scoreText").text("Score: "+score);
  $("#game").hide();
  $("#answerResult").text("Correct!");
  $("#afterAnswerBtn").text("Continue");
  $("#artistImage").css({"border-color":"#519956"});
  $("#onAnswerPanel").show();
}

function onWrongAnswer(){
  const finalScore = score;
  score = 0;
  musicController.getMyTopTracks(); //Reset songs.
  $("#game").hide();
  $("#answerResult").text("Wrong!");
  $("#afterAnswerBtn").text("Retry");
  $("#artistImage").css({"border-color":"#aa2211"});
  $("#scoreText").text("Final score: "+finalScore);
  $("#onAnswerPanel").show();
}

function onContinue(){
  stopSound();
  $("#onAnswerPanel").hide();
  setupLevel(3);
}

init();

