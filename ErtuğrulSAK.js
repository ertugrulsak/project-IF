(() => {
    const self = {};

    const init = () => {
        self.buildHTML();
        self.buildCSS();
        self.fetchData();
        self.setEvents();
    };

    self.buildHTML = () => {
        const html = `
            <div class="slider-container">
                <button id="prev" class="slider-btn">&#10094;</button>
                <div id="urunListesi" class="urun-listesi"></div>
                <button id="next" class="slider-btn">&#10095;</button>
            </div>
        `;
        $('.product-detail').append(html);
    };

    self.buildCSS = () => {
        const css = `
            .slider-container {
                position: relative;
                width: 70%;
                margin: auto;
                overflow: hidden;
            }
            .urun-listesi {
                display: flex;
                gap: 15px;
                transition: transform 0.5s ease-in-out;
                width: max-content;
            }
            .urun {
                width: 250px;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
                flex-shrink: 0;
                position: relative;
            }
            .urun img {
                width: 100%;
                height: auto;
                border-radius: 5px;
            }
            .favori-btn {
                width: 30px;
                background-color: #fff;
                border-radius: 4px;
                font-size: 24px;
                cursor: pointer;
                color: gray;
                position: absolute;
                top: 20px;
                right: 20px;
            }
            .favori-btn.favori {
                color: blue;
            }
            .slider-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                padding: 15px;
                cursor: pointer;
                font-size: 30px;
                z-index: 10;
            }
            .slider-btn:hover {
                background: rgba(0, 0, 0, 0.8);
            }
            #prev {
                left: 10px;
            }
            #next {
                right: 10px;
            }
        `;
        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };

    self.fetchData = () => {
        let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
        $.getJSON("https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json", function(data) {
            $("#urunListesi").empty();
            data.forEach(urun => {
                let isFavori = favoriler.includes(urun.id);
                let urunHtml = `
                    <div class="urun" data-id="${urun.id}">
                        <img src="${urun.img}" alt="${urun.name}">
                        <h3 onclick="window.open('${urun.url}', '_blank')">${urun.name}</h3>
                        <p>${urun.price} TL</p>
                        <span class="favori-btn ${isFavori ? 'favori' : ''}" data-id="${urun.id}">&#9829;</span>
                    </div>
                `;
                $("#urunListesi").append(urunHtml);
            });
        }).fail(() => alert("Ürünleri çekerken bir hata oluştu!"));
    };

    self.setEvents = () => {
        let currentIndex = 0;
        const visibleItems = 6;
        const itemWidth = 265;
        $(document).on('click', '.favori-btn', function() {
            let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
            let urunId = $(this).data('id');
            if ($(this).hasClass('favori')) {
                $(this).removeClass('favori');
                favoriler = favoriler.filter(id => id !== urunId);
            } else {
                $(this).addClass('favori');
                favoriler.push(urunId);
            }
            localStorage.setItem('favoriler', JSON.stringify(favoriler));
        });

        $("#next").click(() => {
            let totalItems = $(".urun").length;
            let maxIndex = totalItems - visibleItems;
            if (currentIndex < maxIndex) {
                currentIndex++;
                let newTranslate = -currentIndex * itemWidth;
                $("#urunListesi").css("transform", `translateX(${newTranslate}px)`);
            }
        });

        $("#prev").click(() => {
            if (currentIndex > 0) {
                currentIndex--;
                let newTranslate = -currentIndex * itemWidth;
                $("#urunListesi").css("transform", `translateX(${newTranslate}px)`);
            }
        });
    };

    init();
})();
