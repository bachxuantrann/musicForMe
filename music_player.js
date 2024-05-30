/**
 * 1. render songs
 * 2. scroll top
 * 3. play / pause / seek
 * 4. cd rotate
 * 5. next / previous
 * 6. random
 * 7. next / repeat when ended
 * 8. active song
 * 9. scoroll active song into view
 * 10. play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const playList = $(".playlist");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const preBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "purshin P",
            singer: "Wxrdie",
            path: "./assets/music/purshinP.mp3",
            image: "./assets/img/purshinP_image.jpg",
        },
        {
            name: "LAVIAI",
            singer: "Wxrdie",
            path: "./assets/music/laviai.mp3",
            image: "./assets/img/laviai_image.jpg",
        },
        {
            name: "NHU NAO CUNG DUOC",
            singer: "Wxrdie",
            path: "./assets/music/nhunaocungduoc.mp3",
            image: "./assets/img/nhunaocungduoc_image.jpg",
        },
        {
            name: "The party never ends",
            singer: "Wxrdie",
            path: "./assets/music/thepartyneverends.mp3",
            image: "./assets/img/thepartyneverends_image.jpg",
        },
        {
            name: "Vẫn Đợi",
            singer: "Wxrdie",
            path: "./assets/music/vandoi.mp3",
            image: "./assets/img/vandoi_image.jpg",
        },
        {
            name: "Young boi si tình",
            singer: "Wxrdie",
            path: "./assets/music/youngboisitinh.mp3",
            image: "./assets/img/younboisitinh_image.jpg",
        },
        {
            name: "Chưa được yêu như thế",
            singer: "Trang",
            path: "./assets/music/chuaDuocYeuNhuThe.mp3",
            image: "./assets/img/chuaDuocYeuNhuThe_image.jpg",
        },
        {
            name: "Thanh Xuân",
            singer: "Dalab",
            path: "./assets/music/thanhXuan.mp3",
            image: "./assets/img/thanhXuan_image.jpg",
        },
        {
            name: "Vùng Ký Ức",
            singer: "Lâm Bảo Ngọc",
            path: "./assets/music/vungKyUc.mp3",
            image: "./assets/img/vungKyUc_image.jpg",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${
                index === this.currentIndex ? "active" : ""
            }" data-index =${index}>
                <div class="thumb" style="background-image: url('${
                    song.image
                }')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
            </div>
        `;
        });
        $(".playlist").innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xu ly CD rotation and pause
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 10000, // 10 seconds
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        // Xu ly phong tu / thu nho CD
        document.onscroll = function () {
            const scorollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scorollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        // Xu ly khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // Khi song duoc play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        // Khi song duoc pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };
        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };
        // Xu ly khi tua
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };
        // Khi next bai hat
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrolltoActiveSong();
        };
        // Khi prev bai hat
        preBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrolltoActiveSong();
        };
        // Bat tat random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        };
        // Xu ly next song khi audio ended
        audio.onended = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else if (_this.isRepeat) {
                audio.play();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
        };
        // Xu ly repeat khi audio ended
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };
        // Lang nghe click vao playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                if (songNode) {
                    _this.currentIndex = Number(
                        songNode.getAttribute("data-index")
                    );
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        };
    },
    // scroll to active song
    scrolltoActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 200);
    },
    // tai len bai hat
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    // chuyen tiep bai hat
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // Quay lai bai hat truoc do
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    // Chay random 1 bai hat
    playRandomSong: function () {
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        this.render();
        // Dinh nghia thuoc tinh cho obj
        this.defineProperties();
        // Lang nghe dom events
        this.handleEvents();
        this.loadCurrentSong();
        // Render playlist
    },
};

app.start();
