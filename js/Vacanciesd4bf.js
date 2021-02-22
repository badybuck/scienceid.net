/**
 * Вакансии который беруться со стороннего сервиса
 */
const Vacancies = new function () {
    this.run = function () {
        slider();
    };

    /**
     * Отображение списка вакансий через ajax
     */
    function listAjax() {
        $.ajax({
            type: "POST",
            url: $('.js_researchScientist').attr('data-url'),
            dataType: 'json',
            data: {
                _csrf: $('meta[name="csrf-token"]').attr('content')
            },
            success: function (server) {
                $('.js_researchScientist').html(server.result);
                slider();
            }
        });
    }

    /**
     * Подключаем слайдер для вакансий
     */
    function slider() {
        $('.vacancies__slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        dots: false,
                        arrows: false
                    }
                }
            ]
        });
    }
};

$(document).ready(function () {
    Vacancies.run();
});