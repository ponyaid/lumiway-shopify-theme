$(document).ready(() => {
  $(".main-product__thumbnails").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    focusOnSelect: true,
    infinite: false,
  });

  $(".featured-collection__items").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    infinite: true,
    responsive: [
      {
        breakpoint: 1201,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 1,
        },
      },
    ],
  });
});
