

let openRepliesId = null;


const toggleViewReplies = id => {
    if(openRepliesId != null && openRepliesId != id){
      let previouslyOpen = document.querySelector(`#post-replies${openRepliesId}`);
      if(previouslyOpen != null){
        previouslyOpen.style.display = "none";
      }
    }
    
    let repliesDiv = document.querySelector(`#post-replies${id}`);
    if (repliesDiv.style.display === "none" || !repliesDiv.style.display) {
        repliesDiv.style.display = "block";
        openRepliesId = id;
      } else {
        repliesDiv.style.display = "none";
    }

}