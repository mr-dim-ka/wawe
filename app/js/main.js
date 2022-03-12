$(function () {

	$('.menu a').on('click', function (event) {
		//отменяем стандартную обработку нажатия по ссылке
		event.preventDefault();

		//забираем идентификатор бока с атрибута href
		var id = $(this).attr('href'),

			//узнаем высоту от начала страницы до блока на который ссылается якорь
			top = $(id).offset().top;

		//анимируем переход на расстояние - top за 1500 мс
		$('body,html').animate({ scrollTop: top }, 1500);
	});

	var mixer = mixitup('.gallery__items');

	$('.slider-blog__inner').slick({
		arrows: false,
		dots: true,
	});

	$('.header__burger, .menu a').on('click', function () {
		$('.header__burger,.header__menu, .header__inner').toggleClass('active')
		$('body').toggleClass('lock')

	});

});