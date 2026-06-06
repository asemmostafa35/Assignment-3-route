let prodName = document.getElementById("prodName");
let prodPrice = document.getElementById("prodPrice");
let prodCategory = document.getElementById("prodCategory");
let prodDesc = document.getElementById("prodDesc");
let button = document.getElementById("addBtn");
let tbody = document.getElementById("card");
let prodfile = document.getElementById("prodfile");
let input1 = document.getElementById("searchInput");
let prodnamealret = document.getElementById("prodnamealret");
let prodpricealret = document.getElementById("prodpricealret");
let cuurentindex = 0;
let allprodect = [];
if (localStorage.getItem("object") !== null) {
  allprodect = JSON.parse(localStorage.getItem("object"));
  display();
}

function setobject() {
  if (
    validateAllInputs(prodCategory) &&
    validateAllInputs(prodName) &&
    validateAllInputs(prodPrice) &&
    validateAllInputs(prodDesc)
  ) {
    let imgsrc = prodfile.files[0]
      ? `images/${prodfile.files[0].name}`
      : `/images/download.jpg`;
    let value = {
      name: prodName.value,
      price: prodPrice.value,
      src: imgsrc,
      category: prodCategory.value,
      desc: prodDesc.value,
    };
    allprodect.push(value);
    localStorage.setItem("object", JSON.stringify(allprodect));
    display();
    clean();
  }
}

function display() {
  let kro = "";
  for (let i = 0; i < allprodect.length; i++) {
    kro += ` <div class="card mb-4">
        <img src="${allprodect[i].src}" class="card-img-top" alt="..." />
        <div class="card-body" id="cardt">
          <h5 class="card-title">${allprodect[i].name}</h5>
          <p class="card-text">${allprodect[i].price}</p>
          <p class="card-text">${allprodect[i].category}</p>
             <button onclick ="setformupdate(${i})" class="btn btn-outline-warning btn-sm">Update</button>
        <button onclick ="deleteobj(${i})" class="btn btn-outline-danger btn-sm">Delete</button>
        </div>
      </div>`;
  }
  tbody.innerHTML = kro;
}
function clean() {
  prodCategory.value = "";
  prodDesc.value = "";
  prodName.value = "";
  prodPrice.value = "";
}
function deleteobj(index) {
  allprodect.splice(index, 1);
  display();
  localStorage.setItem("object", JSON.stringify(allprodect));
}
function search() {
  let trem = input1.value.toLowerCase();
  let kro = "";
  for (let i = 0; i < allprodect.length; i++) {
    if (allprodect[i].name.toLowerCase().includes(trem)) {
      kro += ` <div class="card mb-4">
        <img src="${allprodect[i].src}" class="card-img-top" alt="..." />
        <div class="card-body" id="cardt">
          <h5 class="card-title">${allprodect[i].name}</h5>
          <p class="card-text">${allprodect[i].price}</p>
          <p class="card-text">${allprodect[i].category}</p>
             <button onclick ="setformupdate(${i})" class="btn btn-outline-warning btn-sm">Update</button>
        <button onclick ="deleteobj(${i})" class="btn btn-outline-danger btn-sm">Delete</button>
        </div>
      </div>`;
    }
  }
  tbody.innerHTML = kro;
}
function setformupdate(index) {
  prodCategory.value = allprodect[index].category;
  prodDesc.value = allprodect[index].desc;
  prodName.value = allprodect[index].name;
  prodPrice.value = allprodect[index].price;

  document.getElementById("addBtn").classList.add("d-none");
  document.getElementById("updateBtn").classList.remove("d-none");
}
function getformupdate() {
  let values = {
    name: prodName.value,
    price: prodPrice.value,
    category: prodCategory.value,
    desc: prodDesc.value,
  };
  allprodect.splice(cuurentindex, 1, values);
  display();
  clean();
  localStorage.setItem("object", JSON.stringify(allprodect));
  document.getElementById("addBtn").classList.remove("d-none");
  document.getElementById("updateBtn").classList.add("d-none");
}
button.onclick = function () {
  setobject();
};
// function validateName() {
//   let regexName = /^[A-Z][a-z]{3,5}$/;
//   let prodnameval = prodName.value;
//   if (regexName.test(prodnameval)) {
//     console.log(`match`);
//     prodName.classList.add(`is-valid`);
//     prodName.classList.remove(`is-invalid`);
//     prodnamealret.classList.replace("d-block", "d-none");
//     return true;
//   } else {
//     prodName.classList.add(`is-invalid`);
//     prodName.classList.remove(`is-valid`);
//     prodnamealret.classList.replace("d-none", "d-block");
//     return flase;
//   }
// }

// function validetPrice() {
//   let regux = /^[1-9][0-9]{3,5}$/;
//   let regexPrice = prodPrice.value;
//   if (regux.test(regexPrice)) {
//     prodPrice.classList.add(`is-valid`);
//     prodPrice.classList.remove(`is-invalid`);
//     prodpricealret.classList.replace(`d-block`, `d-none`);
//     return true;
//   } else {
//     prodPrice.classList.remove(`is-valid`);
//     prodPrice.classList.add(`is-invalid`);
//     prodpricealret.classList.replace(`d-none`, `d-block`);
//     return flase;
//   }
// }
function validateAllInputs(element) {
  let id = element.id;
  let inputValue = element.value;

  const patterns = {
    prodName: /^[A-Z][a-z]{3,5}$/,
    prodPrice: /^[1-9][0-9]{3,5}$/,
    prodCategory: /^(Mobile|Screens|laptop)$/i,
    prodDesc: /^.{6,}$/,
  };
  if (patterns[id].test(inputValue)) {
    element.classList.add(`is-valid`);
    element.classList.remove(`is-invalid`);
    element.nextElementSibling.classList.replace(`d-block`, `d-none`);
    return true;
  } else {
    element.classList.remove(`is-valid`);
    element.classList.add(`is-invalid`);
    element.nextElementSibling.classList.replace(`d-none`, `d-block`);
    return false;
  }
}
