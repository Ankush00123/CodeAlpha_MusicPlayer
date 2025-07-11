const audio = document.getElementById("audio");
const duration  = document.getElementById("duration");
const playPause = document.getElementById("playPause");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const volume = document.getElementById("volume");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("song_Cover");
const timeDisplay=document.getElementById("timeDisplay");
const playlistToggle=document.getElementById("playlistToggle");
const playlist=document.querySelector(".playlist");
const search_bar=document.getElementById("search_bar");
const volume_icon=document.getElementById("volume_icon");

audio.volume=0.7;
let store_current_volume_value=0;

volume.value=70;

const songs = [
    {
        name:"chill-lofi-beats-relaxing-instrumentals",
        displayName:"chill-lofi-beats",
        artist:"VibesChill"
    },
    {
        name:"good-night-lofi-cozy-chill-music",
        displayName:"good-night-lofi",
        artist:"FASSounds"
    },
    {
        name:"lofi-beat-chill",
        displayName:"lofi-beat-chill",
        artist:"WATRFALLKERO"
    },
    {
        name:"lofi-study-calm-peaceful-chill-hop",
        displayName:"lofi-study",
        artist:"FASSounds"
    },
    {
        name:"lost-ambient-lofi-60s",
        displayName:"lost-ambient-lofi",
        artist:"music_for_video"
    },
]

let current_Song_Index = 0;

function loadsong(song)
{
    title.textContent=`Song: ${song.displayName||song.name}`;
    artist.textContent="Artist: "+song.artist;
    audio.src= `Songs/${song.name}.mp3`;
    cover.src= `Images/cover_${song.name}.jpg`;
    cover.onerror = ()=> 
    {
        cover.src="Images/default_image.jpg";
    }

    audio.addEventListener("error", () => 
    {
        title.textContent = `Error while loading the song ${song.name}`;
        console.error(`Failed to load: Songs/${song.name}.mp3`);
        setTimeout(() => next_Song(), 1000)
    });
}

loadsong(songs[current_Song_Index]);

let is_playing = false;

function playMusic()
{
    audio.play();
    is_playing=true;
    playPause.textContent="⏸";
}

function pauseMusic()
{
    audio.pause();
    is_playing=false;
    playPause.textContent="▶";
}

function prev_Song()
{
    if(current_Song_Index>0)
    {
        current_Song_Index--;
    }
    else
    {
        current_Song_Index=songs.length-1;
    }
    loadsong(songs[current_Song_Index]);
    playMusic();
}

function next_Song()
{
    if(current_Song_Index>=songs.length-1)
    {
        current_Song_Index=0;
    }
    else
    {
        current_Song_Index++;
    }
    loadsong(songs[current_Song_Index]);
    playMusic();
}

volume_icon.addEventListener("click",()=>
{
    if(audio.volume!==0)
    {
        store_current_volume_value=audio.volume;
        audio.volume=0;
        volume.value=0;
        volume_icon.textContent="🔈";
    }
    else
    {
        audio.volume=store_current_volume_value;
        volume.value=audio.volume*100;
        volume_icon.textContent="🔊";
    }
})

function formatTime(seconds)
{
    const min = Math.floor(seconds/60);
    const sec = Math.floor(seconds%60);
    return `${min}:${sec<10 ? '0' : ''}${sec}`;
}
audio.addEventListener("timeupdate", ()=>
{
    const progress = (audio.currentTime/audio.duration)*100;
    duration.value=progress||0;
    timeDisplay.textContent=`${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`;
}
);

audio.addEventListener("loadedmetadata", () => {
    timeDisplay.textContent = `${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`;
});

duration.addEventListener("input", ()=>
{
    const seekTime = (duration.value/100)*audio.duration;
    audio.currentTime=seekTime;
}
);

volume.addEventListener("input", () =>
{
    audio.volume=volume.value/100;
}
)

playPause.addEventListener("click", () =>
{
    if(is_playing)
    {
        pauseMusic();
    }
    else
    {
        playMusic();
    }
})

audio.addEventListener("ended", ()=>
{
    next_Song();
}
)

playlistToggle.addEventListener("click", ()=>
{
    if(playlist.style.display==="flex")
    {
        playlist.style.display="none";
        playlistToggle.textContent="Show Playlist";
        search_bar.value="";
    }
    else
    {
        playlist.style.display="flex";
        playlistToggle.textContent="Hide Playlist";
        getPlaylist();
    }
}
)

function getPlaylist()
{
    const songList =  document.getElementById("songList");
    songList.innerHTML="";
    songs.forEach((song,index) =>
    {
        const songItem = document.createElement("div");
        songItem.className = "songItem";
        songItem.textContent = song.displayName||song.name;
        songItem.addEventListener("click", () => 
        {
            current_Song_Index = index;
            loadsong(songs[current_Song_Index]);
            playMusic();
        }
        );
        songList.appendChild(songItem);
    }
);
}

search_bar.addEventListener("input", filterPlaylist);

function filterPlaylist()
{
    const searchText=search_bar.value.toLowerCase();
    const songItem=document.querySelectorAll(".songItem");

    songItem.forEach(item=>
    {
        const songName=item.textContent.toLowerCase();
        if(songName.startsWith(searchText))
        {
            item.style.display="block";
        }
        else 
        {
            item.style.display="none";
        }
    }
    )
}
