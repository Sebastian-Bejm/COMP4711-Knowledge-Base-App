

let postRepliesId = null;
let searchRepliesId = null;
let profileRepliesId = null;





const toggleViewReplies = id => {
    if(postRepliesId != null && postRepliesId != id){
      let previouslyOpen = document.querySelector(`#post-replies${postRepliesId}`);
      if(previouslyOpen != null){
        previouslyOpen.style.display = "none";
      }
    }
    
    let repliesDiv = document.querySelector(`#post-replies${id}`);
    if (repliesDiv.style.display === "none" || !repliesDiv.style.display) {
        repliesDiv.style.display = "block";
        postRepliesId = id;
      } else {
        repliesDiv.style.display = "none";
    }
}





const toggleSearchReplies = id => {
  if(searchRepliesId != null && searchRepliesId != id){
    let previouslyOpen = document.querySelector(`#search-replies${searchRepliesId}`);
    if(previouslyOpen != null){
      previouslyOpen.style.display = "none";
    }
  }
  
  let repliesDiv = document.querySelector(`#search-replies${id}`);
  if (repliesDiv.style.display === "none" || !repliesDiv.style.display) {
      repliesDiv.style.display = "block";
      searchRepliesId = id;
    } else {
      repliesDiv.style.display = "none";
  }
}





const toggleProfileReplies = id => {
  if(profileRepliesId != null && profileRepliesId != id){
    let previouslyOpen = document.querySelector(`#profile-replies${profileRepliesId}`);
    if(previouslyOpen != null){
      previouslyOpen.style.display = "none";
    }
  }
  
  let repliesDiv = document.querySelector(`#profile-replies${id}`);
  if (repliesDiv.style.display === "none" || !repliesDiv.style.display) {
      repliesDiv.style.display = "block";
      profileRepliesId = id;
    } else {
      repliesDiv.style.display = "none";
  }
}