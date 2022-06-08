document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
});

let data = [{
  id: 0,
  name: "Edame Noodles",
  ingredients: "Edame Beans, Noodels, Garlic oil",
  image: '/img/dish.png',
},{
  id: 1,
  name: "Edame Noodles",
  ingredients: "Edame Beans, Noodels, Garlic oil",
  image: '/img/dish.png',
},{
  id: 2,
  name: "Edame Noodles",
  ingredients: "Edame Beans, Noodels, Garlic oil",
  image: '/img/dish.png',
},{
  id: 3,
  name: "Edame Noodles",
  ingredients: "Edame Beans, Noodels, Garlic oil",
  image: '/img/dish.png',
},{
  id: 4,
  name: "Edame Noodles",
  ingredients: "Edame Beans, Noodels, Garlic oil",
  image: '/img/dish.png',
},{
  id: 5,
  name: "Edame Noodles",
  ingredients: "Edame Beans, Noodels, Garlic oil",
  image: '/img/dish.png',
}];
function populate(data) {
  $('#cart').empty();
  data.forEach(function(dish) {
    const template = `
    <div class="card-panel recipe white row" data-id="${dish.id}">
        <img src="${dish.image}" alt="recipe thumb">
        <div class="recipe-details">
          <div class="recipe-title">${dish.name}</div>
          <div class="recipe-ingredients">${dish.ingredients}</div>
        </div>
        <div class="recipe-delete" data-id="${dish.id}">
          <i class="material-icons" data-id="${dish.id}">delete_outline</i>
        </div>
      </div>
      `;
      $('#cart').append(template);
  });
}
populate(data);

$(document).on('click', '.recipe-delete', function() {
  const id = $(this).data('id');
  $(`.recipe[data-id="${id}"]`).remove();
  data = data.filter(dish => dish.id !== id);
});

$("#add-to-cart").on("click", function(e) {
  e.preventDefault();
  const name = $(".name").val();
  const ingredients = $(".ingredients").val();
  const image = "/img/dish.png";
  const id = data.length;
  const dish = {
    id,
    name,
    ingredients,
    image,
  };
  data.push(dish);
  populate(data);
  $(".name").val("");
  $(".ingredients").val("");
});

$(".checkout").click(() => {
  displayNotification(data);
});