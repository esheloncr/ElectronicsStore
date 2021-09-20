$('.flt').hide()
$('#flt').hide()
$('.rflt').hide()
$('.nchng').hide()
let current_data;
let focused;
let state;
let auth_headers;
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
        elem.innerHTML = '<h3>' + data[i].title +'</h3>' + '<p class="description">' + data[i].description + '</p>' + '<p>Цена: ' + data[i].price + '</p>' + label + '</p>' + '<img src="' + data[i].photo + '" alt="">' + "<button class='add-to-cart'>Добавить в корзину</button>"
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
function register(){
    $('.container').hide()
    elem = document.createElement('form')
    elem.setAttribute('class', 'register')
    elem.innerHTML = '<span>Логин</span><input type="text" label="Логин" required minlength="6" maxlength="15">' + '<br>' + '<span>Пароль</span><input type="password" required minlength="6" maxlength="15">' + '<button style="margin-top: 25%; margin-left: 10%;">Зарегистрироваться</button>'
    state = 1
    document.querySelector('body').appendChild(elem)
}
function login(){
    $('.container').hide()
    elem = document.createElement('form')
    elem.setAttribute('class', 'login')
    elem.innerHTML = '<span>Логин</span><input type="text" label="Логин" required minlength="6" maxlength="15">' + '<br>' + '<span>Пароль</span><input type="password" required minlength="6" maxlength="15">' + '<button style="margin-top: 25%; margin-left: 10%;">Войти</button>'
    document.querySelector('body').appendChild(elem)
}
function back(state){
    switch(state){
        case 0:
            console.log('//')
            break
        case 1:
            $('.register').remove()
            $('.container').show()
            break
    }   
}
function addToCart(){
    cart = document.querySelector(".cart").append("Some match");
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
$(document).on('submit', '.register',function(r){
    login = $('.register')[0][0].value
    password = $('.register')[0][1].value
    data = {
        email: "", 
        username: login,
        password: password,
    }
    data = JSON.stringify(data)
    $.ajax({
        method: 'POST',
        contentType: 'application/json',
        data: data,
        url: 'auth/users/',
        success: function(data){
            console.log(data)
            alert('success')
            $('.register').remove()
            $('.container').show()
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR)
            error = document.createElement('p')
            if (jqXHR['responseJSON'] != undefined){
                error.innerHTML = jqXHR['responseJSON']
            }
            if (jqXHR['responseText'] != undefined){
                error.innerHTML = jqXHR['responseText']
            }
            document.querySelector('.register').appendChild(error)
        }
    })
    r.preventDefault()
})
$(document).on('submit', '.login', function(l){
    login = $('.login')[0][0].value
    password = $('.login')[0][1].value
    data = {
        username: login,
        password: password,
    }
    data = JSON.stringify(data)
    $.ajax({
        method: 'POST',
        contentType: 'application/json',
        data: data,
        url: 'auth/jwt/create/',
        success: function(data){
            auth_headers = {
                'refresh': data['refresh'],
                'access': data['access']
            }
            $('.login').remove()
            $('.container').show()
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR)
            error = document.createElement('p')
            if (jqXHR['responseJSON'] != undefined){
                error.innerHTML = jqXHR['responseJSON']
            }
            if (jqXHR['responseText'] != undefined){
                error.innerHTML = jqXHR['responseText']
            }
            document.querySelector('.login').appendChild(error)
        }
    })
    l.preventDefault()
})

$(document).on('click', '.btn.reg', function(){
    register();
    // дописать логику кнопки "Назад"
    state = 1;
})
$(document).on('click', '.btn.log', function(){
    login();
})
$(document).on('click', '.focused', function(){
    back_to_catalog();
    state = 0;
})
$(document).on('click', '.btn.back-button', function(){
    back(state);
})
$(document).on('click', function(e){
    console.log(state)
    if (state > 0 && $('.btn.back-button').length == 0) {
        back_button = document.createElement('button')
        back_button.innerHTML = 'Назад'
        back_button.setAttribute('class', 'btn back-button')
        document.querySelector('body').appendChild(back_button)
    }
    console.log(auth_headers['access'])
    $.ajax({
        method: 'get',
        headers: {
            Authentication: 'Token ' + auth_headers['access']
        },
        url: 'api/v1/cart',
        success: function(){
            alert("auth")
        },
        error: function(){
            alert("not auth")
        }
     //Проверка места, куда нажал пользователь
    })
    //back_to_catalog()
})
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