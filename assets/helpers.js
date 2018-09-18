export const findParent = (el, className) => {
    let _this = el;

    while (_this && !_this.classList.contains(className)) {
        _this = _this.parentNode;

        if (_this === document.body) {
            _this = null;
        }
    }

    return _this;
}
