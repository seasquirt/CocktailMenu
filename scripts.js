document.addEventListener('DOMContentLoaded', () => {
    const tags = document.querySelectorAll('.filter-tags .tag');
    const cocktails = document.querySelectorAll('.cocktail');
    const noResults = document.querySelector('.no-results');
  
    tags.forEach(tag => {
      tag.textContent = tag.dataset.tag;
      tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
        filterCocktails();
      });
    });
  
    cocktails.forEach(cocktail => {
      const cocktailTags = cocktail.dataset.tags.split(' ');
      const tagsContainer = cocktail.querySelector('.cocktail-tags');
      cocktailTags.forEach(tag => {
        const span = document.createElement('span');
        span.classList.add('tag');
        span.dataset.tag = tag;
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });
    });
  
    function filterCocktails() {
      const selectedTags = Array.from(document.querySelectorAll('.filter-tags .tag.selected'))
                                .map(tag => tag.dataset.tag);
  
      let visibleCocktails = 0;
  
      cocktails.forEach(cocktail => {
        const cocktailTags = cocktail.dataset.tags.split(' ');
        const hasAllSelectedTags = selectedTags.every(tag => cocktailTags.includes(tag));
  
        if (hasAllSelectedTags) {
          cocktail.style.display = '';
          visibleCocktails++;
        } else {
          cocktail.style.display = 'none';
        }
      });
  
      noResults.style.display = visibleCocktails > 0 ? 'none' : 'block';
    }
  
    filterCocktails();
  });
  