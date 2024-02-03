document.addEventListener("DOMContentLoaded", function () {
  const categoriesContainer = document.getElementById("categories");
  const contentContainer = document.getElementById("content");
  let currentPlayer; // To store the current YouTube player instance

  // Fetch and load categories from data.json
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      // Populate categories
      data.categories.forEach((category, index) => {
        const categoryLink = document.createElement("a");
        categoryLink.href = `#${category.name.replace(/\s+/g, "-")}`;
        categoryLink.textContent = `${index + 1}. ${category.name}`;
        categoryLink.addEventListener("click", (event) => {
          event.preventDefault();
          showCategoryContent(category);
          updateURLHash(category.name.replace(/\s+/g, "-"));
        });
        categoriesContainer.appendChild(categoryLink);
      });

      // Check the initial hash and show content accordingly
      const initialHash = window.location.hash.substr(1);
      const initialCategory = data.categories.find(
        (category) => category.name.replace(/\s+/g, "-") === initialHash
      );
      if (initialCategory) {
        showCategoryContent(initialCategory);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));

  function showCategoryContent(category) {
    // Clear previous content
    contentContainer.innerHTML = "";

    // Display category name
    const categoryName = document.createElement("h2");
    categoryName.textContent = `${category.name}`;
    categoryName.id = category.name.replace(/\s+/g, "-");
    contentContainer.appendChild(categoryName);

    // Display paragraphs
    category.paragraphs.forEach((paragraph) => {
      const paragraphElement = document.createElement("p");
      paragraphElement.textContent = paragraph;
      contentContainer.appendChild(paragraphElement);
    });

    // Display videos with YouTube API
    category.videos.forEach((video) => {
      const videoContainer = document.createElement("div");
      videoContainer.className = "youtube-container";

      const videoElement = document.createElement("iframe");
      videoElement.src = `https://www.youtube.com/embed/${video}?modestbranding=1&controls=1&showinfo=0&rel=0`;
      videoElement.allowfullscreen = true;
      videoElement.frameBorder = "0";

      // Create a unique ID for each player
      const playerId = `player-${Math.floor(Math.random() * 1000)}`;
      videoElement.setAttribute("id", playerId);

      videoContainer.appendChild(videoElement);
      contentContainer.appendChild(videoContainer);

      // Initialize the YouTube player
      currentPlayer = new YT.Player(playerId, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    });

    // Scroll to the selected category
    contentContainer.scrollIntoView({ behavior: "smooth" });
  }

  // Function to handle the ready event of the YouTube player
  function onPlayerReady(event) {
    // Uncomment the line below if you want the video to start playing automatically
    // event.target.playVideo();
  }

  // Function to handle state changes of the YouTube player
  function onPlayerStateChange(event) {
    // You can add additional logic here based on player state changes
    // For example, you can detect when the video ends and take appropriate actions
    if (event.data === YT.PlayerState.ENDED) {
      // Video ended, you can perform additional actions
      console.log("Video ended");
    }
  }

  // Function to update the URL hash
  function updateURLHash(hash) {
    window.location.hash = hash;
  }

  // Load the YouTube API script asynchronously
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Function to handle YouTube API script loading
  window.onYouTubeIframeAPIReady = function () {
    // YouTube API script is ready
    // You can add any additional logic here if needed
  };
});
