document.addEventListener('DOMContentLoaded', () => {
  const tags = document.querySelectorAll('.filter-tags .tag');
  const menu = document.querySelector('.menu');
  const noResults = document.querySelector('.no-results');
  const randomButton = document.querySelector('.random-button');
  const randomModal = document.getElementById('random-modal');
  const randomModalContent = randomModal.querySelector('.random-modal-content');
  let cooldown = false; // Cooldown flag
  const cooldownDuration = 100; // Cooldown duration in milliseconds

  // Retrieve favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  tags.forEach(tag => {
    tag.textContent = tag.dataset.tag;
    tag.addEventListener('click', () => {
      if (cooldown) return; // If cooldown is active, ignore the click

      tag.classList.toggle('selected');
      filterCocktails();
      window.navigator.vibrate([5]);

      cooldown = true; // Activate cooldown
      setTimeout(() => {
        cooldown = false; // Deactivate cooldown after the specified duration
      }, cooldownDuration);
    });
  });

  fetch('cocktails/cocktails.json')
    .then(response => response.json())
    .then(data => {
      loadCocktails(data);
    })
    .catch(error => {
      console.error('Error fetching the cocktails.json file:', error);
    });

  function loadCocktails(cocktails) {
    menu.innerHTML = ''; // Clear existing cocktails

    cocktails.filter(cocktail => !cocktail.hidden).forEach(cocktail => {
      const isFavorited = favorites.includes(cocktail.title);
      const cocktailDiv = document.createElement('div');
      cocktailDiv.classList.add('cocktail');
      cocktailDiv.dataset.tags = cocktail.tags.replace(/#/g, '');
      cocktailDiv.dataset.title = cocktail.title; // Add a data attribute for title

      // Determine image path
      const imageName = cocktail.title.replace(/\s+/g, '') + '.png';
      const imagePath = `cocktails/${imageName}`;
      const fallbackImagePath = 'cocktails/Generic.png';

      // Create ABV element
      const abvElement = document.createElement('span');
      abvElement.classList.add('abv');
      abvElement.textContent = `${cocktail.abv}`;

      cocktailDiv.innerHTML = `
        <img class="cocktail-image" src="${imagePath}" onerror="this.onerror=null; this.src='${fallbackImagePath}'" alt="${cocktail.title}">
        <span class="h2">${cocktail.title}</span>
        <span class="p">${cocktail.description}</span>
        <span class="p1"><i>${cocktail.ingredients}</i></span>
        <img class="favorite-star" src="images/${isFavorited ? 'star-filled.png' : 'star-empty.png'}" alt="Favorite">
        <div class="cocktail-tags">${cocktail.tags.split(' ').map(tag => `<span class="tag" data-tag="${tag.replace(/#/g, '')}">${tag.replace(/#/g, '')}</span>`).join('')}</div>
      `;

      // Add the ABV element to the cocktailDiv
      cocktailDiv.prepend(abvElement);

      // Add click event for the favorite star
      const star = cocktailDiv.querySelector('.favorite-star');
      star.addEventListener('click', () => {
        toggleFavorite(cocktail.title);
      });

      menu.appendChild(cocktailDiv);
    });

    filterCocktails();
  }

  function filterCocktails() {
    const selectedTags = Array.from(document.querySelectorAll('.filter-tags .tag.selected'))
                              .map(tag => tag.dataset.tag);

    let visibleCocktails = 0;

    const cocktails = document.querySelectorAll('.cocktail');
    cocktails.forEach(cocktail => {
      const cocktailTags = cocktail.dataset.tags.split(' ');
      const hasAllSelectedTags = selectedTags.every(tag => cocktailTags.includes(tag));

      if (hasAllSelectedTags) {
        cocktail.classList.remove('fade-out');
        cocktail.classList.add('fade-in');
        cocktail.style.display = ''; // Ensure it's visible if previously hidden
        visibleCocktails++;
      } else {
        cocktail.classList.remove('fade-in');
        cocktail.classList.add('fade-out');
        setTimeout(() => {
          cocktail.style.display = 'none';
        }, 100); // Match this duration with the animation duration
      }
    });

    noResults.style.display = visibleCocktails > 0 ? 'none' : 'block';
  }

  function toggleFavorite(title) {
    window.navigator.vibrate([5]);
    const index = favorites.indexOf(title);
    if (index >= 0) {
      // Remove from favorites
      favorites.splice(index, 1);
    } else {
      // Add to favorites
      favorites.push(title);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 1 }
      });
      var audio = new Audio('res/partyblower.mp3');
      audio.play();
    }

    // Save favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Refresh cocktail list and random modal
    refreshCocktails();
  }

  function refreshCocktails() {
    const allCocktails = document.querySelectorAll('.cocktail');
    allCocktails.forEach(cocktail => {
      const title = cocktail.dataset.title;
      const isFavorited = favorites.includes(title);
      const star = cocktail.querySelector('.favorite-star');
      star.src = `images/${isFavorited ? 'star-filled.png' : 'star-empty.png'}`;
    });

    // Refresh random modal content if visible
    if (randomModal.classList.contains('show')) {
      const title = randomModalContent.querySelector('.h2').textContent;
      const isFavorited = favorites.includes(title);
      const star = randomModalContent.querySelector('.favorite-star');
      star.src = `images/${isFavorited ? 'star-filled.png' : 'star-empty.png'}`;
    }
  }

  randomButton.addEventListener('click', () => {
    const unhiddenCocktails = Array.from(document.querySelectorAll('.cocktail')).filter(cocktail => cocktail.style.display !== 'none');
    const randomCocktail = unhiddenCocktails[Math.floor(Math.random() * unhiddenCocktails.length)];
    window.navigator.vibrate([5]);

    if (randomCocktail) {
      const randomContent = randomCocktail.cloneNode(true);
      randomContent.querySelector('.favorite-star').addEventListener('click', function() {
        const title = randomCocktail.dataset.title;
        toggleFavorite(title);
      });

      randomModalContent.innerHTML = '';
      randomModalContent.appendChild(randomContent);
      randomModal.classList.add('show');
      randomModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      menu.classList.add('blurred');
    }
  });

  randomModal.addEventListener('click', (event) => {
    if (event.target === randomModal) {
      window.navigator.vibrate([5]);
      randomModal.classList.remove('show');
      setTimeout(() => {
        randomModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        menu.classList.remove('blurred');
      }, 300); // Match this duration with the animation duration
    }
  });
});
