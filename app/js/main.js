$(function () {
	var mixer = mixitup('.gallery__items');
	$('.slider-blog__inner').slick({
		arrows: false,
		dots: true,
	});
	$('.header__burger').on('click', function () {
		$('.header__burger,.header__menu, .header__inner').toggleClass('active')
		$('body').toggleClass('lock')

	})
});