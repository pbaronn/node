document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const nameInput = document.getElementById('name');
    const itemsList = document.getElementById('items');
  
    function loadItems() {
      fetch('/api/items')
        .then(res => res.json())
        .then(data => {
          itemsList.innerHTML = '';
          data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
              <span contenteditable="true" onblur="updateItem(${item.id}, this.textContent)">${item.name}</span>
              <button onclick="deleteItem(${item.id})">🗑️</button>
            `;
            itemsList.appendChild(li);
          });
        });
    }
  
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = nameInput.value;
      fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      }).then(() => {
        nameInput.value = '';
        loadItems();
      });
    });
  
    window.updateItem = (id, name) => {
      fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      }).then(loadItems);
    };
  
    window.deleteItem = id => {
      fetch(`/api/items/${id}`, {
        method: 'DELETE'
      }).then(loadItems);
    };
  
    loadItems();
  });
  