let spotifyApi = new SpotifyWebApi()

/* public $ */

function MusicController(){

  this.musics;
  this.access_token;

  this.setAccessToken = function(access_token){
    this.access_token = access_token;
    spotifyApi.setAccessToken(access_token);
  }

  this.getMyTopTracks = function(){

    return new Promise((resolve,reject)=>
      spotifyApi.getMyTopTracks({limit:100})
        .then((data)=> {
            console.log(data)
            this.musics = data.items;
            resolve(data)
          },
          //On Error
          (err)=> reject(err))
    )
  };

  this.randomSong = function(n){
    //randomly select n songs
    const randomedSongs = [];
    const singerNames = [];
    for(let i=0;i<n;i++){
      let selectedSong = this.musics[Math.floor(Math.random() * this.musics.length)];
      let singerName = selectedSong.artists[0].name;
      // Check if the choose song artists is not selected already in a randomedSongs array.
      while(singerNames.indexOf(singerName)>-1){
        //If found in array, find new singer
        selectedSong = this.musics[Math.floor(Math.random() * this.musics.length)];
        singerName = selectedSong.artists[0].name;
      }
      singerNames.push(singerName);

      // From singer name, get the picture.
      this.getArtistPicture(singerName,selectedSong);
      //Push into the array
      randomedSongs.push(selectedSong);
    }

    return randomedSongs;
  }

  this.getArtistPicture = function(artistName,song){
    const url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artistName+"&api_key=d07d1afe053251f8e5e27f323593d24d&format=json"
    $.get({
      url: url,
      dataType: 'json',
      async:false,
    })
      .done(function(data){
        const url = data.artist.image[3]["#text"];
        song.singerPicture = url;
      })
      .catch(function(err){console.log(err)})
  }
}

