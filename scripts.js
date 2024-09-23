document.addEventListener('DOMContentLoaded', () => {
  const tags = document.querySelectorAll('.filter-tags .tag');
  const menu = document.querySelector('.menu');
  const noResults = document.querySelector('.no-results');

  // Define the cocktail data directly in JavaScript
  const cocktails = [
    {
      title: "Life Is Balloons",
      description: "This delicious craft gin cocktail is bursting with juicy flavors",
      ingredients: "Gin, Peach Liqueur, Orange Juice, Happiness",
      tags: "#Sweet #Tart #Fresh"
    },
    {
      title: "London Calling",
      description: "A floral twist on gin tonic infused with the sweetness of elder flower",
      ingredients: "Gin, Elderflower Liqueur, Lime, Tonic, Stoicism",
      tags: "#Fresh #Herbal #Sweet #Dry"
    },
    {
      title: "Too Much Volcano",
      description: "A fiery homage to Mount Aso, the largest active volcano in Japan",
      ingredients: "El Charro Silver Tequila, Grapefruit Juice, Cointreau, Lime, Tonic, Spice!",
      tags: "#Strong #Tart #Spicy #Fizzy"
    }
    // Add more cocktails here
  ];

  tags.forEach(tag => {
    tag.textContent = tag.dataset.tag;
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
      filterCocktails();
      window.navigator.vibrate([5]);
    });
  });

  function loadCocktails(data) {
    menu.innerHTML = ''; // Clear existing cocktails

    data.forEach(cocktail => {
      const cocktailDiv = document.createElement('div');
      cocktailDiv.classList.add('cocktail');
      cocktailDiv.dataset.tags = cocktail.tags.replace(/#/g, '');

      cocktailDiv.innerHTML = `
        <span class="h2">${cocktail.title}</span>
        <span class="p">${cocktail.description}</span>
        <span class="p1"><i>${cocktail.ingredients}</i></span>
        <div class="cocktail-tags">${cocktail.tags.split(' ').map(tag => `<span class="tag" data-tag="${tag.replace(/#/g, '')}">${tag.replace(/#/g, '')}</span>`).join('')}</div>
      `;
      menu.appendChild(cocktailDiv);
    });

    filterCocktails();
    window.navigator.vibrate([5]);
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
        if (cocktail.style.display === 'none') {
          cocktail.classList.remove('fade-out');
          cocktail.classList.add('fade-in');
          cocktail.style.display = '';
        }
        visibleCocktails++;
      } else {
        if (cocktail.style.display !== 'none') {
          cocktail.classList.remove('fade-in');
          cocktail.classList.add('fade-out');
          setTimeout(() => {
            cocktail.style.display = 'none';
          }, 500); // Match this duration with the animation duration
        }
      }
    });

    noResults.style.display = visibleCocktails > 0 ? 'none' : 'block';
  }

  // Load cocktails on page load
  loadCocktails(cocktails);
});
