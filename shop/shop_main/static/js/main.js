$(document).ready(function(){
    $.ajax({
        method: 'get',
        url: 'api/products',
        success: function(data){
            for(let i=0; i<data.length; i++){
                elem = document.createElement('div')
                elem.innerHTML =  '<h3>' + data[i].title + '</h3>' + '<p class="description">' + data[i].description + '</p>' + '<p>Цена: ' + data[i].price + '</p>' + '<p>Остаток на складе: ' + data[i].balance + '</p>'
                elem.setAttribute('class', 'pos_' + data[i].id)
                document.querySelector('.query').appendChild(elem)
            }
        }
    })
    $('.order').on('click', function(){
        $.ajax({
            method: 'get',
            data: {'order_by': 1},
            url: 'api/products',
            success: function(data){
                console.log(data)
                document.querySelector('.query').innerHTML = ""
                for(let i=0; i<data.length; i++){
                elem = document.createElement('div')
                elem.innerHTML =  '<h3>' + data[i].title + '</h3>' + '<p class="description">' + data[i].description + '</p>' + '<p>Цена: ' + data[i].price + '</p>' + '<p>Остаток на складе: ' + data[i].balance + '</p>'
                elem.setAttribute('class', 'pos_' + data[i].id)
                document.querySelector('.query').appendChild(elem)
                }
            }
        })
        $('.order').remove()
    })
})