$(document).ready(function () {
    var lb = $("#toleft1");
    var rb = $("#right-btn1");
    var ul = $("#wrap-ul");
    var lis = ul.find("li");

    var classes = ["b1", "b1", "cc", "b1", "b1"];

    function toright() {
        var last_class = classes.pop();
        classes.unshift(last_class);
        lis.each(function (index) {
            $(this).removeClass().addClass(classes[index]);
        });
        updateActiveDot();
    }

    function toleft1() {
        var first_class = classes.shift();
        classes.push(first_class);
        lis.each(function (index) {
            $(this).removeClass().addClass(classes[index]);
        });
        updateActiveDot();
    }

    rb.click(toright);
    lb.click(toleft1);

    var dotsContainer = $("#dots-container");

    lis.each(function () {
        var dot = $("<span></span>").addClass("dot");
        dotsContainer.append(dot);
    });

    var dots = dotsContainer.find("span");

    function updateActiveDot() {
        var activeIndex = classes.indexOf("cc");
        dots.removeClass("active");
        dots.eq(activeIndex).addClass("active");
    }

    dots.click(function () {
        var dotIndex = dots.index($(this));
        var diff = dotIndex - classes.indexOf("cc");

        if (diff > 0) {
            for (var j = 0; j < diff; j++) {
                toright();
            }
        } else if (diff < 0) {
            for (var j = 0; j < -diff; j++) {
                toleft1();
            }
        }
    });

    var timer = setInterval(toright, 2000);

    ul.mouseenter(function () {
        clearInterval(timer);
        timer = null;
    });

    ul.mouseleave(function () {
        timer = setInterval(toright, 2000);
    });
});
