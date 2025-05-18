"use strict";


// const { default: Swiper } = require("swiper");

// Инициализация Fancybox
if (typeof Fancybox !== "undefined" && Fancybox !== null) {
    Fancybox.bind("[data-fancybox]", {
        dragToClose: false,
        closeButton: false
    });
}


$(document).ready(function () {


    // click handler
    $(document).on("click", function (e) {
        const $target = $(e.target);

        if ($target.closest('.header__menu-toggler').length) {
            $('.header').toggleClass('open-menu');
            $('body').toggleClass('lock-menu');
        }

        if ($target.hasClass('menu__link')) {
            $target.toggleClass('active');
            $target.next().toggleClass('active');
        }

        if ($target.hasClass('header__languages-current')) {
            $target.next().slideToggle();
        }

        if ($target.hasClass('service__calc-tab')) {
            $target.addClass('active').siblings().removeClass('active');
            $('.service__calc-content').eq($target.index()).addClass('active').siblings().removeClass('active');
        }
    });

    // service calc
    const $form = $('.service__calc-form');
    if ($form.length) {
        const $quantityInput = $form.find('input[name="quantity"]');
        const $unit = $form.find('.service__calc-unit');

        function updateLimits() {
            const $selected = $form.find('input[name="option"]:checked');
            const min = parseInt($selected.data('min'), 10);
            const max = parseInt($selected.data('max'), 10);
            const unit = $selected.data('text');


            $unit.text(unit);

            let current = parseInt($quantityInput.val(), 10);
            if (isNaN(current) || current < min) current = min;
            if (current > max) current = max;
            $quantityInput.val(current);


            $quantityInput.data('min', min).data('max', max);
        }


        $form.on('change', 'input[name="option"]', function () {
            updateLimits();
        });


        $form.find('.service__calc-up').on('click', function () {
            const current = parseInt($quantityInput.val(), 10);
            const max = parseInt($quantityInput.data('max'), 10);
            if (current < max) {
                $quantityInput.val(current + 1);
            }
        });

        $form.find('.service__calc-down').on('click', function () {
            const current = parseInt($quantityInput.val(), 10);
            const min = parseInt($quantityInput.data('min'), 10);
            if (current > min) {
                $quantityInput.val(current - 1);
            }
        });


        updateLimits();
    }


    // init select2
    $('.select').select2({
        minimumResultsForSearch: Infinity
    })

    // init datepicker
    new Datepicker('.form__control-date')


    // Input type="tel" Mask
    if ($('input[type="tel"]').length > 0) {
        $('input[type="tel"]').each(function (idx, input) {


            const iti = intlTelInput(input, {
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
                initialCountry: "ru",
                preferredCountries: ['ru'],
                autoPlaceholder: false,
                separateDialCode: true
            });


            function setMask() {
                const mask = getFormattedNumber("9");
                const formattedExampleNumber = getFormattedNumber();

                $(input).inputmask('remove');
                $(input).inputmask({
                    "mask": mask,
                    showMaskOnHover: false,
                })

                $(input).attr('placeholder', formattedExampleNumber);

                $(input).on('blur', function () {
                    $(input).attr('placeholder', formattedExampleNumber);
                })

            }

            function getFormattedNumber(symbol = "_") {
                const countryData = iti.getSelectedCountryData();

                const exampleNumber = intlTelInputUtils.getExampleNumber(
                    countryData.iso2,
                    false,
                    intlTelInputUtils.numberFormat.INTERNATIONAL
                );

                const numberWithoutDialCode = exampleNumber.replace(/^\+\d{1,3}/, '').trimStart();
                const formattedNumber = numberWithoutDialCode.replace(/\d/g, symbol);

                return formattedNumber;
            }


            $(input).on('countrychange', function () {
                setMask();
            });

            iti.promise.then(function () {
                setMask();
            });


        });
    }

    // sliders
    if ($('.promo__slider').length) {
        new Swiper('.promo__slider', {
            slidesPerView: 1,
            effect: "fade",
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false
            },
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: ".promo__pagination",
                clickable: true
            }
        })


    }

    if ($('.promo__services-slider').length) {
        new Swiper('.promo__services-slider .swiper', {
            slidesPerView: 1,
            navigation: {
                nextEl: ".promo__services-next",
                prevEl: ".promo__services-prev",
            },
            breakpoints: {
                767.98: {
                    slidesPerView: 2
                },
                1100: {
                    slidesPerView: 3
                }
            }
        })
    }


    // parallax

    function parallax($elements, xpos = "50%", speedFactor = 0.1, outerHeight = true) {
        let windowHeight = $(window).height();

        function getHeight($el) {
            return outerHeight ? $el.outerHeight(true) : $el.height();
        }

        function update() {
            const pos = $(window).scrollTop();

            $elements.each(function () {
                const $el = $(this);
                const top = $el.offset().top;
                const height = getHeight($el);

                if ((top + height < pos) || (top > pos + windowHeight)) {
                    return;
                }

                $el.css('background-position', `${xpos} ${Math.round((top - pos) * speedFactor)}px`);
            });
        }

        $(window).on('scroll', update);
        $(window).on('resize', function () {
            windowHeight = $(window).height();
            update();
        });

        update();
    }

    function initParallax() {
        if (/Mobi/.test(navigator.userAgent)) return;

        const $parallaxEls = $('.parallax');

        if ($parallaxEls.length) {
            parallax($parallaxEls, "50%", 0.2);
        }
    }

    initParallax();


    // scroll animation

    if (!!window.IntersectionObserver) {
        const callback = function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                }
            });
        };

        const observer = new IntersectionObserver(callback);

        const targets = document.querySelectorAll(".js-animatedScroll");
        targets.forEach(function (target) {
            observer.observe(target);
        });
    }


    // header offset page 
    getHeaderHeight();

    function getHeaderHeight() {
        const headerHeight = $('.header').outerHeight();
        $('body').css('--header-height', `${headerHeight}px`);
    }

    $(window).on('resize', getHeaderHeight);


});

