let currentData;
let scrollYPosition;
let scrollXPosition;
let sortOption = document.querySelector("#srt");
let filterOption = document.querySelector("#filters-selection");
const productsSelector = document.querySelector(".row.product");
const sortButton = document.querySelector(".ordering");
const searchInput = document.querySelector(".search-input");
const filterButton = document.querySelector(".apply-filter");
const removeFilterButton = document.querySelector(".remove-filter");

let state = {
    sortOptionState: sortOption.value,
    filterOptionState: filterOption.value,
    dataState: currentData,
    focused: false,
    scrollPosition: {
        x: scrollXPosition,
        y: scrollYPosition
    }
};

function drawProducts(data){
    let productListSelector = document.querySelector(".row.product");
    productListSelector.innerHTML = "";
    for (let i=0;i<data.length; i++){
        let balance = data[i].balance;
        let title = data[i].title;
        let description = data[i].description;
        let price = data[i].price;
        let photoUrl = data[i].photo;
        photoUrl = photoUrl.replace("shop_main/", "")
        if (balance > 0){
            balance = "В наличии"
        }
        else {
            balance = "Нет в наличии"
        }
        let element = document.createElement("div");
        element.innerHTML = "<h3>" + title + "</h3>" + "<p class='description'>" + description +"</p>" + "<img class='item-img' alt='' src=" + photoUrl + ">" + "<p>Цена: " + price +"</p>" + "<p>" + balance + "</p>";
        element.setAttribute("class", "item")
        element.addEventListener("click", (event) => {
            singleProduct(event.target);
        });
        productListSelector.appendChild(element);
    }
    state.dataState = data;
}
function initialize(){
    $.ajax({
        method: "GET",
        url: "api/v1/products",
        success: function (data){
            drawProducts(data);
        },
        error: function (errorData){
            console.log(errorData);
        }
    })
    $.ajax({
        method: "GET",
        url: "api/v1/categories",
        success: (data) => {
            data.forEach(option => {
                newOption = "<option value=".concat(option.id).concat(">".concat(option.title)).concat("</option>") // странную вещь я вообще написал))
                document.querySelector("#filters-selection").innerHTML += newOption;
            })
        }
    })
    sortButton.addEventListener("click", (event) => {
        let sortOption = document.querySelector("#srt").value;
        if (state.sortOptionState === sortOption){
            return;
        }
        sortProducts(state.dataState, sortOption);
        state.sortOptionState = sortOption;
        drawProducts(state.dataState);
    })
    searchInput.addEventListener("input", debounce(() => {
        search(searchInput.value);
    },550));
    filterButton.addEventListener("click", (e) => {
        state.filterOptionState = filterOption.value;
        filterProducts(state.filterOptionState);
    })
    removeFilterButton.addEventListener("click", (e) => {
        filterProducts(null);
    })
    /*
    to do:
    Спрятать кнопку снятия фильтра до фильтрации, ограничить фильтр по одному и тому-же условию(что-бы не посылать запросы)
     */
}
function sortProducts(data, option){
    data.sort(function(a, b){
        switch (option){
            case 'ascending':
                return a.price - b.price;
            case 'descending':
                return b.price - a.price;
            case 'availability':
                return b.balance - a.balance;
        }
    })
}
function search(query){
    if (!query){
        $.ajax({
            method: "GET",
            url: "api/v1/products",
            success: (data) => {
                drawProducts(data);
            }
        })
    }
    let data = {
        query: query,
    };
    $.ajax({
        method: "POST",
        url: "api/v1/search/",
        data: data,
        success: (data) => {
            drawProducts(data.result);
        }
    });
}
function filterProducts(option){
    data = {
        category: option
    }
    $.ajax({
        method: "GET",
        url: "api/v1/products",
        data: data,
        success: (data) => {
            console.log(data);
            drawProducts(data);
        },
        error: (errData) => {
            console.log(errData);
        }
    })
}
function singleProduct(target){
    if (state.focused) return;
    scrollXPosition = window.scrollX;
    scrollYPosition = window.scrollY;
    target.closest(".description").className = "full-description";
    target.closest("div").className = "focused";
    document.querySelectorAll(".item").forEach(item => {
        item.style.display = "none";
    })
    state.focused = true;
    state.scrollPosition.x = scrollXPosition;
    state.scrollPosition.y = scrollYPosition;
    let backButton = document.createElement("button")
    backButton.innerHTML = "Назад";
    backButton.setAttribute("class", "back-to-products")
    target.closest("div").appendChild(backButton);
    backButton.addEventListener("click", (event) => {
        unhideProducts(event);
    })
}
function unhideProducts(event){
    document.querySelector(".full-description").className = "description";
    if (!state.focused) return;
    event.target.closest("div").className = "item";
    document.querySelectorAll(".item").forEach(item => {
        item.style.display = "";
    })
    document.querySelector(".back-to-products").remove();
    state.focused = false;
    window.scrollTo(state.scrollPosition.x, state.scrollPosition.y);
}
function debounce(fn, ms){
    let timeout;
    return function() {
        fnCall = () => {fn.apply(this, arguments)}
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms)
        }
}
function getCSRFToken(){
    let splitCookie = document.cookie.split(";");
    splitCookie.forEach(cookie => {
        if (cookie.csrftoken) {
            return cookie.csrftoken;
        }
    })
}

initialize();
