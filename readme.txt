1. Hàm khởi tạo các biến chọn đến các phần tử trong DOM
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

- Sử dụng biến $, $$ để chọn các phần tử trong DOM
- các biến được gán cho các phần tử giao diện người dùng như tiêu đề, cd, audio,các nút tương tác với audio

2. Khởi tạo đối tượng app.
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        // Danh sách bài hát
    ],

- currentIndex: Vị trí bài hát hiện tại
- isPlaying: trạng thái của bài hát hiện tại (đang chạy hay không)
- isRandom: trạng thái phát ngẫu nhiên của trình phát nhạc
- isRepeat: trạng thái lặp lại bài hát
- songs: chứa danh sách các bài hát, gồm tên nghệ sĩ, tên bài hát, src ảnh, src mp3.

3. Hàm render
render: function () {
    const htmls = this.songs.map((song, index) => {
        return `
        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index=${index}>
            <div class="thumb" style="background-image: url('${song.image}')"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
        </div>
    `;
    });
    $(".playlist").innerHTML = htmls.join("");
},
- render ra danh sách bài hát với dữ liệu được lấy trong songs
- duyệt qua từng phần tử bằng map và chén vào ".playlist" trong DOM

4. defineProperties
defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
        get: function () {
            return this.songs[this.currentIndex];
        },
    });
},

- định nghĩa thuộc tính currenSong trả về bài hát hiện tại dựa trên currentIndex

5. Handle Events
- Xử lý các sự kiện cho trình phát nhạc, xử lý khi người dùng tương tác với các button trên trang web
- Xử lý sự kiện cho việc cuộn trang, phát/ tạm dừng, tua bài hát, chuyển bài hát, phát ngẫu nhiên
, phát lặp bài hát, chọn bài hát từ danh sách bài hát.

Xử lý quay CD thumb:
    const cdThumbAnimate = cdThumb.animate(
        [{ transform: "rotate(360deg)" }],
        { duration: 10000, iterations: Infinity }
    );
    cdThumbAnimate.pause();
Xử lý việc cuôn trang: 
    document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth;
    };
Xử lý click play song:
    playBtn.onclick = function () {
        if (_this.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };
Xử lý tua bài hát:
    audio.ontimeupdate = function () {
        if (audio.duration) {
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            progress.value = progressPercent;
        }
    };
    progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
    };
Xử lý next bài hát:
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
Xử lý prev bài hát:
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
Xử lý random bài hát:
    randomBtn.onclick = function () {
        _this.isRandom = !_this.isRandom;
        randomBtn.classList.toggle("active", _this.isRandom);
    };
Xử lý next bài hát khi audio ended:
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
Xử lý repeat bài hát khi audio ended:
    repeatBtn.onclick = function () {
        _this.isRepeat = !_this.isRepeat;
        repeatBtn.classList.toggle("active", _this.isRepeat);
    };
Xử lý sự kiện click vào bài hát trong playlist
    playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute("data-index"));
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        };
6. loadCurrentSong
loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
},
- Tải thông tin bài hát hiện tại lên giao diện.
7. nextSong
nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
    }
    this.loadCurrentSong();
},
- Chuyển sang bài hát tiếp theo
8. prevSong
prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
},
- Chuyển sang bài hát trước đó
9. playRandomSong
playRandomSong: function () {
    var newIndex;
    do {
        newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
},
- Phát một bài hát ngẫu nhiên, đảm bảo không trùng với bài hát hiện tại
10. start
start: function () {
    this.render();
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
},
Khởi chạy ứng dụng, thiết lập trình phát nhạc.
