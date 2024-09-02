document.addEventListener('DOMContentLoaded', function() {

    // Selectors

    // Инициализация значения по умолчанию для селектора sort-selector
const sortSelector = document.querySelector('.sort-selector .custom-select');
if (sortSelector) {
    const firstOption = sortSelector.nextElementSibling.querySelector('option:nth-child(2)');
    if (firstOption) {
        const value = firstOption.value;
        const content = firstOption.textContent;

        // Установите начальное значение
        sortSelector.querySelector('.catalog__sort-value').textContent = content;

        // Обновите скрытый селектор
        sortSelector.nextElementSibling.value = value;

        // Установите это значение как выбранное в выпадающем списке
        const firstItem = sortSelector.querySelector(`.select-items div[data-value="${value}"]`);
        if (firstItem) {
            firstItem.classList.add('same-as-selected');
        }
    }
}

const formDropdown = document.querySelector('.form__dropdown');

if (formDropdown) { // Проверяем, существует ли элемент
    formDropdown.addEventListener('change', function() {
        if (this.value) {
            this.classList.add('has-value');
        } else {
            this.classList.remove('has-value');
        }
    });
}

// Функция для проверки заполненности всех селекторов и последовательной активации
function checkAndActivateSelectors() {
    const selectors = document.querySelectorAll('.form__selector');
    
    selectors.forEach((selector, index) => {
        if (index === 0 || selector.classList.contains('ever-active')) {
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

                // Проверяем заполненность всех селекторов и активируем кнопку сброса
                checkAllSelectorsFilled();
                activateResetButton(); // Вызываем функцию активации кнопки сброса
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

    // Проверяем, есть ли у селектора класс sort-selector
    if (select.classList.contains('sort-selector')) {
        // Обновляем текст выбранного элемента, включая "Сортировать по:"
        selected.innerHTML = `Сортировать по: <span class="catalog__sort-value">${content}</span>`;
    } else {
        // Обновляем текст выбранного элемента без "Сортировать по:"
        selected.innerHTML = `<span class="catalog__sort-value">${content}</span>`;
    }

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
    
    // Закрываем селектор
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

const resetButton = document.querySelector('.form__reset');
if (resetButton) {
    resetButton.addEventListener('click', function(event) {
        event.preventDefault();  // Предотвращаем обновление страницы

        resetSelectors();  // Сбрасываем селекторы
    });
}

function resetSelectors() {
    const selectors = document.querySelectorAll('.custom-select');
    selectors.forEach(selector => {
        const hiddenSelect = selector.nextElementSibling;
        const selectedItem = selector.querySelector('.select-selected');

        // Сбрасываем значение скрытого селектора
        hiddenSelect.value = '';

        // Убираем класс "same-as-selected" у всех элементов списка
        const items = selector.querySelector('.select-items');
        items.querySelector('.same-as-selected')?.classList.remove('same-as-selected');

        // Восстанавливаем текст изначального состояния для select-selected
        const defaultText = selectedItem.dataset.default;
        if (defaultText) {
            selectedItem.innerHTML = defaultText;
        }

        // Возвращаем цвет текста к значению по умолчанию, если он изменялся
        selectedItem.style.color = '#D1D1D1';
    });

    // Деактивируем кнопку сброса и удаляем класс active у элемента reset-sb
    activateResetButton();
    checkAllSelectorsFilled();
}



function activateResetButton() {
    const resetButton = document.querySelector('.form__reset');
    const resetSbElement = document.querySelector('.reset-sb');
    const filledSelectorsCount = Array.from(document.querySelectorAll('.custom-select')).filter(select => {
        const hiddenSelect = select.nextElementSibling;
        return hiddenSelect && hiddenSelect.value;
    }).length;

    if (filledSelectorsCount > 1) {
        resetButton.classList.add('active');
        resetButton.disabled = false;

        if (resetSbElement) {
            resetSbElement.classList.add('active');
        }
    } else {
        resetButton.classList.remove('active');
        resetButton.disabled = true;

        if (resetSbElement) {
            resetSbElement.classList.remove('active');
        }
    }
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

    const sellerSlider = new Swiper('.slider__seller', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: '.seller-arrow-next',
            prevEl: '.seller-arrow-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
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
    if (nameInput) {
        nameInput.addEventListener('input', checkInputs);
    }
    if (phoneInput) {
        phoneInput.addEventListener('input', checkInputs);
    }
    


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

    // Catalog Bar

    // Получаем все колонки и элементы для заполнения
    const columns = document.querySelectorAll('.overlay-catalog-col');
    const breadcrumbItems = [
        document.getElementById('catalogBar1'),
        document.getElementById('catalogBar2'),
        document.getElementById('catalogBar3'),
        document.getElementById('catalogBar4')
    ];
    const breadcrumbSvgs = [
        document.getElementById('catalogBarSvg1'),
        document.getElementById('catalogBarSvg2'),
        document.getElementById('catalogBarSvg3')
    ];

    // Функция для инициализации состояния хлебных крошек
    function initializeBreadcrumbs() {
        // Устанавливаем начальное состояние хлебных крошек
        const firstColumnActiveItem = columns[0].querySelector('.overlay-catalog-item.active');
        if (firstColumnActiveItem) {
            breadcrumbItems[0].textContent = firstColumnActiveItem.querySelector('.overlay-catalog-title').textContent.trim();
        } else {
            breadcrumbItems[0].textContent = 'Каталог'; // Можно оставить "Каталог" если активного элемента нет
        }

        // Скрываем все хлебные крошки и SVG изначально
        breadcrumbItems.forEach(item => item.style.display = 'none');
        breadcrumbSvgs.forEach(svg => svg.style.display = 'none');
        
        // Устанавливаем первую колонку как активную
        columns[0].classList.add('active');
    }

    // Функция для обновления хлебных крошек и активного состояния колонок
    function updateBreadcrumbs() {
        columns.forEach((col, index) => {
            const activeItem = col.querySelector('.overlay-catalog-item.active');
            const breadcrumbItem = breadcrumbItems[index];
            const breadcrumbSvg = breadcrumbSvgs[index - 1]; // SVG-элементы имеют индекс на единицу меньше

            // Определяем, можно ли сделать колонку активной
            const canBeActive = index === 0 || columns[index - 1].querySelector('.overlay-catalog-item.active');
            
            if (canBeActive) {
                col.classList.add('active'); // Добавляем класс active к колонке, если она может быть активной
            } else {
                col.classList.remove('active'); // Убираем класс active, если она не может быть активной
            }

            if (activeItem) {
                breadcrumbItem.textContent = activeItem.querySelector('.overlay-catalog-title').textContent.trim();
                breadcrumbItem.style.display = 'inline'; // Показываем текст
                if (breadcrumbSvg) {
                    breadcrumbSvg.style.display = 'inline'; // Показываем SVG
                }
            } else {
                breadcrumbItem.textContent = '';
                breadcrumbItem.style.display = 'none'; // Скрываем текст
                if (breadcrumbSvg) {
                    breadcrumbSvg.style.display = 'none'; // Скрываем SVG
                }
            }
        });
    }

    // Основной код для обработки кликов на элементах
    columns.forEach((col, colIndex) => {
        // Получаем все элементы внутри колонки
        const items = col.querySelectorAll('.overlay-catalog-item');
    
        items.forEach((item) => {
            item.addEventListener('click', () => {
                // Условие для первой колонки: всегда можно выбирать
                if (colIndex === 0 || columns[colIndex - 1].querySelector('.overlay-catalog-item.active')) {
                    // Удаляем класс active у всех элементов в текущей колонке
                    items.forEach((el) => el.classList.remove('active'));
                    // Добавляем класс active к текущему элементу
                    item.classList.add('active');
    
                    // Убираем класс active и добавляем класс choosed к текущей колонке
                    col.classList.remove('active');
                    col.classList.add('choosed');
    
                    // Обновляем хлебные крошки после выбора
                    updateBreadcrumbs();
    
                    // Проверяем, является ли текущая колонка последней
                    if (colIndex === columns.length - 1) {
                        // Переход на страницу catalog.html
                        window.location.href = '/catalog.html';
                    }
                }
            });
        });
    });

    // Инициализация хлебных крошек при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        initializeBreadcrumbs();
        updateBreadcrumbs(); // Добавляем вызов updateBreadcrumbs для правильного начального состояния
    });

    // Иконка кнопки

    // Получаем все элементы, которые нам нужны
    const catalogOverlay = document.querySelector('.overlay[data-modal="catalog"]');
    const catalogButtonColor = document.querySelector('button.header__catalog-btn');
    const catalogButton = document.querySelector('button.header__catalog-btn img');

    // Функция для обновления изображения кнопки
    function updateCatalogButtonImage() {
        if (catalogOverlay.classList.contains('active')) {
            // Если каталог активен, меняем изображение на закрытое
            catalogButton.src = 'img/icons/burger_close.svg';
            catalogButtonColor.classList.add('active');
        } else {
            // Если каталог неактивен, меняем изображение на открытое
            catalogButton.src = 'img/icons/burger_open.svg';
            catalogButtonColor.classList.remove('active');

        }
    }

    // Обработчик события изменения класса у каталога
    function handleCatalogOverlayChange() {
        // Проверяем наличие класса active
        updateCatalogButtonImage();
    }

    // Отслеживаем изменения класса у каталога с помощью MutationObserver
    const observer = new MutationObserver(handleCatalogOverlayChange);

    // Наблюдаем за изменениями классов у элемента каталога
    observer.observe(catalogOverlay, { attributes: true, attributeFilter: ['class'] });

    // Обновляем изображение кнопки при первоначальной загрузке
    document.addEventListener('DOMContentLoaded', updateCatalogButtonImage);

    // Catalog

    const subcategoryTriggers = document.querySelectorAll('.arrow-offer');

    if (subcategoryTriggers) {
        subcategoryTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(event) {
                event.preventDefault();
                // Находим следующий элемент, который является списком подкатегорий
                const subcategoryList = this.nextElementSibling;
                if (subcategoryList && subcategoryList.classList.contains('catalog__subcategory-list')) {
                    if (subcategoryList.style.display === 'none' || subcategoryList.style.display === '') {
                        subcategoryList.style.display = 'block';
                    } else {
                        subcategoryList.style.display = 'none';
                    }
                }
            });
        });
    }

    // Range

    const minRange = document.getElementById('min-range');
    const maxRange = document.getElementById('max-range');
    const minValue = document.getElementById('min-value');
    const maxValue = document.getElementById('max-value');

    function updateValues() {
        minValue.value = minRange.value;
        maxValue.value = maxRange.value;
    }

    if(minRange && maxRange && minValue && maxValue) {
        minRange.addEventListener('input', function() {
            if (parseInt(minRange.value) > parseInt(maxRange.value)) {
                minRange.value = maxRange.value;
            }
            updateValues();
        });
    
        maxRange.addEventListener('input', function() {
            if (parseInt(maxRange.value) < parseInt(minRange.value)) {
                maxRange.value = minRange.value;
            }
            updateValues();
        });
    
        minValue.addEventListener('input', function() {
            if (parseInt(minValue.value) > parseInt(maxValue.value)) {
                minValue.value = maxValue.value;
            }
            minRange.value = minValue.value;
            updateValues();
        });
    
        maxValue.addEventListener('input', function() {
            if (parseInt(maxValue.value) < parseInt(minValue.value)) {
                maxValue.value = minValue.value;
            }
            maxRange.value = maxValue.value;
            updateValues();
        });
    }

    

    // Catalog Size

        // Выбираем элементы для переключения
        const size1 = document.querySelector('.catalog__size-1');
        const size2 = document.querySelector('.catalog__size-2');
        const discountItems = document.querySelectorAll('.discounts__item');

        if (size1 && size2) {
            // Обработчик для catalog__size-1
            size1.addEventListener('click', () => {
                // Добавляем класс 'full' всем элементам discounts__item
                discountItems.forEach(item => {
                    item.classList.add('full');
                });

                // Добавляем класс 'active' для catalog__size-1 и убираем его у catalog__size-2
                size1.classList.add('active');
                size2.classList.remove('active');
            });

            // Обработчик для catalog__size-2
            size2.addEventListener('click', () => {
                // Убираем класс 'full' у всех элементов discounts__item, если он есть
                discountItems.forEach(item => {
                    item.classList.remove('full');
                });

                // Добавляем класс 'active' для catalog__size-2 и убираем его у catalog__size-1
                size2.classList.add('active');
                size1.classList.remove('active');
            });

        }

        
        // Top

        document.addEventListener('scroll', () => {
            const scrollTopButton = document.querySelector('.top');
            const scrollThreshold = document.documentElement.scrollHeight * 0.8;
        
            if(scrollTopButton) {
                if (window.scrollY + window.innerHeight >= scrollThreshold) {
                    scrollTopButton.style.display = 'flex';
                } else {
                    scrollTopButton.style.display = 'none';
                }
            }

           
        });
        

        // Nav-links

        const navLinks = document.querySelectorAll('.text__nav-subtitle');

        if (navLinks) {
            navLinks.forEach(link => {
                link.addEventListener('click', function (event) {
                    // Удаляем класс 'active' у всех ссылок
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Добавляем класс 'active' к текущей нажатой ссылке
                    this.classList.add('active');
                });
            });
        }
        
        // FAQ

        const faqItems = document.querySelectorAll('.text__faq');

        if (faqItems) {
            faqItems.forEach(item => {
                item.addEventListener('click', function () {
                    // Проверяем, есть ли уже класс 'active'
                    const isActive = this.classList.contains('active');
    
                    // Сначала снимаем класс 'active' со всех элементов
                    faqItems.forEach(faq => faq.classList.remove('active'));
    
                    // Если кликнутый элемент не был активным, добавляем ему класс 'active'
                    if (!isActive) {
                        this.classList.add('active');
                    }
                });
            });
        }
    
    // Line-reviews

    const lines = document.querySelectorAll('.seller__reviews-line');
    
    if(lines) {
        lines.forEach(line => {
            const percentage = line.getAttribute('data-percentage');
            const beforeElement = document.createElement('div');
            beforeElement.style.width = percentage + '%';
            beforeElement.style.height = '100%';
            beforeElement.style.background = '#848589';
            beforeElement.style.borderRadius = '32px';
            beforeElement.style.position = 'absolute';
            beforeElement.style.top = '0';
            beforeElement.style.left = '0';
            line.appendChild(beforeElement);
        });
    }

    // Card images

    // Получаем все миниатюры изображений
    const thumbnails = document.querySelectorAll('.card__images-img');
    // Получаем главное изображение
    const mainImage = document.querySelector('.card__image');

    // Добавляем обработчик событий для каждого миниатюрного изображения

    if (thumbnails) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Удаляем класс active у всех миниатюр
                thumbnails.forEach(img => img.classList.remove('active'));
                
                // Добавляем класс active к кликнутой миниатюре
                this.classList.add('active');
                
                // Меняем главное изображение на изображение кликнутой миниатюры
                mainImage.src = this.src;
            });
        });
    }
    
    

});

