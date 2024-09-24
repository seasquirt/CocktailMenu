document.addEventListener('DOMContentLoaded', () => {
  const tags = document.querySelectorAll('.filter-tags .tag');
  const menu = document.querySelector('.menu');
  const noResults = document.querySelector('.no-results');
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

      cocktailDiv.innerHTML = `
        <span class="h2">${cocktail.title}</span>
        <span class="p">${cocktail.description}</span>
        <span class="p1"><i>${cocktail.ingredients}</i></span>
        <img class="favorite-star" src="images/${isFavorited ? 'star-filled.png' : 'star-empty.png'}" alt="Favorite">
        <div class="cocktail-tags">${cocktail.tags.split(' ').map(tag => `<span class="tag" data-tag="${tag.replace(/#/g, '')}">${tag.replace(/#/g, '')}</span>`).join('')}</div>
      `;

      // Add click event for the favorite star
      const star = cocktailDiv.querySelector('.favorite-star');
      star.addEventListener('click', () => toggleFavorite(cocktail.title, star));

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

  function toggleFavorite(title, star) {
    window.navigator.vibrate([5]);
    const index = favorites.indexOf(title);
    if (index >= 0) {
      // Remove from favorites
      favorites.splice(index, 1);
      star.src = 'images/star-empty.png';
    } else {
      // Add to favorites
      favorites.push(title);
      star.src = 'images/star-filled.png';
    }

    // Save favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
});
