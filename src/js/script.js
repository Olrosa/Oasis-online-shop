// Dropdown

document.querySelector('.form__dropdown').addEventListener('change', function() {
    if (this.value) {
        this.classList.add('has-value');
    } else {
        this.classList.remove('has-value');
    }
});

// Selectors

const selectors = document.querySelectorAll('.form__selector');

selectors.forEach((selector, index) => {
    const selectElement = selector.querySelector('select');

    // Добавляем обработчик события change к каждому select
    selectElement.addEventListener('change', function () {
        if (this.value) {
            // Активируем следующий селектор, если выбран текущий
            const nextSelector = selectors[index + 1];
            if (nextSelector) {
                nextSelector.classList.remove('disactive');
                nextSelector.classList.add('active');
                nextSelector.querySelector('select').disabled = false;
            }
        }
    });
});