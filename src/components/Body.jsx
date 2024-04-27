import { useState, useEffect } from 'react';

function PlaylistDuration() {
  const [totalDuration, setTotalDuration] = useState(0);
  // const apiKey = 'AIzaSyD141dZMBDLSmqjwzEb4Kar48mw7dIi66M';
  const [playListUrl, setPlayListUrl] = useState('');
  const [totalVideos, setTotalVideos] = useState(0);
  const [averageDuration, setAverageDuration] = useState(0);
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [fetchStarted, setFetchStarted] = useState(false);
  const [error, setError] = useState(null);
  // useEffect(() => {
  //   fetchPlaylistItems();
  // }, []);

  function fetchVideoDuration(videoId) {
    return fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        return parseVideoDuration(data.items[0].contentDetails.duration);
      })
      .catch(error => {
        console.error('Error fetching video duration:', error);
        setError('Invalid URL. Please enter a valid YouTube video or playlist URL.');
        setIsDataVisible(false)
        setFetchStarted(false)

        return 0;
      });
  }

  function parseVideoDuration(durationString) {
    const match = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  }



  function fetchPlaylistItems(pageToken, totalDuration = 0, totalVideos = 0) {
    if (playListUrl === '') {
      setError('Please enter a valid URL');
      setIsDataVisible(false)
      return;
    }
    setError(null);
    setFetchStarted(true)
    setIsDataVisible(false)
    let playlistId = playListUrl.includes('list=') ? playListUrl.split('list=')[1] : null;
    let videoId = playListUrl.includes('v=') ? playListUrl.split('v=')[1] : null;
    // let playlistId = playListUrl.split('list=')[1];
    if (playlistId) {

      let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`;
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Error fetching playlist items:', data.error.message);
            setError('Invalid URL. Please enter a valid YouTube video or playlist URL.');
            setIsDataVisible(false)
            setFetchStarted(false)
            return;
          }
          const items = data.items;
          const promises = items.map(item => {
            const videoId = item.snippet.resourceId.videoId;
            return fetchVideoDuration(videoId);
          });

          Promise.all(promises)
            .then(durations => {
              durations.forEach(duration => {
                totalDuration += duration;
              });

              totalVideos += items.length; // increment totalVideos by the number of items fetched

              if (data.nextPageToken) {
                fetchPlaylistItems(data.nextPageToken, totalDuration, totalVideos);
              } else {
                setTotalDuration(totalDuration-1);
                setTotalVideos(totalVideos); // set the totalVideos state
                calculateAverageDuration(totalDuration-1, totalVideos); // calculate the average duration
                setIsDataVisible(true)
                setFetchStarted(false)
              }
            })
            .catch(error => console.error('Error fetching video durations:', error));
        })
        .catch(error => console.error('Error fetching playlist items:', error));
    } else if (videoId) {
      fetchVideoDuration(videoId)
        .then(duration => {
          if (duration === 0) {
            return;
          }
          setTotalDuration(duration-1);
          setTotalVideos(1);
          calculateAverageDuration(duration-1, 1);
          setIsDataVisible(true)
          setFetchStarted(false)

        })
        .catch(error => {
          console.error('Error fetching video duration:', error)
          setError('Invalid URL. Please enter a valid YouTube video or playlist URL.');
          setIsDataVisible(false)
          console.log(isDataVisible)
        });
    } else {
      console.error('Invalid URL. Please enter a valid YouTube video or playlist URL.');
    }
  }

  function formatTotalDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.round(durationInSeconds % 60);

    const hoursStr = hours === 1 ? 'hour' : 'hours';
    const minutesStr = minutes === 1 ? 'minute' : 'minutes';
    const secondsStr = seconds === 1 ? 'second' : 'seconds';

    return `Total length of playlist : ${hours} ${hoursStr}, ${minutes} ${minutesStr}, ${seconds} ${secondsStr}`;
  }

  function formatAverageDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    const minutesStr = minutes === 1 ? 'minute' : 'minutes';
    const secondsStr = seconds === 1 ? 'second' : 'seconds';

    return ` ${minutes} ${minutesStr}, ${seconds} ${secondsStr}`;
  }

  function formatDurationAtSpeed(durationInSeconds, speed) {
    durationInSeconds = durationInSeconds / speed; // adjust for 1.25x speed

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.round(durationInSeconds % 60);

    const hoursStr = hours === 1 ? 'hour' : 'hours';
    const minutesStr = minutes === 1 ? 'minute' : 'minutes';
    const secondsStr = seconds === 1 ? 'second' : 'seconds';

    return `${hours} ${hoursStr}, ${minutes} ${minutesStr}, ${seconds} ${secondsStr}`;
  }

  function calculateAverageDuration(totalDuration, totalVideos) {
    const avgDurationInSeconds = Math.round(totalDuration / totalVideos);
    setAverageDuration(formatAverageDuration(avgDurationInSeconds));
  }


  return (
    <div className='  flex  flex-col px-4 sm:px-12 md:px-24 lg:px-32  text-sm sm:text-base py-12 gap-8  h-full'>
      <div>
        Find the length of any YouTube playlist or video. Just copy and paste the URL below.
      </div>
<div>
      <div className='flex gap-2'>

        <input className='border-2  focus:border-blue-200 focus:shadow-md  focus:ring-0 focus:outline-none px-2 py-1 flex-grow dark:bg-[#303337] dark:border-[#303337] dark:focus:border-blue-300 dark:shadow-xl' type="text" placeholder="youtube.com/playlist?list=ID" onInput={(e) => setPlayListUrl(e.target.value)} />
        <div className='flex-shrink-0 '>

          <button className=' bg-[#1890FF] px-4 py-1 h-full text-white dark:text-[#ffffffcc]' onClick={() => fetchPlaylistItems()} >Analyze</button>
        </div>
      </div>
      {error && <div className='text-red-500'>{error}</div>}
      </div>
      {isDataVisible ? (
      <div className='details flex flex-col gap-4'>
        <p>Total Videos: {totalVideos}</p>
        <p>Average length of video : {averageDuration}</p>
        <p>{formatTotalDuration(totalDuration)}</p>
        <p>At 1.25x speed : {formatDurationAtSpeed(totalDuration, 1.25)}</p>
        <p>At 1.50x speed : {formatDurationAtSpeed(totalDuration, 1.50)}</p>
        <p>At 1.75x speed : {formatDurationAtSpeed(totalDuration, 1.75)}</p>
        <p>At 2.00x speed : {formatDurationAtSpeed(totalDuration, 2.00)}</p>
      </div>) :(
        <div>
        {fetchStarted && <div className=''>
                        <div
                            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status">
                            <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...
                            </span>
                        </div>
                    </div>}
        </div>
        
      )}
    </div>
  );
}

export default PlaylistDuration;
