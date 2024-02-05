document.addEventListener("DOMContentLoaded", function () {
  const categoriesContainer = document.getElementById("categories");
  const contentContainer = document.getElementById("content");
  const spinner = document.getElementById("spinner");
  const reflectionsContainer = document.getElementById("reflections"); // Reference to reflections container

  let currentPlayer;

  spinner.style.display = "block";

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      spinner.style.display = "none";

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

      const initialHash = window.location.hash.substr(1);
      const initialCategory = data.categories.find(
        (category) => category.name.replace(/\s+/g, "-") === initialHash
      );
      if (initialCategory) {
        showCategoryContent(initialCategory);
      }
    })
    .catch((error) => {
      spinner.style.display = "none";
      console.error("Error fetching data:", error);
    });

  function showCategoryContent(category) {
    contentContainer.innerHTML = "";

    const categoryName = document.createElement("h2");
    categoryName.textContent = `${category.name}`;
    categoryName.id = category.name.replace(/\s+/g, "-");
    contentContainer.appendChild(categoryName);

    category.paragraphs.forEach((paragraph) => {
      const paragraphElement = document.createElement("p");
      paragraphElement.textContent = paragraph;
      contentContainer.appendChild(paragraphElement);
    });

    category.videos.forEach((video) => {
      const videoContainer = document.createElement("div");
      videoContainer.className = "youtube-container";

      const videoElement = document.createElement("iframe");
      videoElement.src = `https://www.youtube.com/embed/${video}?modestbranding=1&controls=1&showinfo=0&rel=0`;
      videoElement.allowfullscreen = true;
      videoElement.frameBorder = "0";

      const playerId = `player-${Math.floor(Math.random() * 1000)}`;
      videoElement.setAttribute("id", playerId);

      videoContainer.appendChild(videoElement);
      contentContainer.appendChild(videoContainer);

      currentPlayer = new YT.Player(playerId, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    });

    // Display reflections for the selected category
    reflectionsContainer.innerHTML = ""; // Clear previous reflections
    category.reflections.forEach((reflection, index) => {
      const reflectionElement = document.createElement("p");
      reflectionElement.textContent = `Reflection ${index + 1}: ${reflection}`;
      reflectionsContainer.appendChild(reflectionElement);
    });

    contentContainer.scrollIntoView({ behavior: "smooth" });
  }

  function onPlayerReady(event) {
    // Uncomment the line below if you want the video to start playing automatically
    // event.target.playVideo();
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      const videoId = event.target.getVideoData().video_id;

      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&key=YOUR_API_KEY`
      )
        .then((response) => response.json())
        .then((data) => {
          const relatedVideoIds = data.items.map((item) => item.id.videoId);
          console.log("Related Videos:", relatedVideoIds);
        })
        .catch((error) =>
          console.error("Error fetching related videos:", error)
        );
    }
  }

  function updateURLHash(hash) {
    window.location.hash = hash;
  }

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function () {};

  window.scrollToTop = function () {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.addEventListener("scroll", () => {
    const scrollThreshold = 200;
    const scrollArrow = document.querySelector(".scroll-arrow");
    if (
      document.body.scrollTop > scrollThreshold ||
      document.documentElement.scrollTop > scrollThreshold
    ) {
      scrollArrow.style.display = "block";
    } else {
      scrollArrow.style.display = "none";
    }
  });

  window.promptForPassword = function () {
    if (localStorage.getItem("loggedIn") === "true") {
      document.getElementById("password-prompt").style.display = "none";
      document.getElementById("content-wrapper").style.display = "block";
    } else {
      var passwordInput = document.getElementById("passwordInput");
      var password = passwordInput.value.trim();

      if (password !== null && password.toLowerCase() === "dclcp2024") {
        localStorage.setItem("loggedIn", "true");
        document.getElementById("password-prompt").style.display = "none";
        document.getElementById("content-wrapper").style.display = "block";
      } else {
        alert("Please enter the correct password to access the content.");
      }
    }
  };

  window.onload = function () {
    promptForPassword();
  };
});
