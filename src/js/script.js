document.addEventListener('DOMContentLoaded', function() {
    // Selectors

    document.querySelector('.form__dropdown').addEventListener('change', function() {
        if (this.value) {
            this.classList.add('has-value');
        } else {
            this.classList.remove('has-value');
        }
    });

    // Функция для проверки заполненности всех селекторов и последовательной активации
    function checkAndActivateSelectors() {
        const selectors = document.querySelectorAll('.form__selector');
        
        selectors.forEach((selector, index) => {
            if (index === 0) {
                selector.classList.remove('disactive');
                selector.classList.add('active');
            } else {
                selector.classList.add('disactive');
                selector.classList.remove('active');
            }
        });

        selectors.forEach((selector, index) => {
            const customSelect = selector.querySelector('.custom-select');
            const hiddenSelect = customSelect.nextElementSibling;

            customSelect.addEventListener('click', function() {
                if (!selector.classList.contains('disactive')) {
                    toggleSelectVisibility(customSelect);
                }
            });

            const items = customSelect.querySelectorAll('.select-items div');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    const value = item.getAttribute('data-value');
                    const content = item.innerHTML;
                    updateSelected(customSelect, value, content);

                    // Проверяем и активируем следующий селектор
                    if (index < selectors.length - 1) {
                        selectors[index + 1].classList.remove('disactive');
                        selectors[index + 1].classList.add('active');
                    }

                    // Проверяем заполненность всех селекторов
                    checkAllSelectorsFilled();
                });
            });
        });
    }

    function checkAllSelectorsFilled() {
        const allFilled = Array.from(document.querySelectorAll('.custom-select')).every(select => {
            const hiddenSelect = select.nextElementSibling;
            return hiddenSelect && hiddenSelect.value;
        });

        const button = document.querySelector('.form__button');

        if (allFilled) {
            button.classList.remove('disactive');
            button.classList.add('active');
            button.disabled = false;
        } else {
            button.classList.add('disactive');
            button.classList.remove('active');
            button.disabled = true;
        }
    }

    function toggleSelectVisibility(select) {
        const items = select.querySelector('.select-items');
        const selected = select.querySelector('.select-selected');

        document.querySelectorAll('.custom-select').forEach(function(otherSelect) {
            if (otherSelect !== select) {
                otherSelect.querySelector('.select-items').style.display = 'none';
                otherSelect.querySelector('.select-selected').classList.remove('select-arrow-active');
            }
        });

        items.style.display = items.style.display === 'block' ? 'none' : 'block';
        selected.classList.toggle('select-arrow-active');
    }

    function updateSelected(select, value, content) {
        const selected = select.querySelector('.select-selected');
        const items = select.querySelector('.select-items');

        // Обновляем текст выбранного элемента
        selected.innerHTML = content;

        // Меняем цвет текста на #211A00
        selected.style.color = '#211A00';

        // Обновляем класс "same-as-selected" для выбранного элемента
        items.querySelector('.same-as-selected')?.classList.remove('same-as-selected');
        items.querySelector(`[data-value="${value}"]`).classList.add('same-as-selected');
        
        // Закрываем выпадающий список после выбора
        items.style.display = 'none';
        selected.classList.remove('select-arrow-active');

        const hiddenSelect = select.nextElementSibling;
        if (hiddenSelect && hiddenSelect.tagName.toLowerCase() === 'select') {
            hiddenSelect.value = value;
            hiddenSelect.dispatchEvent(new Event('change'));
        }
        
        // Добавляем вызов toggleSelectVisibility, чтобы закрыть селектор
        toggleSelectVisibility(select);
    }


    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.select-items').forEach(function(items) {
                items.style.display = 'none';
            });
            document.querySelectorAll('.select-selected').forEach(function(selected) {
                selected.classList.remove('select-arrow-active');
            });
        }
    });

    // Устанавливаем начальное состояние селекторов
    checkAndActivateSelectors();


    // Search

    const searchInput = document.getElementById('searchInput');
    const dropdownContent = document.getElementById('dropdownContent');

    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            dropdownContent.style.display = 'block';
        } else {
            dropdownContent.style.display = 'none';
        }
    });

    searchInput.addEventListener('focus', function() {
        if (this.value.length > 0) {
            dropdownContent.style.display = 'block';
        }
    });

    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });


    // Sliders

    const categoriesSlider = new Swiper('.slider__categories', {
        slidesPerView: 6,
        spaceBetween: 25,
        loop: true,
        navigation: {
            nextEl: '.detail-arrow-next',
            prevEl: '.detail-arrow-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 3,
                centeredSlides: true,
                initialSlide: 1,
            },
            576: {
                slidesPerView: 4,
                centeredSlides: false,
                initialSlide: 0,
            },
            1024: {
                slidesPerView: 6,
            },
        },
    });

    const mainSlider = new Swiper('.slider__main', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: '.main-arrow-next',
            prevEl: '.main-arrow-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                centeredSlides: true,
                initialSlide: 1,
            },
            576: {
                slidesPerView: 1,
                centeredSlides: false,
                initialSlide: 0,
            },
            1024: {
                slidesPerView: 1,
            },
        },
    });

    const mainSlider2 = new Swiper('.slider__main-2', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: '.main-2-arrow-next',
            prevEl: '.main-2-arrow-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                centeredSlides: true,
                initialSlide: 1,
            },
            576: {
                slidesPerView: 1,
                centeredSlides: false,
                initialSlide: 0,
            },
            1024: {
                slidesPerView: 1,
            },
        },
    });

    const logoSlider = new Swiper('.slider__logos', {
        slidesPerView: 6,
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: '.logo-arrow-next',
            prevEl: '.logo-arrow-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 3,
                centeredSlides: true,
                initialSlide: 1,
            },
            576: {
                slidesPerView: 4,
                centeredSlides: false,
                initialSlide: 0,
            },
            1024: {
                slidesPerView: 6,
            },
        },
    });
    
    const tuneSlider = new Swiper('.slider__tune', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: '.tune-arrow-next',
            prevEl: '.tune-arrow-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                centeredSlides: true,
                initialSlide: 1,
            },
            576: {
                slidesPerView: 1,
                centeredSlides: false,
                initialSlide: 0,
            },
            1024: {
                slidesPerView: 1,
            },
        },
    });

    // Form active

    const nameInput = document.getElementById('feedName');
    const phoneInput = document.getElementById('feedPhone');
    const submitButton = document.getElementById('feedButton');

    function checkInputs() {
        // Проверяем, заполнены ли оба инпута
        if (nameInput.value.trim() !== '' && phoneInput.value.trim() !== '') {
            submitButton.classList.remove('disactive');
            submitButton.classList.add('active');
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove('active');
            submitButton.classList.add('disactive');
            submitButton.disabled = true;
        }
    }

    // Добавляем события на ввод данных в инпуты
    nameInput.addEventListener('input', checkInputs);
    phoneInput.addEventListener('input', checkInputs);


    // OVERLAY | POOP UP's

    // Открытие модального окна
    document.querySelectorAll('.open-modal').forEach(function (modalTrigger) {
        modalTrigger.addEventListener('click', function () {
            const modalName = this.getAttribute('data-modal');
            const overlay = document.querySelector(`.overlay[data-modal="${modalName}"]`);
            if (overlay) {
                overlay.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    // Закрытие модального окна по нажатию на Esc
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });

    // Закрытие модальных окон по клику на элементы с классом close-modal
    document.querySelectorAll('.close-modal').forEach(function (closeTrigger) {
        closeTrigger.addEventListener('click', function () {
            closeAllModals();
        });
    });

    // Закрытие модального окна по клику на overlay
    document.querySelectorAll('.overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (event) {
            // Проверяем, был ли клик на самом overlay, а не на его содержимом
            if (event.target === overlay) {
                closeAllModals();
            }
        });
    });

    // Функция закрытия всех модальных окон
    function closeAllModals() {
        document.querySelectorAll('.overlay.active').forEach(function (overlay) {
            overlay.classList.remove('active');
        });
        document.body.classList.remove('no-scroll');
    }

    // Cities

    document.querySelectorAll('.header__block').forEach(function(block) {
        block.addEventListener('click', function(event) {
            // Проверяем, что клик был на элементе с классом header__subtitle
            if (event.target.classList.contains('header__subtitle')) {
                // Удаляем класс active у всех заголовков внутри текущего блока
                block.querySelectorAll('.header__subtitle').forEach(function(subtitle) {
                    subtitle.classList.remove('active');
                });
                // Добавляем класс active на кликнутый заголовок
                event.target.classList.add('active');
            }
        });
    });

});


