$(document).ready(function() {
  $("#verFotos").click(function() {   
    $('.fotos').modal('show');
  });

  const $menu = document.querySelector('.menu');
  const $wrapper = $menu.querySelector('.menu--wrapper');
  const $items = $menu.querySelectorAll('.menu--item');
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;
  let currentIndex = 0;

  $items.forEach((item, index) => {
    const itemImage = item.querySelector('img');
    itemImage.addEventListener('dragstart', (e) => e.preventDefault());

    item.addEventListener('touchstart', touchStart(index));
    item.addEventListener('touchend', touchEnd);
    item.addEventListener('touchmove', touchMove);

    item.addEventListener('mousedown', touchStart(index));
    item.addEventListener('mouseup', touchEnd);
    item.addEventListener('mouseleave', touchEnd);
    item.addEventListener('mousemove', touchMove);
  });

  window.addEventListener('resize', setPositionByIndex);

  function touchStart(index) {
    return function(event) {
      currentIndex = index;
      startPos = getPositionX(event);
      isDragging = true;
      animationID = requestAnimationFrame(animation);
      $menu.classList.add('is-dragging');
    }
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -100 && currentIndex < $items.length - 1) currentIndex += 1;
    if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

    setPositionByIndex();

    $menu.classList.remove('is-dragging');
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + (currentPosition - startPos);
      setSliderPosition();
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    $wrapper.style.transform = `translateX(${currentTranslate}px)`;
  }

  function setPositionByIndex() {
    const itemWidth = $items[0] ? $items[0].clientWidth : 0; // Verifica si $items[0] está definido antes de acceder a clientWidth
    if (itemWidth) {
      currentTranslate = currentIndex * -itemWidth; // Asegúrate de usar itemWidth solo si está definido
      prevTranslate = currentTranslate;
      setSliderPosition();
    }
  }
  

  // Inicializa la posición de los elementos
  setPositionByIndex();
});
