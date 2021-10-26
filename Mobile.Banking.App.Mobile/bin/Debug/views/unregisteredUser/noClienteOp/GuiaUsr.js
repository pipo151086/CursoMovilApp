MobileBanking_App.GuiaUsr = function (params) {
    "use strict";

    const myItems = [
        '<div class="myitem"><img src="images/iconos/1-5.jpg" /></div>',
        '<div class="myitem"><img src="images/iconos/2-5.jpg" /></div>',
        '<div class="myitem"><img src="images/iconos/3-5.jpg" /></div>',
        '<div class="myitem"><img src="images/iconos/4-5.jpg" /></div>',
        '<div class="myitem"><img src="images/iconos/5-5.jpg" /></div>',
    ];

    var viewModel = {
        viewShown: function () {
            $('#slideLogo').focus();

            var mySwipe = new SwiperBox({ items: myItems });
            mySwipe.HTMLElement.style.width = '100%';
            mySwipe.HTMLElement.classList.add("mygal");
            document.getElementById("SlideBox").appendChild(mySwipe.HTMLElement);
            mySwipe.onSwipe = function (index, elem) {
                $('#galIndicator' + (index - 1)).removeClass("dx-gallery-indicator-item-selected");
                $('#galIndicator' + (index + 1)).removeClass("dx-gallery-indicator-item-selected");
                $('#galIndicator' + index).addClass("dx-gallery-indicator-item-selected");
            }
            /*mySwipe.onClick = function (index, elem) {
                alert("clicked on index" + index);
            }*/
        },
        viewShowing: function () {
            hideFloatButtons();
        },
        clickBack: function () { MobileBanking_App.app.navigate('LandingPage', { root: true }); }
    };


    return viewModel;
};