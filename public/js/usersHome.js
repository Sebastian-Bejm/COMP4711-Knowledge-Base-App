


const toggleViewReplies = id => {
    let repliesDiv = document.querySelector(`#post-replies${id}`);
    if (repliesDiv.style.display === "none" || !repliesDiv.style.display) {
        repliesDiv.style.display = "block";
      } else {
        repliesDiv.style.display = "none";
      }
}