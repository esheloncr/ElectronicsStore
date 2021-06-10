$(document).ready(function(){
    let current_data;
    function debounce(fn, ms){
        let timeout;
        return function() {
            fnCall = () => {fn.apply(this, arguments)}
            clearTimeout(timeout);
            timeout = setTimeout(fnCall, ms)
            }
        }
    function fquery(data){
        document.querySelector('.row.product').innerHTML = ''
        for(let i=0; i<data.length; i++){
                    elem = document.createElement('div')
                    elem.innerHTML =  '<h3>' + data[i].title + '</h3>' + '<p class="description">' + data[i].description + '</p>' + '<p>Цена: ' + data[i].price + '</p>' + '<p>Остаток на складе: ' + data[i].balance + '</p>'
                    elem.setAttribute('class', 'pos_' + data[i].id + ' ' + 'col-6')
                    document.querySelector('.row.product').appendChild(elem)
                }
        current_data = data;
    }
    function sort(data, option){
        if(option == 'title'){
            data.sort()
        }
        data.sort(function(a, b){
            switch(option){
                case 'ascending':
                    return a.price - b.price;
                case 'descending':
                    return b.price - a.price;
                case 'availability':
                    return b.balance - a.balance;
            }
        })
    }
    function filter(option){
        $.ajax({
            method: 'get',
            url: 'api/products',
            data: {'category': option},
            success: function(data){
                sort(data, $('#srt').val())
                fquery(data)
            }
        })
    }
    $.ajax({
        method: 'get',
        url: 'api/products',
        success: function(data){
            fquery(data)
        }
    })
    $.ajax({
        method: 'get',
        url: 'api/categories',
        success: function(data){
            console.log(data)
            for(let i=0;i<data.length;i++){
                $('#flt').append('<option value="' + data[i].id +'">' + data[i].title + '</option>')
            }
        }
    })
    $('.srch').on('input', debounce(function(){
        data = {
            'srch': $('.srch').val()
        }
        $.ajax({
            method: 'get',
            data: data,
            url: 'api/search',
            success: function(data){
                fquery(data)
            }
        })
    }, 750))
    $('.ordering').on('click', function(){
        sort(current_data, $('#srt').val())
        fquery(current_data)
    })
    $('.flt').on('click', function(){
        filter($('#flt').val())
    })
    $('.rflt').on('click', function(){
        $.ajax({
            method: 'get',
            url: 'api/products',
            success: function(data){
                fquery(data)
            }
        })
    })
    // сделать блок с фильтрами, по цене: от - до, по наличию: да - нет, по компании и категории: названия
})