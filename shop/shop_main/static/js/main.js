$(document).ready(function(){
    $('.flt').hide()
    $('#flt').hide()
    $('.rflt').hide()
    $('.nchng').hide()
    let current_data;
    let focused;
    function check_balance(sub_data){
        if (sub_data > 1) return true;
        else return false;
    }
    function serializer(data){
        if (data.results) return data.results;
        else return data;
    }
    function debounce(fn, ms){
        let timeout;
        return function() {
            fnCall = () => {fn.apply(this, arguments)}
            clearTimeout(timeout);
            timeout = setTimeout(fnCall, ms)
            }
        }
    function fquery(data){
        data = serializer(data)
        document.querySelector('.row.product').innerHTML = ''
        for(let i=1; i<data.page_numbers; i++){
            elem = document.createElement('button')
            elem.innerHTML = i
            document.querySelector('.pagination').appendChild(elem)
        }
        for(let i=0; i<data.length; i++){
                    check_balance(data[i].balance) ? label = "В наличии":label = "Нет в наличии";
                    data[i].photo = data[i].photo.replace('shop_main/', '')
                    elem = document.createElement('div')
                    elem.innerHTML = '<h3>' + data[i].title +'</h3>' + '<p class="description">' + data[i].description + '</p>' + '<p>Цена: ' + data[i].price + '</p>' + label + '</p>' + '<img src="' + data[i].photo + '" alt="">'
                    elem.setAttribute('class', 'pos_' + data[i].id + ' ' + 'col-6')
                    document.querySelector('.row.product').appendChild(elem)
                }
        current_data = data;
    }
    function current_product(data){
        if (focused) return;
        block_name = data.target.closest('div').className
        block_name = block_name.replace(' ', '.')
        block_name = '.' + block_name
        $('.row.product').each(function(){
            $(this).children('div').not($(block_name)).hide()
        })
        $('.container').append(
            '<button class="focused">Назад</button>'
        )
        focused = true
    }
    function back_to_catalog(){
        focused = false
        $('.row.product').each(function(){
            $(this).children('div').show()
        })
        $('.focused').remove();
    }
    function sort(data, option){
        data = serializer(data)
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
            url: 'api/v1/products',
            data: {'category': option},
            success: function(data){
                data = serializer(data)
                sort(data, $('#srt').val())
                fquery(data)
            }
        })
    }
    $.ajax({
        method: 'get',
        url: 'api/v1/products',
        success: function(data){
            fquery(data)
        }
    })
    $.ajax({
        method: 'get',
        url: 'api/v1/categories',
        success: function(data){
            data = serializer(data)
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
            url: 'api/v1/search',
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
            url: 'api/v1/products',
            success: function(data){
                fquery(data)
            }
        })
    })
    $('.pag').on('click', function(){
        $.ajax({
            method: 'get',
            url: 'api/v1/products',
            data: {'page': 2},
            success: function(data){
                console.log(data)
            }
        })
    })
    $('.row.product').on('click', function(e){
        current_product(e);
    })
    $(document).on('click', '.focused', function(){
        back_to_catalog();
    })
    //$(document).on('click', function(e){
        // Проверка места, куда нажал пользователь
        //back_to_catalog()
    //})
    $('.chng').on('click', function(){
        $('.flt').show()
        $('#flt').show()
        $('.rflt').show()
        $('.chng').hide()
        $('.nchng').show()
    })
    $('.nchng').on('click', function(){
        $('.chng').show()
        $('.flt').hide()
        $('#flt').hide()
        $('.rflt').hide()
        $('.nchng').hide()
    })
})