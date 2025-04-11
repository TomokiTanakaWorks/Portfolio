// モーダルウィンドウに埋め込んだYouTube動画を表示
const modalItems = document.querySelectorAll(".image-item");
modalItems.forEach((item, index) => {
    const image = item.querySelector("img");
    const modal = document.getElementById(`myModal${index + 1}`);
    const closeBtn = modal.querySelector(".close");
    const modalVideo = modal.querySelector(".modal-video");

    // 画像をクリックしたときにモーダルを表示
    image.onclick = function() {
        modal.style.display = "block";
        // 各モーダルに対応するYouTube動画を表示
        modalVideo.src = `https://www.youtube.com/embed/dQw4w9WgXcQ`; // YouTubeのURLに変更
    }

    // 閉じるボタンをクリックしたときにモーダルを非表示にする
    closeBtn.onclick = function() {
        modal.style.display = "none";
        //modalVideo.src = ""; 
        modal.querySelector('iframe').src = modal.querySelector('iframe').src;// モーダルを閉じたときに動画を停止
    }

    // モーダル外をクリックした場合にもモーダルを閉じる
    modal.onclick = function(event) {
        // モーダル外（コンテンツ以外）をクリックした場合のみ閉じる
        if (event.target === modal) {
            modal.style.display = "none";
            //modalVideo.src = ""; 
            modal.querySelector('iframe').src = modal.querySelector('iframe').src;// モーダルを閉じたときに動画を停止
        }
    }
});


// ページトップへ戻るボタンの表示制御
window.addEventListener('scroll', function() {
    var pagetop = document.getElementById('pagetop');
    
    // スクロール位置が100pxを超えたら表示、それ未満なら非表示
    if (window.scrollY > 500) {
        pagetop.style.display = 'block'; // ボタンを表示
    } else {
        pagetop.style.display = 'none'; // ボタンを非表示
    }
});

// ボタンクリックでページトップに戻る
document.getElementById('pagetop').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // スムーズにページトップへスクロール
});