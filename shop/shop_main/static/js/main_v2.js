let currentData;
let sortButton = document.querySelector(".ordering")
let sortOption = document.querySelector("#srt")
let searchInput = document.querySelector(".search-input")

let state = {
    sortOptionState: sortOption.value
}

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
        element.innerHTML = "<h3>" + title + "</h3>" + "<p>" + description +"</p>" + "<img alt='' src=" + photoUrl + ">" + "<p>Цена: " + price +"</p>" + "<p>" + balance + "</p>";
        productListSelector.appendChild(element);
    }
    currentData = data;
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
    sortButton.addEventListener("click", (event) => {
        let sortOption = document.querySelector("#srt").value;
        if (state.sortOptionState === sortOption){
            return;
        }
        sortProducts(currentData, sortOption);
        state.sortOptionState = sortOption;
        drawProducts(currentData);
        // $.ajax({
        //     method: "GET",
        //     url: "api/v1/products",
        //     success: (data) => {
        //         sortProducts(data, sortOption);
        //         state.sortOptionState = sortOption;
        //         drawProducts(data);
        //     }
        // })
    })
    searchInput.addEventListener("input", debounce(() => {
        search(searchInput.value);
    },550));

}
function sortProducts(data, option){
    console.log(option)
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
